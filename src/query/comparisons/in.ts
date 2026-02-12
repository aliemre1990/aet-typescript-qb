import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, IsExactAlt, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";

type InferFirstValidType<
    TArgs extends readonly (DbValueTypes | null | IComparable<any, any, any, any, any, any, any>)[]
> = TArgs extends readonly [infer First, ...infer Rest] ?

    First extends IComparable<any, any, infer TValueType, any, any, any, any> ?

    IsExactAlt<TValueType, null> extends true ?

    Rest extends readonly [any, ...any] ?
    InferFirstValidType<Rest> :
    never :

    IsAny<TValueType> extends true ?

    Rest extends readonly [any, ...any] ?
    InferFirstValidType<Rest> :
    never :
    TValueType :

    First extends DbValueTypes | null ?

    First extends null ?

    Rest extends readonly [any, ...any] ?
    InferFirstValidType<Rest> :
    never :

    First :
    never :
    never;

// Helper type to extract only QueryColumns from the mixed tuple
type ExtractComparables<T extends readonly unknown[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, any, any, any, any, any, any> ?
    [First, ...ExtractComparables<Rest>] :
    ExtractComparables<Rest> :
    [];

type MapParamsToTypeRecursively<
    TValueType extends DbValueTypes,
    T extends readonly (TValueType | IComparable<any, any, TValueType, any, any, any, any>)[]
> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<infer DbType, infer Name, infer ValueType, infer As, infer DefaultFieldKey, infer TCastType> ?
    IsAny<ValueType> extends true ?
    Rest extends readonly [any, ...any[]] ?
    [QueryParam<DbType, Name, TValueType | null, As, DefaultFieldKey, TCastType>, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [QueryParam<DbType, Name, TValueType | null, As, DefaultFieldKey, TCastType>] :
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
): ColumnComparisonOperation<
    TDbType,
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
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [...TFinalValues]
>


function sqlIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TValues extends LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        ...val: (TQb | TValues)[]
    ) {

    const dbType = this.dbType;

    if (val[0] instanceof QueryBuilder) {
        // value is querybuilder
        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.in,
            this,
            [val[0]]
        );
    }

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.in,
        this,
        [...val]
    )

}

export default sqlIn;

export type {
    MapParamsToTypeRecursively
}
