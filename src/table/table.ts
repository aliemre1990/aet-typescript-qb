import { DbType, dbTypes, PgDbType } from "../db.js";
import type { PgColumnType } from "./columnTypes.js";
import
QueryBuilder,
{
    type CalculateSelectParams,
    type CalculateSelectResult,
    type ComparisonType,
    type GroupBySpecs,
    type JoinSpecsTableType,
    type JoinSpecsType,
    type JoinType,
    type OrderBySpecsType,
    type ResultShape
} from "../query/queryBuilder.js";
import type { TablesToObject, TableToColumnsMap } from "../query/_types/miscellaneous.js";
import type { SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "../query/_types/result.js";
import Column from "./column.js";
import QueryColumn from "../query/queryColumn.js";
import QueryTable from "../query/queryTable.js";
import type { DbOperations } from "../query/_types/ops.js";
import type { IDbType } from "../query/_interfaces/IDbType.js";
import type { AccumulateColumnParams } from "../query/_types/paramAccumulationSelect.js";
import type { AccumulateSubQueryParams, MapToSubQueryObject } from "../query/_types/subQueryUtility.js";
import type { AccumulateOrderByParams } from "../query/_types/paramAccumulationOrderBy.js";
import type CTEObject from "../query/cteObject.js";
import type QueryParam from "../query/param.js";
import type { AccumulateComparisonParams } from "../query/_types/paramAccumulationComparison.js";
import type { IName } from "../query/_interfaces/IName.js";
import type ColumnsSelection from "../query/ColumnsSelection.js";
import type { IQueryExpression } from "../query/_interfaces/IQueryExpression.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { IQueryTable } from "../query/_interfaces/IQueryTable.js";

type TableSpecsType<TTableName extends string = string> = { tableName: TTableName }

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

/**
 * Use TTableName variable instead of infering it from 'First' column object. When infered it causes errors in intellisense.
 */
type MapToQueryColumns<TDbType extends DbType, TTableName extends string, TColumns extends readonly any[], TAsTableName extends string | undefined = undefined> =
    TColumns extends readonly [infer First, ...infer Rest] ?
    First extends Column<TDbType, any, infer TColumnName, any, any, infer TValueType, infer TFinalValueType> ?
    [QueryColumn<TDbType, TColumnName, { tableName: TTableName, asTableName: TAsTableName }, TValueType, TFinalValueType>, ...MapToQueryColumns<TDbType, TTableName, Rest, TAsTableName>] :
    never :
    []
    ;

type MapToColumnsRecord<TColumns extends readonly Column<any, any, any, any, any, any, any>[]> = {
    [C in TColumns[number]as C["name"]]: C
}

class Table<
    TDbType extends DbType,
    TColumns extends readonly Column<TDbType, any, any, any, any, any, any>[],
    TTableName extends string
> implements
    IDbType<TDbType>,
    IName<TTableName> {

    dbType: TDbType;
    name: TTableName;

    columns: MapToColumnsRecord<TColumns>;

    constructor(
        dbType: TDbType,
        name: TTableName,
        public columnsList: TColumns,
        public primaryKeys?: (string[])[],
        public uniqueKeys?: (string[])[],
        public foreignKeys?: ForeignKey[]
    ) {
        this.dbType = dbType;
        this.name = name;

        this.columns = columnsList.reduce((prev, curr) => {
            prev[curr.name] = curr;

            return prev;
        }, {} as { [key: string]: Column<TDbType, any, any, any, any, any, any> }) as typeof this.columns;

    }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: val }, undefined, undefined);
        }) as MapToQueryColumns<TDbType, TTableName, TColumns, TAsName>;

        return new QueryTable<TDbType, TTableName, typeof queryColumns, TAsName>(this.dbType, this.name, queryColumns, val);
    }

    select(): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>],
        undefined,
        undefined,
        undefined,
        SelectToAllColumnsMapRecursively<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>], undefined>,
        undefined,
        undefined
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>]>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>],
        undefined,
        undefined,
        undefined,
        CalculateSelectResult<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>], undefined, TCbResult, TFinalResult>,
        CalculateSelectParams<undefined, TCbResult, TFinalResult>
    >
    select(
        cb?: any
    ): any {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: undefined }, undefined, undefined);
        });

        const queryTable = new QueryTable(this.dbType, this.name, queryColumns);

        if (cb === undefined) {
            return queryTable.select();
        } else {
            return queryTable.select(cb);
        }
    }

    join<
        TJoinType extends JoinType,
        TJoinTable extends IQueryTable<TDbType, any, any> | Table<TDbType, any, any> | QueryBuilder<TDbType, any, any, any, any, any, any, string, any>,
        TCbResult extends ComparisonType<TDbType>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinTableName,
            MapToQueryColumns<TDbType, TJoinTableName, TJoinCols>
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, any, string, any> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TJoinParams extends QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<TCbResult>>,
        TJoinParamsResult extends QueryParam<TDbType, any, any, any, any>[] | undefined = TJoinParams["length"] extends 0 ? undefined : TJoinParams,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = [{ joinType: TJoinType, table: TJoinResult, comparison: ComparisonType<TDbType> }]

    >(
        type: TJoinType,
        tableSelection: TJoinTable | (() => TJoinTable),
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>>], TJoinAccumulated>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>],
            TJoinAccumulated,
            undefined,
            undefined,
            undefined,
            TJoinParamsResult
        > {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: undefined }, undefined, undefined);
        }) as MapToQueryColumns<TDbType, TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>>(this.dbType, this.name, queryColumns);

        return queryTable.join(type, tableSelection, cb);
    }

    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>]>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: undefined }, undefined, undefined);
        }) as MapToQueryColumns<TDbType, TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>(this.dbType, this.name, queryColumns);

        return queryTable.where(cb);
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>]>>,
        ops: DbOperations<TDbType>
    ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>],
        undefined,
        undefined,
        undefined,
        undefined,
        AccumulateColumnParams<undefined, TCbResult>
    > {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: undefined }, undefined, undefined);
        }) as MapToQueryColumns<TDbType, TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>(this.dbType, this.name, queryColumns);

        return queryTable.groupBy(cb);
    }

    orderBy<
        const TCbResult extends OrderBySpecsType<TDbType>
    >(cb: (tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>]>>) => TCbResult):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>],
            undefined,
            undefined,
            undefined,
            undefined,
            AccumulateOrderByParams<TDbType, undefined, TCbResult>
        > {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col.name, { tableName: this.name, asTableName: undefined }, undefined, undefined);
        }) as MapToQueryColumns<TDbType, TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TTableName, MapToQueryColumns<TDbType, TTableName, TColumns>, undefined>(this.dbType, this.name, queryColumns);

        return queryTable.orderBy(cb);
    }
}

