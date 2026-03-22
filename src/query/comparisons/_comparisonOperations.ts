import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { IsAny, LiteralToBase, UndefinedIfLengthZero } from "../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { ExtractParams } from "../param.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import between from "./between.js";
import eq from "./eq.js";
import gt from "./gt.js";
import gte from "./gte.js";
import sqlIn from "./in.js";
import isNotNull from "./isNotNull.js";
import isNull from "./isNull.js";
import like from "./like.js";
import lt from "./lt.js";
import lte from "./lte.js";
import notBetween from "./notBetween.js";
import notEq from "./notEq.js";
import notLike from "./notLike.js";

type ConvertComparisonParamToTyped<TIntermediate extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TIntermediate extends QueryParam<infer TDbType, infer TName, infer TVal, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, IsAny<TVal> extends true ? LiteralToBase<TValueType> | null : TVal, TAs, TCastType> :
    never;

type ConvertComparisonParamToNonNullTyped<TIntermediate extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TIntermediate extends QueryParam<infer TDbType, infer TName, infer TVal, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, IsAny<TVal> extends true ? LiteralToBase<TValueType> : TVal, TAs, TCastType> :
    never;


type InferAppliedParams<
    TApplied extends readonly (DbValueTypes | null | IComparable<any, any, any, any, any, any, any>)[] | undefined
> = TApplied extends undefined ? [] :
    TApplied extends readonly [infer First, ...infer Rest] ?

    Rest extends readonly [any, ...any] ?
    [...ExtractParams<First>, ...InferAppliedParams<Rest>] :
    ExtractParams<First> :
    [];


type InferComparisonParams<
    TComparing extends IComparable<any, any, any, any, any, any, any>,
    TApplied extends readonly (DbValueTypes | null | IComparable<any, any, any, any, any, any, any>)[] | undefined
> = [
        ...(TComparing extends IComparable<any, infer TParams, any, any, any, any, any> ? TParams extends undefined ? [] : TParams : []),
        ...InferAppliedParams<TApplied>
    ];

const comparisonOperations = {
    eq: { name: 'EQ', symbol: "=" },
    notEq: { name: 'NOT_EQ', symbol: "!=" },
    gt: { name: 'GT', symbol: ">" },
    gte: { name: 'GTE', symbol: ">=" },
    lt: { name: 'LT', symbol: "<" },
    lte: { name: 'LTE', symbol: "<=" },
    like: { name: 'LIKE', symbol: "LIKE" },
    notLike: { name: 'NOT_LIKE', symbol: "NOT LIKE" },
    iLike: { name: 'ILIKE', symbol: "ILIKE" },
    notILike: { name: 'NOT_ILIKE', symbol: "NOT ILIKE" },
    in: { name: 'IN', symbol: "IN" },
    notIn: { name: 'NOT_IN', symbol: "NOT IN" },
    isNull: { name: 'IS_NULL', symbol: "IS NULL" },
    isNotNull: { name: 'IS_NOT_NULL', symbol: "IS NOT NULL" },
    between: { name: 'BETWEEN', symbol: "BETWEEN" },
    notBetween: { name: 'NOT_BETWEEN', symbol: "NOT BETWEEN" },
    exists: { name: 'EXISTS', symbol: "EXISTS" },
    notExists: { name: 'NOT_EXISTS', symbol: "NOT EXISTS" }
} as const;

type ComparisonOperation = (typeof comparisonOperations)[keyof typeof comparisonOperations];

type InferValueTypeFromComparable<TDbType extends DbType, T> =
    T extends IComparable<TDbType, any, infer TValueType, any, any, any, any> ? TValueType : never;


class ColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TApplied extends readonly (TValueType | null | IComparable<TDbType, any, any, any, any, any, any>)[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, TApplied>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, boolean>,
    undefined,
    TAs,
    TCastType
> {

    dbType: TDbType;
    params?: TParams;
    [IComparableValueDummySymbol]: DetermineValueType<TCastType, boolean>;
    [IComparableFinalValueDummySymbol]: DetermineValueType<TCastType, boolean>;
    fieldName: undefined = undefined;
    asName: TAs;
    castType?: TCastType;

    operation: ComparisonOperation;
    comparing: TComparing;
    value: TApplied

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
    notBetween: typeof notBetween = notBetween;
    isNull: typeof isNull = isNull;
    isNotNull: typeof isNotNull = isNotNull;
    like: typeof like = like;
    notLike: typeof notLike = notLike;

    as<TAs extends string>(asName: TAs) {
        return new ColumnComparisonOperation<TDbType, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new ColumnComparisonOperation<TDbType, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        if (
            [comparisonOperations.isNull, comparisonOperations.isNotNull].findIndex(op => op === this.operation) < 0 &&
            this.value === undefined
        ) {
            throw Error('No applied value provided for comparison operation.');
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = [];
        if (this.value) {
            appliedStrArr = convertArgsToQueryString(this.value, context);
        }

        let queryRes;
        if ([comparisonOperations.in, comparisonOperations.notIn].some(op => op === this.operation)) {
            queryRes = `${comparingStr} ${this.operation.symbol} (${appliedStrArr.join(', ')})`;
        } else if ([comparisonOperations.between, comparisonOperations.notBetween].some(op => op === this.operation)) {
            if (appliedStrArr.length !== 2 || !this.value || this.value.length !== 2) {
                throw Error(`Invalid argument count for 'between' comparison.`);
            }

            queryRes = `${comparingStr} ${this.operation.symbol} ${this.value[0] instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]} AND ${this.value[1] instanceof QueryBuilder ? `(${appliedStrArr[1]})` : appliedStrArr[1]}`;
        } else if ([comparisonOperations.isNull, comparisonOperations.isNotNull].some(op => op === this.operation)) {
            queryRes = `${comparingStr} ${this.operation.symbol}`;
        } else {
            if (appliedStrArr.length !== 1 || !this.value || this.value.length !== 1) {
                throw Error(`Invalid argument count for '${this.operation.name}' comparison.`);
            }

            let applySpaceAroundOperator = false;
            if (
                [
                    comparisonOperations.like,
                    comparisonOperations.notLike,
                    comparisonOperations.iLike,
                    comparisonOperations.notILike
                ].some(op => op === this.operation)
            ) {
                applySpaceAroundOperator = true;
            }

            queryRes = `${comparingStr}${applySpaceAroundOperator ? ' ' : ''}${this.operation.symbol}${applySpaceAroundOperator ? ' ' : ''}${this.value[0] instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;
        }

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: ComparisonOperation,
        comparing: TComparing,
        value: TApplied,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.value = value;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (value !== undefined && value.length > 0) {
            value.forEach(val => {
                if (
                    val instanceof Object &&
                    "params" in val &&
                    val.params !== undefined &&
                    Array.isArray(val.params) &&
                    val.params.length > 0
                ) {
                    tmpParams = [...tmpParams, ...val.params];
                } else if (val instanceof QueryParam) {
                    tmpParams = [...tmpParams, val];
                }
            })
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

export default ColumnComparisonOperation;

export {
    comparisonOperations
}

export type {
    ComparisonOperation,
    InferValueTypeFromComparable,
    ConvertComparisonParamToTyped,
    ConvertComparisonParamToNonNullTyped
}