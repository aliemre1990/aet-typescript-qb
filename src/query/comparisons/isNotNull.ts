import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import { isNullComparisonOperations } from "../_interfaces/IComparisonOperation.js";
import { IsNullComparisonOperation } from "./_comparisonOperations.js";

function isNotNull<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing): IsNullComparisonOperation<
    TDbType,
    typeof isNullComparisonOperations.isNotNull,
    TComparing,
    undefined
> {
    const dbType = this.dbType;

    return new IsNullComparisonOperation(
        dbType,
        isNullComparisonOperations.isNotNull,
        this,
        undefined,
        undefined
    );
}

export default isNotNull;
