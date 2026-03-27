import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type QueryParam from "../param.js";
import type { eq, gt, gte, lt, lte, notEq } from "../comparisons/_basicColumnComparisonOperation.js";
import type { between, notBetween } from "../comparisons/_betweenColumnComparisonOperation.js";
import type { sqlIn, sqlNotIn } from "../comparisons/_inColumnComparisonOperation.js";
import type { isNotNull, isNull } from "../comparisons/_isNullColumnComparisonOperation.js";
import type { iLike, like, notILike, notLike } from "../comparisons/_likeColumnComparisonOperation.js";

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
    iLike: typeof iLike;
    notILike: typeof notILike;
}

export default BaseQueryExpression;