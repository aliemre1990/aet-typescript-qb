import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { IsAny, LiteralToBase, UndefinedIfLengthZero } from "../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { BasicComparisonOperationType, BetweenComparisonOperationType, IComparisonOperation, InComparisonOperationType, IsNullComparisonOperationType, LikeComparisonOperationType } from "../_interfaces/IComparisonOperation.js";
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

type InferValueTypeFromComparable<TDbType extends DbType, T> =
    T extends IComparable<TDbType, any, infer TValueType, any, any, any, any> ? TValueType : never;


type InferFinalValueTypeFromComparable<T> =
    T extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;

type InferFinalValueTypeFromApplied<T> =
    T extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType :
    T extends DbValueTypes | null ?
    T :
    never;


class BasicComparisonOperation<
    TDbType extends DbType,
    TOperation extends BasicComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TApplied extends TValueType | null | IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
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

    operation: TOperation;
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
        return new BasicComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new BasicComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = convertArgsToQueryString([this.value], context);;

        let queryRes = `${comparingStr}${this.operation.symbol}${this.value instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
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

        if (
            this.value instanceof Object &&
            "params" in this.value &&
            this.value.params !== undefined &&
            this.value.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.value.params];
        } else if (this.value instanceof QueryParam) {
            tmpParams = [...tmpParams, this.value];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

class BetweenComparisonOperation<
    TDbType extends DbType,
    TOperation extends BetweenComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TLApplied extends TValueType | null | IComparable<TDbType, any, any, any, any, any, any>,
    TRApplied extends TValueType | null | IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TLApplied, TRApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
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

    operation: TOperation;
    comparing: TComparing;
    lValue: TLApplied;
    rValue: TRApplied;

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
        return new BetweenComparisonOperation<TDbType, TOperation, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new BetweenComparisonOperation<TDbType, TOperation, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = convertArgsToQueryString([this.lValue, this.rValue], context);

        let queryRes = `${comparingStr} ${this.operation.symbol} ${this.lValue instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]} AND ${this.rValue instanceof QueryBuilder ? `(${appliedStrArr[1]})` : appliedStrArr[1]}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
        comparing: TComparing,
        lValue: TLApplied,
        rValue: TRApplied,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.lValue = lValue;
        this.rValue = rValue;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (
            this.lValue instanceof Object &&
            "params" in this.lValue &&
            this.lValue.params !== undefined &&
            this.lValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.lValue.params];
        } else if (this.lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, this.lValue];
        }

        if (
            this.rValue instanceof Object &&
            "params" in this.rValue &&
            this.rValue.params !== undefined &&
            this.rValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.rValue.params];
        } else if (this.lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, this.lValue];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

class InComparisonOperation<
    TDbType extends DbType,
    TOperation extends InComparisonOperationType,
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

    operation: TOperation;
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
        return new InComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new InComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = [];
        if (this.value) {
            appliedStrArr = convertArgsToQueryString(this.value, context);
        }

        let queryRes = `${comparingStr} ${this.operation.symbol} (${appliedStrArr.join(', ')})`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
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


class IsNullComparisonOperation<
    TDbType extends DbType,
    TOperation extends IsNullComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, []>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
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

    operation: TOperation;
    comparing: TComparing;

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
        return new IsNullComparisonOperation<TDbType, TOperation, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new IsNullComparisonOperation<TDbType, TOperation, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }


        let queryRes = `${comparingStr} ${this.operation.symbol}`;
        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
        comparing: TComparing,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}


type InferLikeComparisonReturnType<
    TComparingType extends string | null,
    TAppliedType extends string | null
> =
    null extends TComparingType ? boolean | null :
    null extends TAppliedType ? boolean | null :
    boolean;

class LikeComparisonOperation<
    TDbType extends DbType,
    TOperation extends LikeComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, string | null, any, any, any>,
    TApplied extends string | null | IComparable<TDbType, any, any, string | null, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromComparable<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>,
    TAs,
    TCastType
> {

    dbType: TDbType;
    params?: TParams;
    [IComparableValueDummySymbol]: DetermineValueType<TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromComparable<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>;
    [IComparableFinalValueDummySymbol]: DetermineValueType<TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromComparable<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>;
    fieldName: undefined = undefined;
    asName: TAs;
    castType?: TCastType;

    operation: TOperation;
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
        return new LikeComparisonOperation<TDbType, TOperation, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new LikeComparisonOperation<TDbType, TOperation, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = convertArgsToQueryString([this.value], context);;

        let queryRes = `${comparingStr} ${this.operation.symbol} ${this.value instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
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

        if (
            this.value instanceof Object &&
            "params" in this.value &&
            this.value.params !== undefined &&
            this.value.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.value.params];
        } else if (this.value instanceof QueryParam) {
            tmpParams = [...tmpParams, this.value];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

export type {
    ConvertComparisonParamToTyped,
    ConvertComparisonParamToNonNullTyped,
    InferValueTypeFromComparable
}

export {
    BasicComparisonOperation,
    BetweenComparisonOperation,
    InComparisonOperation,
    IsNullComparisonOperation,
    LikeComparisonOperation
}