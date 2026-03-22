import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import { ConvertComparisonParamToNonNullTyped, InferValueTypeFromComparable, LikeComparisonOperation } from "./_comparisonOperations.js";
import { likeComparisonOperations } from "../_interfaces/IComparisonOperation.js";

function like<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends string ? TParamMedian : never
): LikeComparisonOperation<
    TDbType,
    typeof likeComparisonOperations.like,
    TComparing,
    ConvertComparisonParamToNonNullTyped<TParamMedian, string>

>
function like<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TApplied extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    LikeComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.like,
        TComparing,
        TApplied
    >
function like<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: string):
    LikeComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.like,
        TComparing,
        InferValueTypeFromComparable<TDbType, TComparing>
    >
function like<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new LikeComparisonOperation(
        dbType,
        likeComparisonOperations.like,
        this,
        value,
        undefined
    );
}

export default like;
