import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import BasicColumnComparisonOperation from "./_basicColumnComparisonOperation.js";
import { basicComparisonOperations, ConvertComparisonParamToTyped, InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";

function lte<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.lte,
        TComparing,
        ConvertComparisonParamToTyped<TParamMedian, TValueType>

    >
function lte<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.lte,
        TComparing,
        TApplied
    >
function lte<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: LiteralToBase<TValueType> | null):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.lte,
        TComparing,
        TValueType | null
    >
function lte<TComparing extends IQueryExpression<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new BasicColumnComparisonOperation(
        dbType,
        basicComparisonOperations.lte,
        this,
        value,
        undefined,
        undefined
    );
}

export default lte;
