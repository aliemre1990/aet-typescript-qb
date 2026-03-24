import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import BasicColumnComparisonOperation from "./_basicColumnComparisonOperation.js";
import { basicComparisonOperations, ConvertComparisonParamToTyped, InferValueTypeFromComparable } from "../_baseClasses/BaseColumnComparisonOperation.js";

function gte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.gte,
        TComparing,
        ConvertComparisonParamToTyped<TParamMedian, TValueType>

    >
function gte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.gte,
        TComparing,
        TApplied
    >
function gte<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: LiteralToBase<TValueType> | null):
    BasicColumnComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.gte,
        TComparing,
        TValueType | null
    >
function gte<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new BasicColumnComparisonOperation(
        dbType,
        basicComparisonOperations.gte,
        this,
        value,
        undefined,
        undefined
    );
}

export default gte;
