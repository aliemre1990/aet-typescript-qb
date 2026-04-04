import type { DbType, MySQLDbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type { IDbType } from "./IDbType.js";
import type { GetValueTypeOfDbType } from "../../table/columnTypes.js";
import type { IsAny } from "../../utility/common.js";
import type { eq, gt, gte, lt, lte, notEq } from "../comparisons/_basicColumnComparisonOperation.js";
import type { between, notBetween } from "../comparisons/_betweenColumnComparisonOperation.js";
import type { sqlIn, sqlNotIn } from "../comparisons/_inColumnComparisonOperation.js";
import type { isNotNull, isNull } from "../comparisons/_isNullColumnComparisonOperation.js";
import type { iLike, like, notILike, notLike } from "../comparisons/_likeColumnComparisonOperation.js";
import { type IQueryValue, type FinalValueTypeDummySymbol, ValueTypeDummySymbol } from "./IQueryValue.js";

type DetermineValueType<
    TDbType extends DbType,
    TCastType extends GetColumnTypes<TDbType> | undefined,
    TValueType extends DbValueTypes | null
> =
    [TCastType] extends [undefined] ?
    TValueType :
    [TCastType] extends [GetColumnTypes<TDbType>] ?
    IsAny<TValueType> extends true ? GetValueTypeOfDbType<TDbType, TCastType> :
    [TValueType] extends [null] ? TValueType :
    [object] extends [GetValueTypeOfDbType<TDbType, TCastType>] ?
    TValueType :
    GetValueTypeOfDbType<TDbType, TCastType> :
    never;

type DetermineFinalValueType<TCurrFinalType extends DbValueTypes | null, TValueType extends DbValueTypes | null> =
    null extends TCurrFinalType ? TValueType | null : TValueType;

type QueryBuilderContext = { params: string[], isTopLevel: boolean }
function queryBuilderContextFactory(): QueryBuilderContext {
    return { params: [], isTopLevel: true }
}

interface IQueryExpression<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TFieldName extends string | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends IDbType<TDbType>, IQueryValue<TFieldName, TValueType, TFinalValueType> {
    dbType: TDbType;

    [ValueTypeDummySymbol]: TValueType;
    [FinalValueTypeDummySymbol]: TFinalValueType;

    params?: TParams;
    fieldName: TFieldName;
    asName: TAs;
    castType?: TCastType;

    eq: typeof eq;
    notEq: typeof notEq;
    gt: typeof gt;
    gte: typeof gte;
    lt: typeof lt;
    lte: typeof lte;
    sqlIn: typeof sqlIn;
    sqlNotIn: typeof sqlNotIn;
    between: typeof between;
    notBetween: typeof notBetween;
    isNull: typeof isNull;
    isNotNull: typeof isNotNull;
    like: typeof like;
    notLike: typeof notLike;
    iLike: typeof iLike;
    notILike: typeof notILike;

    as<TAs extends string>(asName: TAs): IQueryExpression<TDbType, TParams, TValueType, TFinalValueType, TFieldName, TAs, TCastType>
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType): IQueryExpression<TDbType, TParams, any, any, TFieldName, TAs, TCastType>

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] };
}

export type {
    DetermineValueType,
    DetermineFinalValueType,
    IQueryExpression,
    QueryBuilderContext
}

export {
    queryBuilderContextFactory
}