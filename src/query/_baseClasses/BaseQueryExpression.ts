import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType, PgTypeToJsType } from "../../table/columnTypes.js";
import type { IsAny } from "../../utility/common.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { IDbType } from "../_interfaces/IDbType.js";
import type between from "../comparisons/between.js";
import type eq from "../comparisons/eq.js";
import type gt from "../comparisons/gt.js";
import type gte from "../comparisons/gte.js";
import type sqlIn from "../comparisons/in.js";
import type isNotNull from "../comparisons/isNotNull.js";
import type isNull from "../comparisons/isNull.js";
import type like from "../comparisons/like.js";
import type lt from "../comparisons/lt.js";
import type lte from "../comparisons/lte.js";
import type notBetween from "../comparisons/notBetween.js";
import type notEq from "../comparisons/notEq.js";
import type sqlNotIn from "../comparisons/notIn.js";
import type notLike from "../comparisons/notLike.js";
import type QueryParam from "../param.js";

class BaseQueryExpression<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TFieldName extends string | undefined,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> implements IQueryExpression<TDbType, TParams, TValueType, TFinalValueType, TFieldName, TAs, TCastType> {
    dbType: TDbType;

    [IQueryExpressionValueDummySymbol]: TValueType;
    [IQueryExpressionFinalValueDummySymbol]: TFinalValueType;

    params?: TParams;
    fieldName: TFieldName;
    asName: TAs;
    castType: TCastType;

    as<TAs extends string>(asName: TAs): BaseQueryExpression<TDbType, TParams, TValueType, TFinalValueType, TFieldName, TAs, TCastType> {
        throw new Error("Method not implemented.");
    }
    cast<TCastType extends PgColumnType>(type: TCastType): BaseQueryExpression<TDbType, TParams, any, any, TFieldName, TAs, TCastType> {
        throw new Error("Method not implemented.");
    }

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] } {
        throw new Error("Method not implemented.");
    }

    constructor(dbType: TDbType, params: TParams, fieldName: TFieldName, asName: TAs, castType: TCastType) {
        this.dbType = dbType;
        this.params = params;
        this.fieldName = fieldName;
        this.asName = asName;
        this.castType = castType;

        this[IQueryExpressionValueDummySymbol] = null as any;
        this[IQueryExpressionFinalValueDummySymbol] = null as any;
    }
}

interface BaseQueryExpression<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TFieldName extends string | undefined,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> {
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
}

export default BaseQueryExpression;