function pgTable<
    TTableName extends string,
    const TColumns extends Column<PgDbType, PgColumnType, string, TableSpecsType<string>, boolean, any, any>[],
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {

    type MapToFinalColumns<TColumns extends readonly any[]> =
        TColumns extends readonly [infer First, ...infer Rest] ?
        First extends Column<infer TDbType, infer TType, infer TColumnName, any, infer TIsNullable> ?
        [Column<TDbType, TType, TColumnName, TableSpecsType<TTableName>, TIsNullable>, ...MapToFinalColumns<Rest>] :
        never :
        []
        ;

    type TFinalColumns = MapToFinalColumns<TColumns>;

    return new Table<PgDbType, TFinalColumns, TTableName>(
        dbTypes.postgresql,
        name,
        columns as unknown as TFinalColumns,
        primaryKeys,
        uniqueKeys,
        foreignKeys
    );
}

function pgColumn<
    TColumnName extends string,
    TColumnType extends PgColumnType,
    TIsNull extends boolean,
>(
    name: TColumnName,
    type: TColumnType,
    isNullable: TIsNull
): Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull> {
    return new Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull>(dbTypes.postgresql, name, type, isNullable);
}

export default Table;

export {
    ForeignKey,
    pgTable,
    pgColumn
}

export type {
    TableSpecsType,
    MapToQueryColumns
}