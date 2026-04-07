import type { DbType } from "../db.js";
import type Column from "../table/column.js";
import Table from "../table/table.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { AccumulateSubQueryParams, ConvertElementsToSubQueryCompliant, InferDbTypeFromFromFirstIDbType } from "./_types/subQueryUtility.js";
import type CTEObject from "./cteObject.js";
import type QueryParam from "./param.js";
import QueryBuilder from "./queryBuilder.js";
import QueryColumn from "./queryColumn.js";
import QueryTable from "./queryTable.js";
import SubQueryObject from "./subQueryObject.js";

function from<
    TFrom extends readonly (
        Table<TDbType, any, any> |
        QueryTable<TDbType, any, any, any> |
        QueryBuilder<TDbType, any, any, any, any, any, any, string, any> |
        CTEObject<TDbType, any, any, any, any>
    )[],
    TDbType extends DbType = InferDbTypeFromFromFirstIDbType<TFrom>
>(...from: TFrom) {

    type TFromRes = ConvertElementsToSubQueryCompliant<TDbType, TFrom>;

    let dbType = from[0].dbType as TDbType;

    let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = [];
    const fromResult = from.map(item => {
        if (item instanceof Table) {

            const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(item.dbType, col.name, { tableName: item.name, asTableName: undefined }, undefined, undefined);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            return new QueryTable(item.dbType, item.name, queryColumns);
        } if (item instanceof QueryBuilder) {
            params = [...(params || []), ...(item.params || [])];

            return new SubQueryObject(dbType, item);
        }
        else {
            return item;
        }
    }) as TFromRes;
    if (params?.length === 0) {
        params = undefined;
    }

    type AccumulatedParams = UndefinedIfLengthZero<AccumulateSubQueryParams<TDbType, TFromRes>>;

    return new QueryBuilder<
        TDbType,
        TFromRes,
        undefined,
        undefined,
        undefined,
        undefined,
        AccumulatedParams
    >(
        dbType,
        undefined,
        undefined,
        params as AccumulatedParams,
        {
            fromSpecs: fromResult,
            queryResult: undefined,
            queryResultSpecs: undefined,
        }
    );
}

export default from;