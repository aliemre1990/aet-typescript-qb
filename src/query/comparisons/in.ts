import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";
import InColumnComparisonOperation from "./_inColumnComparisonOperation.js";
import { inComparisonOperations, type InferValueTypeFromComparable } from "../_baseClasses/BaseColumnComparisonOperation.js";

type MapParamsToTypeRecursively<
    TValueType extends DbValueTypes,
    T extends readonly (TValueType | IComparable<any, any, TValueType, any, any, any, any>)[]
> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<infer DbType, infer Name, infer ValueType, infer As, infer TCastType> ?
    IsAny<ValueType> extends true ?
    Rest extends readonly [any, ...any[]] ?
    [QueryParam<DbType, Name, TValueType | null, As, TCastType>, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [QueryParam<DbType, Name, TValueType | null, As, TCastType>] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    []
    ;


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TQb & IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>
): InColumnComparisonOperation<
    TDbType,
    typeof inComparisonOperations.in,
    TComparing,
    [TQb]
>
function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    const TValues extends readonly (LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[],
    const TFinalValues extends readonly (LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[] = MapParamsToTypeRecursively<LiteralToBase<TValueType>, TValues>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    ...val: TValues
): InColumnComparisonOperation<
    TDbType,
    typeof inComparisonOperations.in,
    TComparing,
    [...TFinalValues]
>


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        ...val: any[]
    ) {

    const dbType = this.dbType;

    return new InColumnComparisonOperation(
        dbType,
        inComparisonOperations.in,
        this,
        [...val],
        undefined,
        undefined
    )
}

export default sqlIn;

export type {
    MapParamsToTypeRecursively
}
