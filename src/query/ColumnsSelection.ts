import type { DbType } from "../db.js";
import type { IQueryExpression } from "./_interfaces/IQueryExpression.js";
import type { FromItemType } from "./queryBuilder.js";

const ColumnsSelectionQueryObjectSymbol = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQItem extends FromItemType<TDbType>,
    TColumns extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[]
> =
    {
        [ColumnsSelectionQueryObjectSymbol]: TQItem;
    } &
    {
        [K in TColumns[number]as K["fieldName"]]: K;
    };

function columnsSelectionFactory<TDbType extends DbType>(
    queryObject: FromItemType<TDbType>,
    columns: readonly IQueryExpression<TDbType, any, any, any, string, any, any>[]
): ColumnsSelection<TDbType, any, any> {

    let res: ColumnsSelection<TDbType, any, any> = {
        [ColumnsSelectionQueryObjectSymbol]: queryObject,
    }

    for (const col of columns) {
        res[col.fieldName] = col;
    }

    return res;
}

export default ColumnsSelection;

export {
    ColumnsSelectionQueryObjectSymbol,
    columnsSelectionFactory
}
