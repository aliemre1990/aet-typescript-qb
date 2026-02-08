import { type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsAny, IsExact, IsExactAlt, LiteralToBase, UndefinedIfLengthZero } from "../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type { DbFunctions } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type QueryParam from "./param.js";

type MapQueryParamToType<TQP extends QueryParam<any, any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TQP extends QueryParam<infer TDbType, infer TName, any, infer TAs, infer TDefaultFieldKey, infer TCastType> ?
    QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType> :
    never;

type MapAnyTypedWhenExpressionParamsToTyped<
    TWhenExpressions extends readonly [any, IComparable<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined,
    TValueType extends DbValueTypes | null
> =
    TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [any, any] ?
    First[1] extends QueryParam<any, any, infer TParamType, any, any, any> ?
    IsExact<TParamType, DbValueTypes | null> extends true ?
    Rest extends readonly [any, ...any] ?
    [[First[0], MapQueryParamToType<First[1], TValueType>], ...MapAnyTypedWhenExpressionParamsToTyped<Rest, TValueType>] :
    [[First[0], MapQueryParamToType<First[1], TValueType>]] :
    Rest extends readonly [any, ...any] ?
    [First, ...MapAnyTypedWhenExpressionParamsToTyped<Rest, TValueType>] :
    [First] :
    Rest extends readonly [any, ...any] ?
    [First, ...MapAnyTypedWhenExpressionParamsToTyped<Rest, TValueType>] :
    [First] :
    never :
    undefined;

type MapAnyTypedQueryParamToTyped<TQP extends QueryParam<any, any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TQP extends QueryParam<infer TDbType, infer TName, infer TCurrValueType, infer TAs, infer TDefaultFieldKey, infer TCastType> ?
    IsAny<TCurrValueType> extends true ?
    QueryParam<TDbType, TName, TValueType, TAs, TDefaultFieldKey, TCastType> :
    TQP :
    never;

type InferExpressionType<
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        any,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined = undefined
> =
    TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [any, any] ?
    First[1] extends QueryParam<any, any, infer TParamType, any, any, any> ?

    IsAny<TParamType> extends true ?
    Rest extends readonly [any, ...any] ? InferExpressionType<TElseExpression, Rest> : DbValueTypes | null :
    IsExactAlt<TParamType, DbValueTypes | null> extends true ?
    Rest extends readonly [any, ...any] ? InferExpressionType<TElseExpression, Rest> : DbValueTypes | null :
    TParamType | null :

    First[1] extends IComparable<any, any, infer TValueType, any, any, any, any> ?

    TValueType extends null ? DbValueTypes | null : LiteralToBase<TValueType> | null :
    First[1] extends null ?
    Rest extends readonly [any, ...any] ? InferExpressionType<TElseExpression, Rest> : DbValueTypes | null :
    First[1] extends DbValueTypes | null ? LiteralToBase<First[1]> | null : DbValueTypes | null :
    never
    :
    TElseExpression extends undefined ? DbValueTypes | null :
    TElseExpression extends null ? DbValueTypes | null :
    TElseExpression extends DbValueTypes | null ? TElseExpression :
    TElseExpression extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType extends null ?
    DbValueTypes | null : LiteralToBase<TValueType> :
    any;


type AccumulateWhenParams<
    TMainExpression extends IComparable<any, any, any, any, any, any, any> | undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>) : IComparable<any, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined,
> = TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [infer TWhen, infer TThen] ?
    TThen extends IComparable<any, infer TThenParams, any, any, any, any, any> ?
    TWhen extends IComparable<any, infer TWhenParams, any, any, any, any, any> ?
    Rest extends readonly [any, ...any] ?
    [...(TWhenParams extends undefined ? [] : TWhenParams), ...(TThenParams extends undefined ? [] : TThenParams), ...AccumulateWhenParams<TMainExpression, Rest>] :
    [...(TWhenParams extends undefined ? [] : TWhenParams), ...(TThenParams extends undefined ? [] : TThenParams)] :
    TWhen extends (ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>) ?
    Rest extends readonly [any, ...any] ?
    [...(TThenParams extends undefined ? [] : TThenParams), ...(AccumulateComparisonParams<[], TWhen>), ...AccumulateWhenParams<TMainExpression, Rest>] :
    [...(TThenParams extends undefined ? [] : TThenParams), ...(AccumulateComparisonParams<[], TWhen>)] :
    Rest extends readonly [any, ...any] ?
    [...(TThenParams extends undefined ? [] : TThenParams), ...AccumulateWhenParams<TMainExpression, Rest>] :
    [...(TThenParams extends undefined ? [] : TThenParams)] :
    Rest extends readonly [any, ...any] ?
    [...AccumulateWhenParams<TMainExpression, Rest>] :
    [] :
    [] :
    [];

