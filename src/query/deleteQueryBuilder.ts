import type { DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import BaseDMLQueryBuilder from "./_baseClasses/BaseDMLQueryBuilder.js";
import type { QueryResultSpecsType } from "./_baseClasses/BaseQueryBuilder.js";
import { queryBuilderContextFactory, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbOperations } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import { columnsSelectionFactory } from "./ColumnsSelection.js";
import type QueryParam from "./param.js";
import type { ColumnsSelectionListType, ComparisonType, CTESpecsType, ResultShape } from "./queryBuilder.js";
import type QueryTable from "./queryTable.js";
import { extractParams } from "./utility.js";
import { getDbFunctions } from "./utility/dbOperations.js";

class DeleteQueryBuilder<
    TDbType extends DbType,
    TTable extends QueryTable<TDbType, any, any, any>,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined,
    TResult extends ResultShape<TDbType> | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends BaseDMLQueryBuilder<
    TDbType,
    TTable,
    TParams,
    TCTESpecs,
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
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined, TCTESpecs>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ):
        DeleteQueryBuilder<
            TDbType,
            TTable,
            TCTESpecs,
            AccumulateComparisonParams<TCbResult, TParams>,
            TResult,
            TAs,
            TCastType
        > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined, TCTESpecs>>;
        const ops = getDbFunctions(this.dbType);

        const comparison = cb(columnsSelection, ops as DbOperations<TDbType>)

        const params = extractParams([comparison], this.params);

        return new DeleteQueryBuilder<
            TDbType,
            TTable,
            TCTESpecs,
            AccumulateComparisonParams<TCbResult, TParams>,
            TResult,
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