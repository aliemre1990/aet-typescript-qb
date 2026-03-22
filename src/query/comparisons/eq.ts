import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import { BasicComparisonOperation, ConvertComparisonParamToTyped, InferValueTypeFromComparable } from "./_comparisonOperations.js";
import { basicComparisonOperations } from "../_interfaces/IComparisonOperation.js";

function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never):
    BasicComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.eq,
        TComparing,
        ConvertComparisonParamToTyped<TParamMedian, TValueType>

    >
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied):
    BasicComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.eq,
        TComparing,
        TApplied
    >
function eq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: LiteralToBase<TValueType> | null):
    BasicComparisonOperation<
        TDbType,
        typeof basicComparisonOperations.eq,
        TComparing,
        TValueType | null
    >
function eq<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new BasicComparisonOperation(
        dbType,
        basicComparisonOperations.eq,
        this,
        value,
        undefined
    );
}

export default eq;
