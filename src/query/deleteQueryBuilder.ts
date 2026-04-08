import type { DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import BaseDMLQueryBuilder from "./_baseClasses/BaseDMLQueryBuilder.js";
import type { QueryResultSpecsType } from "./_baseClasses/BaseQueryBuilder.js";
import { queryBuilderContextFactory, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbOperations } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import { columnsSelectionFactory } from "./ColumnsSelection.js";
import type QueryParam from "./param.js";
import type { ColumnsSelectionListType, ComparisonType, CTESpecsType, ResultShape } from "./queryBuilder.js";
import type QueryTable from "./queryTable.js";
import { extractParams, mapCTESpecsToSelection } from "./utility.js";
import { getDbFunctions } from "./utility/dbOperations.js";

class DeleteQueryBuilder<
    TDbType extends DbType,
    TTable extends QueryTable<TDbType, any, any, any>,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends BaseDMLQueryBuilder<
    TDbType,
    TTable,
    TCTESpecs,
    TParams,
    TResult,
    TAs,
    TCastType
> {

    whereComparison?: ComparisonType<TDbType> | undefined;

    constructor(
        dbType: TDbType,
        table: TTable,
        params: TParams,
        asName: TAs,
        castType: TCastType,
        data: {
            cteSpecs: TCTESpecs,
            queryResult: TResult,
            queryResultSpecs: QueryResultSpecsType<TDbType> | undefined,
            whereComparison: ComparisonType<TDbType> | undefined
        }
    ) {
        super(dbType, table, params, asName, castType, data.queryResult, data.queryResultSpecs, data.cteSpecs);
        this.whereComparison = data.whereComparison;
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const dmlTable = this.table;

        let result = `DELETE FROM "${dmlTable.tableName}"${dmlTable.asName ? ` AS "${dmlTable.asName}"` : ''}`;

        if (this.whereComparison) {
            const whereClause = this.whereComparison.buildSQL(context).query;
            result = `${result} WHERE ${whereClause}`;
        }

        let cteClause;
        if (this.cteSpecs !== undefined) {
            const cteItems = this.cteSpecs.map(cte => {
                let qbResult = cte.buildSQL(context);
                let result = `${cte.cteType.name === 'RECURSIVE' ? 'RECURSIVE ' : ''}`;
                if (cte.cteType.name === 'RECURSIVE') {

                }

                result = `${result}"${cte.cteName}"`;
                if (cte.isColumnListPresent === true) {
                    const columnList = `(${cte.columnsList.map(ent => `"${ent.fieldName}"`).join(', ')})`;
                    result = `${result}${columnList}`
                }

                result = `${result} AS`;
                result = `${result} ${cte.cteType.name === "MATERIALIZED" || cte.cteType.name === "NOT_MATERIALIZED" ? cte.cteType.query : ''}`;
                result = `${result}(${qbResult.query})`

                return result;
            }).join(', ');
            cteClause = `WITH ${cteItems}`
        }

        result = `${cteClause ? `${cteClause} ` : ''}${result}`;

        return { query: result, params: [...(context?.params || [])] };
    }

    #getColumnsSelection() {
        let columnsSelection: ColumnsSelectionListType<TDbType> = {};

        let tableSelection = columnsSelectionFactory<TDbType>(this.table, this.table.columnsList)
        columnsSelection[this.table.name] = tableSelection;

        if (this.cteSpecs !== undefined) {
            for (let cte of this.cteSpecs) {
                let ownerName = cte.name;
                let selection = columnsSelectionFactory<TDbType>(cte, cte.columnsList);
                columnsSelection[ownerName] = selection;
            }
        }

        return columnsSelection;
    }

    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined>>,
            ops: DbOperations<TDbType>,
            ctes: MapCtesToSelectionType<TDbType, TCTESpecs>
        ) => TCbResult
    ):
        DeleteQueryBuilder<
            TDbType,
            TTable,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TCbResult, TParams>,
            TAs,
            TCastType
        > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined>>;
        const ops = getDbFunctions(this.dbType);

        let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs === undefined) {
            cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        } else {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
        }

        const comparison = cb(columnsSelection, ops as DbOperations<TDbType>, cteSpecs)

        const params = extractParams([comparison], this.params);

        return new DeleteQueryBuilder<
            TDbType,
            TTable,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TCbResult, TParams>,
            TAs,
            TCastType
        >(
            this.dbType,
            this.table,
            params as AccumulateComparisonParams<TCbResult, TParams>,
            this.asName,
            this.castType,

            {
                cteSpecs: this.cteSpecs,
                queryResult: this.queryResult,
                queryResultSpecs: this.queryResultSpecs,
                whereComparison: comparison
            });
    }



}

export default DeleteQueryBuilder;