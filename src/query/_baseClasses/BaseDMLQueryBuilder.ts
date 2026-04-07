import type { DbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import { columnsSelectionFactory } from "../ColumnsSelection.js";
import type QueryParam from "../param.js";
import type { ColumnsSelectionListType, CTESpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import BaseQueryBuilder, { type QueryResultSpecsType, type ResultShape } from "./BaseQueryBuilder.js";

class BaseDMLQueryBuilder<
    TDbType extends DbType,
    TTable extends QueryTable<TDbType, any, any>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends BaseQueryBuilder<
    TDbType,
    TParams,
    TResult,
    TAs,
    TCastType
> {

    table: TTable;

    cteSpecs: TCTESpecs;

    constructor(
        dbType: TDbType,
        table: TTable,
        params: TParams,
        asName: TAs,
        castType: TCastType,
        queryResult: TResult,
        queryResultSpecs: QueryResultSpecsType<TDbType> | undefined,
        cteSpecs: TCTESpecs
    ) {
        super(dbType, params, asName, castType, queryResult, queryResultSpecs);

        this.table = table;
        this.cteSpecs = cteSpecs;
    }



}

export default BaseDMLQueryBuilder;