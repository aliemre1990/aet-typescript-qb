import type { DbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import { isNullOrUndefined } from "../../utility/guards.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { DbOperations } from "../_types/ops.js";
import type { SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "../_types/result.js";
import ColumnsSelection, { columnsSelectionFactory, ColumnsSelectionQueryObjectSymbol } from "../ColumnsSelection.js";
import type QueryParam from "../param.js";
import type { CalculateSelectParams, CalculateSelectResult, ColumnsSelectionListType, CTESpecsType, ResultShapeItem } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import { extractParams } from "../utility.js";
import { getDbFunctions } from "../utility/dbOperations.js";
import BaseQueryBuilder, { type QueryResultSpecsType, type ResultShape } from "./BaseQueryBuilder.js";

class BaseDMLQueryBuilder<
    TDbType extends DbType,
    TTable extends QueryTable<TDbType, any, any>,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined,
    TResult extends ResultShape<TDbType> | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends BaseQueryBuilder<
    TDbType,
    TResult,
    TParams,
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

    #getTableColumnsSelection() {
        let columnsSelection: ColumnsSelectionListType<TDbType> = {};

        let tableSelection = columnsSelectionFactory<TDbType>(this.table, this.table.columnsList)
        columnsSelection[this.table.name] = tableSelection;

        return columnsSelection;
    }


    returning(): BaseDMLQueryBuilder<
        TDbType,
        TTable,
        TCTESpecs,
        TParams,
        SelectToAllColumnsMapRecursively<TDbType, [TTable], undefined>,
        TAs,
        TCastType
    >
    returning<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): BaseDMLQueryBuilder<
        TDbType,
        TTable,
        TCTESpecs,
        CalculateSelectParams<TParams, TCbResult, TFinalResult>,
        CalculateSelectResult<TDbType, [TTable], undefined, TCbResult, TFinalResult>,
        TAs,
        TCastType
    >
    returning<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, string, any, any> | IQueryExpression<TDbType, any, any, any, any, string, any>)[],
    >(
        cb?: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined>>,
            ops: DbOperations<TDbType>
        ) => TCbResult
    ): any {

        let selectRes: readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, any, any, any>)[] = [];
        if (!isNullOrUndefined(cb)) {
            const columnsSelection = this.#getTableColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, [TTable], undefined>>;
            const functions = getDbFunctions(this.dbType);
            selectRes = cb(columnsSelection, functions);
        }

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined;
        if (selectRes) {
            params = extractParams(selectRes, this.params);
        } else {
            params = this.params;
        }

        if (isNullOrUndefined(cb) || selectRes.length === 0) {

            let finalSelectRes: ResultShapeItem<TDbType>[] = [];
            finalSelectRes.push(...this.table.columnsList);

            return new BaseDMLQueryBuilder(
                this.dbType,
                this.table,
                params,
                this.asName,
                this.castType,
                finalSelectRes,
                "*",
                this.cteSpecs
            );
        } else {
            let finalSelectRes: ResultShapeItem<TDbType>[] = [];
            for (const it of selectRes) {
                if (ColumnsSelectionQueryObjectSymbol in it) {
                    for (const k in it) {
                        let expression = it[k] as IQueryExpression<TDbType, any, any, any, any, any, any>;
                        finalSelectRes.push(expression);
                    }
                } else {
                    finalSelectRes.push(it);
                }
            }

            return new BaseDMLQueryBuilder(
                this.dbType,
                this.table,
                params,
                this.asName,
                this.castType,
                finalSelectRes,
                selectRes,
                this.cteSpecs
            );
        }
    };



}

export default BaseDMLQueryBuilder;