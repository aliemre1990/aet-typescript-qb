import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { IsAny, LiteralToBase } from "../../utility/common.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { ExtractParams } from "../param.js";
import type QueryParam from "../param.js";
import BaseQueryExpression from "./BaseQueryExpression.js";

type ConvertComparisonParamToTyped<TIntermediate extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TIntermediate extends QueryParam<infer TDbType, infer TName, infer TVal, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, IsAny<TVal> extends true ? LiteralToBase<TValueType> | null : TVal, TAs, TCastType> :
    never;

type ConvertComparisonParamToNonNullTyped<TIntermediate extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TIntermediate extends QueryParam<infer TDbType, infer TName, infer TVal, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, IsAny<TVal> extends true ? LiteralToBase<TValueType> : TVal, TAs, TCastType> :
    never;

type InferValueTypeFromExpression<TDbType extends DbType, T> =
    T extends IQueryExpression<TDbType, any, infer TValueType, any, any, any, any> ? TValueType : never;


type InferFinalValueTypeFromExpression<T> =
    T extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;

type InferFinalValueTypeFromApplied<T> =
    T extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType :
    T extends DbValueTypes | null ?
    T :
    never;

type InferComparisonParams<
    TComparing extends IQueryExpression<any, any, any, any, any, any, any>,
    TApplied extends readonly (DbValueTypes | null | IQueryExpression<any, any, any, any, any, any, any>)[] | undefined
> = [
        ...(TComparing extends IQueryExpression<any, infer TParams, any, any, any, any, any> ? TParams extends undefined ? [] : TParams : []),
        ...InferAppliedParams<TApplied>
    ];

type InferAppliedParams<
    TApplied extends readonly (DbValueTypes | null | IQueryExpression<any, any, any, any, any, any, any>)[] | undefined
> = TApplied extends undefined ? [] :
    TApplied extends readonly [infer First, ...infer Rest] ?

    Rest extends readonly [any, ...any] ?
    [...ExtractParams<First>, ...InferAppliedParams<Rest>] :
    ExtractParams<First> :
    [];



const basicComparisonOperations = {
    eq: { name: 'EQ', symbol: "=" },
    notEq: { name: 'NOT_EQ', symbol: "!=" },
    gt: { name: 'GT', symbol: ">" },
    gte: { name: 'GTE', symbol: ">=" },
    lt: { name: 'LT', symbol: "<" },
    lte: { name: 'LTE', symbol: "<=" }
} as const;

const betweenComparisonOperations = {
    between: { name: 'BETWEEN', symbol: "BETWEEN" },
    notBetween: { name: 'NOT_BETWEEN', symbol: "NOT BETWEEN" }
} as const;

const inComparisonOperations = {
    in: { name: 'IN', symbol: "IN" },
    notIn: { name: 'NOT_IN', symbol: "NOT IN" }
} as const;

const isNullComparisonOperations = {
    isNull: { name: 'IS_NULL', symbol: "IS NULL" },
    isNotNull: { name: 'IS_NOT_NULL', symbol: "IS NOT NULL" }
} as const;

const likeComparisonOperations = {
    like: { name: 'LIKE', symbol: "LIKE" },
    notLike: { name: 'NOT_LIKE', symbol: "NOT LIKE" },
    iLike: { name: 'ILIKE', symbol: "ILIKE" },
    notILike: { name: 'NOT_ILIKE', symbol: "NOT ILIKE" }
} as const;

const existsComparisonOperations = {
    exists: { name: 'EXISTS', symbol: "EXISTS" },
    notExists: { name: 'NOT_EXISTS', symbol: "NOT EXISTS" }
} as const;

type BasicComparisonOperationType = (typeof basicComparisonOperations)[keyof typeof basicComparisonOperations];
type BetweenComparisonOperationType = (typeof betweenComparisonOperations)[keyof typeof betweenComparisonOperations];
type InComparisonOperationType = (typeof inComparisonOperations)[keyof typeof inComparisonOperations];
type IsNullComparisonOperationType = (typeof isNullComparisonOperations)[keyof typeof isNullComparisonOperations];
type LikeComparisonOperationType = (typeof likeComparisonOperations)[keyof typeof likeComparisonOperations];
type ExistsComparisonOperationType = (typeof existsComparisonOperations)[keyof typeof existsComparisonOperations];

type ComparisonOperationType =
    BasicComparisonOperationType |
    BetweenComparisonOperationType |
    IsNullComparisonOperationType |
    LikeComparisonOperationType |
    InComparisonOperationType |
    ExistsComparisonOperationType;


class BaseColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends ComparisonOperationType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TValueType extends DbValueTypes | null,
    TFinalValueType extends DbValueTypes | null,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    TValueType,
    TFinalValueType,
    undefined,
    TAs,
    TCastType
> {
    operation: TOperation;

    constructor(dbType: TDbType, operation: TOperation, params: TParams, fieldName: undefined, asName: TAs, castType: TCastType) {
        super(dbType, params, fieldName, asName, castType);
        this.operation = operation;
    }
}

export default BaseColumnComparisonOperation;

export type {
    BasicComparisonOperationType,
    BetweenComparisonOperationType,
    InComparisonOperationType,
    IsNullComparisonOperationType,
    LikeComparisonOperationType,
    ExistsComparisonOperationType,
    ComparisonOperationType,

    ConvertComparisonParamToTyped,
    ConvertComparisonParamToNonNullTyped,
    InferValueTypeFromExpression,
    InferFinalValueTypeFromExpression,
    InferFinalValueTypeFromApplied,
    InferComparisonParams,
    InferAppliedParams
}

export {
    basicComparisonOperations,
    betweenComparisonOperations,
    inComparisonOperations,
    isNullComparisonOperations,
    likeComparisonOperations,
    existsComparisonOperations
}