type AccumulateCaseParams<
    TMainExpression extends IComparable<any, any, any, any, any, any, any> | undefined,
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>) : IComparable<any, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined,
> =
    [
        ...(TMainExpression extends IComparable<any, infer TParams, any, any, any, any, any> ? TParams : []),
        ...AccumulateWhenParams<TMainExpression, TWhenExpressions>,
        ...(TElseExpression extends IComparable<any, infer TParams, any, any, any, any, any> ? TParams : [])
    ];

type InferMainExpressionType<TMainExpression> =
    TMainExpression extends IComparable<any, any, infer TValueType, any, any, any, any> ?
    IsAny<TValueType> extends true ?
    never :
    IsExactAlt<TValueType, DbValueTypes | null> extends true ?
    never :
    TValueType | null :
    never;

type InferResultType<
    TWhenExpressions extends readonly [any, IComparable<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined = undefined,
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined
> = InferWhenExressionsResult<TWhenExpressions> | InferElseExpressionResult<TElseExpression>;

type InferElseExpressionResult<
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined
> =
    TElseExpression extends undefined ?
    null :
    TElseExpression extends IComparable<any, any, any, infer TFinalType, any, any, any> ?
    TFinalType :
    TElseExpression extends DbValueTypes | null ?
    TElseExpression :
    never;

type InferWhenExressionsResult<
    TWhenExpressions extends readonly [any, IComparable<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined = undefined
> = TWhenExpressions extends [infer First, ...infer Rest] ?
    First extends [any, infer TExp] ?
    TExp extends IComparable<any, any, any, infer TFinalType, any, any, any> ?
    Rest extends readonly [any, ...any] ?
    TFinalType | InferWhenExressionsResult<Rest> :
    TFinalType :
    Rest extends readonly [any, ...any] ?
    TExp | InferWhenExressionsResult<Rest> :
    TExp :
    Rest extends readonly [any, ...any] ?
    InferWhenExressionsResult<TWhenExpressions> :
    never :
    never;

const defaultCaseExpressionFieldName = 'case';
type defaultCaseExpressionFieldNameType = typeof defaultCaseExpressionFieldName;

class SQLCaseExpression<
    TDbType extends DbType,
    TResult extends DbValueTypes | null = never,
    TMainExpression extends IComparable<TDbType, any, any, any, any, any, any> | undefined = undefined,
    TElseExpression extends IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, any, any, any, any>[] | undefined = UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TElseExpression, TWhenExpressions>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TResult>>,
    DetermineFinalValueType<TResult, DetermineValueType<TCastType, NonNullable<TResult>>>,
    defaultCaseExpressionFieldNameType,
    TAs,
    TCastType
> {
    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TResult>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TResult, DetermineValueType<TCastType, NonNullable<TResult>>>;


    defaultFieldKey: defaultCaseExpressionFieldNameType;

    dbType: TDbType;
    params?: TParams;
    asName?: TAs;
    castType?: TCastType;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new SQLCaseExpression<TDbType, TResult, TMainExpression, TElseExpression, TWhenExpressions, TParams, TAs, TCastType>(this.dbType, asName, this.castType, this.mainExpression);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new SQLCaseExpression<TDbType, TResult, TMainExpression, TElseExpression, TWhenExpressions, TParams, TAs, TCastType>(this.dbType, this.asName, type, this.mainExpression);
    }
    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        throw new Error("Method not implemented.");
    }

    mainExpression?: TMainExpression;
    elseExpression?: TElseExpression;
    whenExpressions?: TWhenExpressions;

    constructor(
        dbType: TDbType,
        asName?: TAs,
        castType?: TCastType,
        mainExpression?: TMainExpression,
        elseExpression?: TElseExpression,
        whenExpressions?: TWhenExpressions
    ) {
        this.dbType = dbType;
        this.asName = asName;
        this.defaultFieldKey = defaultCaseExpressionFieldName;
        this.castType = castType;

        this.mainExpression = mainExpression;
        this.elseExpression = elseExpression;
        this.whenExpressions = whenExpressions;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any, any>[] = [];
        if (mainExpression?.params !== undefined && mainExpression.params.length > 0) {
            tmpParams = [...mainExpression.params];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }
    }

    when<
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression>,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>,
        TFinalWhenExpressions extends readonly [
            TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
            IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
        ][] | undefined = MapAnyTypedWhenExpressionParamsToTyped<
            TWhenExpressions,
            IsExact<
                DbValueTypes | null,
                InferExpressionType<TElseExpression, TWhenExpressions>
            > extends true ?
            TExpressionResult extends IComparable<TDbType, any, infer TValType, any, any, any, any> ?
            IsAny<TValType> extends true ? DbValueTypes | null :
            TValType | null :
            TExpressionResult | null :
            InferExpressionType<TElseExpression, TWhenExpressions>
        >,
        TFinalWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression> = TWhenResult extends QueryParam<any, any, infer TValueType, any, any, any> ? IsAny<TValueType> extends true ? MapAnyTypedQueryParamToTyped<TWhenResult, InferMainExpressionType<TMainExpression>> : TWhenResult : TWhenResult
    >(check: TWhenResult, expression: TExpressionResult): SQLCaseExpression<
        TDbType,
        InferResultType<[...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]], TElseExpression>,
        TMainExpression,
        TElseExpression,
        [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]],

        UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TElseExpression, [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]]>>,


        TAs,
        TCastType
    > {

        const resultWhenExpressions = this.whenExpressions ? [...this.whenExpressions, [check, expression]] : [[check, expression]];

        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            this.elseExpression,
            resultWhenExpressions as [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]]
        )
    }


    else<
        TElseExpressionResult extends IComparable<TDbType, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any, any> | InferExpressionType<undefined, TWhenExpressions>,
        TFinalElseExpression extends IComparable<TDbType, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any, any> | InferExpressionType<undefined, TWhenExpressions> = TElseExpressionResult extends QueryParam<any, any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TElseExpressionResult, InferExpressionType<undefined, TWhenExpressions>> : TElseExpressionResult
    >(
        elseExpression: TElseExpressionResult
    ): SQLCaseExpression<
        TDbType,
        InferResultType<TWhenExpressions, TFinalElseExpression>,
        TMainExpression,
        TFinalElseExpression,
        TWhenExpressions,
        UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TFinalElseExpression, TWhenExpressions>>,
        TAs,
        TCastType
    > {
        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            elseExpression as IComparable<TDbType, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any, any> | InferExpressionType<undefined, TWhenExpressions> as TFinalElseExpression,
            this.whenExpressions
        )
    }

}

function generateSQLCaseFn<
    TDbType extends DbType
>(dbType: TDbType) {

    function sqlCase<TExpression extends IComparable<TDbType, any, any, any, any, any, any>>(expression: TExpression):
        SQLCaseExpression<TDbType, never, TExpression, undefined, undefined, TExpression extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? TParams : never>
    function sqlCase():
        SQLCaseExpression<TDbType, never>
    function sqlCase<
        TExpression extends IComparable<TDbType, any, any, any, any, any, any> | undefined
    >(expression?: TExpression) {
        return new SQLCaseExpression<
            TDbType,
            never,
            TExpression,
            undefined,
            undefined,
            TExpression extends undefined ? undefined : (TExpression extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? TParams : never)
        >(dbType, undefined, undefined, expression);
    }

    return sqlCase;
}

export default SQLCaseExpression;

export {
    generateSQLCaseFn
}