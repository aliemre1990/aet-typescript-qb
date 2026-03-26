import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { IsAny, IsExactAlt, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";
import InColumnComparisonOperation from "./_inColumnComparisonOperation.js";
import { inComparisonOperations, type InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";

type MapParamsToTypeRecursively<
    TValueType extends DbValueTypes,
    T extends readonly (TValueType | IQueryExpression<any, any, TValueType, any, any, any, any>)[]
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


function sqlNotIn<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TQb & IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>
): InColumnComparisonOperation<
    TDbType,
    typeof inComparisonOperations.notIn,
    TComparing,
    [TQb]
>
function sqlNotIn<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
    const TValues extends readonly (LiteralToBase<TValueType> | IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[],
    const TFinalValues extends readonly (LiteralToBase<TValueType> | IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[] = MapParamsToTypeRecursively<LiteralToBase<TValueType>, TValues>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    ...val: TValues
): InColumnComparisonOperation<
    TDbType,
    typeof inComparisonOperations.notIn,
    TComparing,
    [...TFinalValues]
>


function sqlNotIn<
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        ...val: any[]
    ) {

    const dbType = this.dbType;

    return new InColumnComparisonOperation(
        dbType,
        inComparisonOperations.notIn,
        this,
        [...val],
        undefined,
        undefined
    )
}

export default sqlNotIn;

export type {
    MapParamsToTypeRecursively
}
