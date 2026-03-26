import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import BetweenColumnComparisonOperation from "./_betweenColumnComparisonOperation.js";
import { betweenComparisonOperations, ConvertComparisonParamToTyped, InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";



// params
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): BetweenColumnComparisonOperation<
    TDbType,
    typeof betweenComparisonOperations.between,
    TComparing,
    ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
    ConvertComparisonParamToTyped<TRParamMedian, TValueType>
>
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: LiteralToBase<TValueType> | null
): BetweenColumnComparisonOperation<
    TDbType,
    typeof betweenComparisonOperations.between,
    TComparing,
    ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
    TValueType | null

>
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: LiteralToBase<TValueType> | null,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): BetweenColumnComparisonOperation<
    TDbType,
    typeof betweenComparisonOperations.between,
    TComparing,
    TValueType | null,
    ConvertComparisonParamToTyped<TRParamMedian, TValueType>
>
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
    rightValue: TRApplied
): BetweenColumnComparisonOperation<
    TDbType,
    typeof betweenComparisonOperations.between,
    TComparing,
    ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
    TRApplied
>
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    leftValue: TLApplied,
    rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
): BetweenColumnComparisonOperation<
    TDbType,
    typeof betweenComparisonOperations.between,
    TComparing,
    TLApplied,
    ConvertComparisonParamToTyped<TRParamMedian, TValueType>
>


// All same
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: LiteralToBase<TValueType> | null):
    BetweenColumnComparisonOperation<
        TDbType,
        typeof betweenComparisonOperations.between,
        TComparing,
        TValueType | null,
        TValueType | null
    >
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: TRApplied):
    BetweenColumnComparisonOperation<
        TDbType,
        typeof betweenComparisonOperations.between,
        TComparing,
        TLApplied,
        TRApplied
    >



// Column and value
/**
 * Notes: No infer is required on primitive value arguments. Because it infers literal type from that argument
 * without NoInfer.
 * @param this 
 * @param leftValue 
 * @param rightValue 
 */
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: TLApplied, rightValue: LiteralToBase<TValueType> | null):
    BetweenColumnComparisonOperation<
        TDbType,
        typeof betweenComparisonOperations.between,
        TComparing,
        TLApplied,
        TValueType | null
    >
function between<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: TRApplied):
    BetweenColumnComparisonOperation<
        TDbType,
        typeof betweenComparisonOperations.between,
        TComparing,
        TValueType | null,
        TRApplied
    >


//Implementation
function between<TComparing extends IQueryExpression<any, any, any, any, any, any, any>>(
    this: TComparing,
    leftValue: any,
    rightValue: any
) {

    const dbType = this.dbType;

    return new BetweenColumnComparisonOperation(
        dbType,
        betweenComparisonOperations.between,
        this,
        leftValue,
        rightValue,
        undefined,
        undefined
    );
}

export default between;
