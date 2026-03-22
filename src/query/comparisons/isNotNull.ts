import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";

function isNotNull<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing): ColumnComparisonOperation<
    TDbType,
    TComparing,
    undefined
> {
    const dbType = this.dbType;

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.isNotNull,
        this,
        undefined,
        undefined
    );
}

export default isNotNull;
