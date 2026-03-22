import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type ConvertComparisonParamToNonNullTyped, type ConvertComparisonParamToTyped, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";

function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TParamMedian extends QueryParam<TDbType, string, any, any, any>,
    TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TParamValue extends string ? TParamMedian : never
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [ConvertComparisonParamToNonNullTyped<TParamMedian, string>]

>
function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TApplied extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: TApplied): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TApplied]
>
function notLike<
    TComparing extends IComparable<TDbType, any, string, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never,
>(this: TComparing, value: string): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [InferValueTypeFromComparable<TDbType, TComparing>]
>
function notLike<TComparing extends IComparable<any, any, any, any, any, any, any>,>(
    this: TComparing,
    value: any
) {
    const dbType = this.dbType;

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.notLike,
        this,
        [value],
        undefined
    );
}

export default notLike;
