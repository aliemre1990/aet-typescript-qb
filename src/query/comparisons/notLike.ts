import type { DbType } from "../../db.js";
import { ConvertComparisonParamToNonNullTyped, InferValueTypeFromExpression, likeComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import LikeColumnComparisonOperation from "./_likeColumnComparisonOperation.js";

function notLike<
    TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends string ? TParamMedian : never
): LikeColumnComparisonOperation<
    TDbType,
    typeof likeComparisonOperations.notLike,
    TComparing,
    ConvertComparisonParamToNonNullTyped<TParamMedian, string>

>
function notLike<
    TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
    TApplied extends IQueryExpression<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    LikeColumnComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.notLike,
        TComparing,
        TApplied
    >
function notLike<
    TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: string):
    LikeColumnComparisonOperation<
        TDbType,
        typeof likeComparisonOperations.notLike,
        TComparing,
        InferValueTypeFromExpression<TDbType, TComparing>
    >
function notLike<TComparing extends IQueryExpression<any, any, any, any, any, any, any>,>(
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
