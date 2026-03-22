import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import { isNullComparisonOperations } from "../_interfaces/IComparisonOperation.js";
import IsNullColumnComparisonOperation from "./_isNullColumnComparisonOperation.js";

function isNull<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
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
