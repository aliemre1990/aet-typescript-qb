import type { DbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import type Table from "../table/table.js";
import { queryBuilderContextFactory, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbOperations } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type { SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "./_types/result.js";
import type { AccumulateSubQueryParams, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type ColumnsSelection from "./ColumnsSelection.js";
import type CTEObject from "./cteObject.js";
import type QueryParam from "./param.js";
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
} from "./queryBuilder.js";
import type { MapToQueryColumns } from "../table/table.js";
import type { IQueryTable } from "./_interfaces/IQueryTable.js";

type MapQueryColumnsToRecord<TColumns extends readonly QueryColumn<any, any, any, any, any, any, any>[]> = {
    [C in TColumns[number]as C["fieldName"]]: C
}

class QueryTable<
    TDbType extends DbType,
    TTableName extends string,
    TQColumns extends readonly QueryColumn<TDbType, any, any, any, any, any, any>[],
    TAsName extends string | undefined = undefined
> implements
    IQueryTable<TDbType, TAsName extends undefined ? TTableName : TAsName, TQColumns> {

    dbType: TDbType;
    name: TAsName extends undefined ? TTableName : TAsName;
    columnsList: TQColumns;

    columns: MapQueryColumnsToRecord<TQColumns>;
    tableName: TTableName;

    constructor(
        dbType: TDbType,
        tableName: TTableName,
        columnsList: TQColumns,
        public asName?: TAsName
    ) {
        this.dbType = dbType;
        this.name = (asName === undefined ? tableName : asName) as TAsName extends undefined ? TTableName : TAsName;
        this.columnsList = columnsList;

        this.tableName = tableName;

        this.columns = columnsList.reduce((prev, curr) => {
            prev[curr.fieldName] = curr;

            return prev;
        }, {} as { [key: string]: QueryColumn<TDbType, any, any, any, any, any, any> }) as typeof this.columns;
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: this.name, params: context.params };
    }

    select(): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, TQColumns, TAsName>],
        undefined,
        undefined,
        undefined,
        SelectToAllColumnsMapRecursively<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined>,
        undefined,
        undefined
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>]>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, TQColumns, TAsName>],
        undefined,
        undefined,
        undefined,
        CalculateSelectResult<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined, TCbResult, TFinalResult>,
        CalculateSelectParams<undefined, TCbResult, TFinalResult>
    >
    select(
        cb?: any
    ): any {
        if (cb === undefined) {
            return new QueryBuilder(this.dbType, [this], undefined, undefined).select()
        } else {
            return new QueryBuilder(this.dbType, [this], undefined, undefined).select(cb);
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
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], TJoinAccumulated>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TTableName, TQColumns, TAsName>],
            TJoinAccumulated,
            undefined,
            undefined,
            undefined,
            TJoinParamsResult
        > {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined, undefined, undefined>(this.dbType, [this], undefined, undefined)
            .join(type, tableSelection, cb);
    }

    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>]>>,
            ops: DbOperations<TDbType>
        ) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined, undefined, undefined>(this.dbType, [this], undefined, undefined).where(cb);
    }


    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>]>>,
        ops: DbOperations<TDbType>
    ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TTableName, TQColumns, TAsName>],
        undefined,
        undefined,
        undefined,
        undefined,
        AccumulateColumnParams<undefined, TCbResult>
    > {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined, undefined, undefined>(this.dbType, [this], undefined, undefined).groupBy(cb);
    }

    orderBy<
        const TCbResult extends OrderBySpecsType<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>]>>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TTableName, TQColumns, TAsName>],
            undefined,
            undefined,
            undefined,
            undefined,
            AccumulateOrderByParams<TDbType, undefined, TCbResult>
        > {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TTableName, TQColumns, TAsName>], undefined, undefined, undefined>(this.dbType, [this], undefined, undefined).orderBy(cb);
    }

}

export default QueryTable;