import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type ConvertComparisonParamToTyped, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";

function notEq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [ConvertComparisonParamToTyped<TParamMedian, TValueType>]

>
function notEq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TApplied extends IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied]
>
function notEq<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: LiteralToBase<TValueType> | null): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TValueType | null]
>
function notEq<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.notEq,
        this,
        [value],
        undefined
    );
}

export default notEq;
