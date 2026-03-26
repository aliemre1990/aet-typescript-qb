import type { DbType } from "../../db.js";
import { isNullComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import IsNullColumnComparisonOperation from "./_isNullColumnComparisonOperation.js";

function isNull<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing): IsNullColumnComparisonOperation<
    TDbType,
    typeof isNullComparisonOperations.isNull,
    TComparing,
    undefined
> {
    const dbType = this.dbType;

    return new IsNullColumnComparisonOperation(
        dbType,
        isNullComparisonOperations.isNull,
        this,
        undefined,
        undefined
    );
}

export default isNull;
