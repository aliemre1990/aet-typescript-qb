import type { DbType } from "../../db.js";
import { ConvertComparisonParamToNonNullTyped, InferValueTypeFromComparable, likeComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import LikeColumnComparisonOperation from "./_likeColumnComparisonOperation.js";

function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends string ? TParamMedian : never
): LikeColumnComparisonOperation<
    TDbType,
    typeof likeComparisonOperations.notLike,
    TComparing,
    ConvertComparisonParamToNonNullTyped<TParamMedian, string>

>
function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TApplied extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    LikeColumnComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.notLike,
        TComparing,
        TApplied
    >
function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: string):
    LikeColumnComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.notLike,
        TComparing,
        InferValueTypeFromComparable<TDbType, TComparing>
    >
function notLike<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new LikeColumnComparisonOperation(
        dbType,
        likeComparisonOperations.notLike,
        this,
        value,
        undefined,
        undefined
    );
}

export default notLike;
