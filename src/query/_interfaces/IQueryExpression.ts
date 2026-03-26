import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type between from "../comparisons/between.js";
import type sqlIn from "../comparisons/in.js";
import type { IDbType } from "./IDbType.js";
import type { PgColumnType, PgTypeToJsType } from "../../table/columnTypes.js";
import type { IsAny } from "../../utility/common.js";
import type notBetween from "../comparisons/notBetween.js";
import type isNull from "../comparisons/isNull.js";
import type isNotNull from "../comparisons/isNotNull.js";
import type like from "../comparisons/like.js";
import type notLike from "../comparisons/notLike.js";
import type { eq, gt, gte, lt, lte, notEq } from "../comparisons/_basicColumnComparisonOperation.js";

type DetermineValueType<TCastType extends PgColumnType | undefined, TValueType extends DbValueTypes | null> =
    TCastType extends undefined ?
    TValueType :
    TCastType extends PgColumnType ?
    IsAny<TValueType> extends true ? PgTypeToJsType<TCastType> :
    TValueType extends null ? TValueType :
    object extends PgTypeToJsType<TCastType> ?
    TValueType :
    PgTypeToJsType<TCastType> :
    never;

type DetermineFinalValueType<TCurrFinalType extends DbValueTypes | null, TValueType extends DbValueTypes | null> =
    null extends TCurrFinalType ? TValueType | null : TValueType;

type QueryBuilderContext = { params: string[], isTopLevel: boolean }
function queryBuilderContextFactory(): QueryBuilderContext {
    return { params: [], isTopLevel: true }
}

const IQueryExpressionValueDummySymbol = Symbol();
const IQueryExpressionFinalValueDummySymbol = Symbol();

interface IQueryExpression<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TFieldName extends string | undefined,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> extends IDbType<TDbType> {
    dbType: TDbType;

    [IQueryExpressionValueDummySymbol]: TValueType;
    [IQueryExpressionFinalValueDummySymbol]: TFinalValueType;

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
    between: typeof between;
    notBetween: typeof notBetween;
    isNull: typeof isNull;
    isNotNull: typeof isNotNull;
    like: typeof like;
    notLike: typeof notLike;

    as<TAs extends string>(asName: TAs): IQueryExpression<TDbType, TParams, TValueType, TFinalValueType, TFieldName, TAs, TCastType>
    cast<TCastType extends PgColumnType>(type: TCastType): IQueryExpression<TDbType, TParams, any, any, TFieldName, TAs, TCastType>

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] };
}

export type {
    DetermineValueType,
    DetermineFinalValueType,
    IQueryExpression,
    QueryBuilderContext
}

export {
    IQueryExpressionValueDummySymbol,
    IQueryExpressionFinalValueDummySymbol,
    queryBuilderContextFactory
}