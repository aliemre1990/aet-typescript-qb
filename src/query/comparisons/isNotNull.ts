import type { DbType } from "../../db.js";
import { isNullComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import IsNullColumnComparisonOperation from "./_isNullColumnComparisonOperation.js";

function isNotNull<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing): IsNullColumnComparisonOperation<
    TDbType,
    typeof isNullComparisonOperations.isNotNull,
    TComparing,
    undefined
> {
    const dbType = this.dbType;

    return new IsNullColumnComparisonOperation(
        dbType,
        isNullComparisonOperations.isNotNull,
        this,
        undefined,
        undefined
    );
}

export default isNotNull;
