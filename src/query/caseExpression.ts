import { type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsAny, IsExact, IsExactAlt, LiteralToBase, UndefinedIfLengthZero } from "../utility/common.js";
import type BaseColumnComparisonOperation from "./_baseClasses/BaseColumnComparisonOperation.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { ExtractParams } from "./param.js";
import QueryParam from "./param.js";

type MapQueryParamToType<TQP extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TQP extends QueryParam<infer TDbType, infer TName, any, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, TValueType, TAs, TCastType> :
    never;

type MapAnyTypedWhenExpressionParamsToTyped<
    TWhenExpressions extends readonly [any, IComparable<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined,
    TValueType extends DbValueTypes | null
> =
    TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [any, any] ?
    First[1] extends QueryParam<any, any, infer TParamType, any, any> ?
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

type MapAnyTypedQueryParamToTyped<TQP extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TQP extends QueryParam<infer TDbType, infer TName, infer TCurrValueType, infer TAs, infer TCastType> ?
    IsAny<TCurrValueType> extends true ?
    QueryParam<TDbType, TName, TValueType, TAs, TCastType> :
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
    First[1] extends QueryParam<any, any, infer TParamType, any, any> ?

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
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>) : IComparable<any, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined,
> = TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [infer TWhen, infer TThen] ?
    TWhen extends (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>) ?
    Rest extends readonly [any, ...any] ?
    [...(AccumulateComparisonParams<TWhen>), ...(ExtractParams<TThen>), ...AccumulateWhenParams<TMainExpression, Rest>] :
    [...(AccumulateComparisonParams<TWhen>), ...(ExtractParams<TThen>)] :
    Rest extends readonly [any, ...any[]] ?
    [...(ExtractParams<TWhen>), ...(ExtractParams<TThen>), ...AccumulateWhenParams<TMainExpression, Rest>] :
    [...(ExtractParams<TWhen>), ...(ExtractParams<TThen>)] :
    Rest extends readonly [any, ...any] ?
    [...AccumulateWhenParams<TMainExpression, Rest>] :
    [] :
    [];

type AccumulateCaseParams<
    TMainExpression extends IComparable<any, any, any, any, any, any, any> | undefined,
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>) : IComparable<any, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined,
> =
    [
        ...(ExtractParams<TMainExpression>),
        ...(TWhenExpressions extends undefined ? [] : AccumulateWhenParams<TMainExpression, TWhenExpressions>),
        ...(ExtractParams<TElseExpression>)
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
> = TWhenExpressions extends undefined ?
    TElseExpression extends undefined ? never :
    InferWhenExressionsResult<TWhenExpressions> | InferElseExpressionResult<TElseExpression> :
    InferWhenExressionsResult<TWhenExpressions> | InferElseExpressionResult<TElseExpression>;

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

class SQLCaseExpression<
    TDbType extends DbType,
    TMainExpression extends IComparable<TDbType, any, any, any, any, any, any> | undefined = undefined,
    TElseExpression extends IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined = undefined,
    TResult extends DbValueTypes | null = InferResultType<TWhenExpressions, TElseExpression>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TElseExpression, TWhenExpressions>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TResult>>,
    DetermineFinalValueType<TResult, DetermineValueType<TCastType, NonNullable<TResult>>>,
    undefined,
    TAs,
    TCastType
> {
    mainExpression?: TMainExpression;
    elseExpression?: TElseExpression;
    whenExpressions?: TWhenExpressions;

    as<TAs extends string>(asName: TAs) {
        return new SQLCaseExpression<TDbType, TMainExpression, TElseExpression, TWhenExpressions, TResult, TParams, TAs, TCastType>(this.dbType, asName, this.castType, this.mainExpression);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new SQLCaseExpression<TDbType, TMainExpression, TElseExpression, TWhenExpressions, TResult, TParams, TAs, TCastType>(this.dbType, this.asName, type, this.mainExpression);
    }
    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        throw new Error("Method not implemented.");
    }


    constructor(
        dbType: TDbType,
        asName: TAs,
        castType: TCastType,
        mainExpression?: TMainExpression,
        elseExpression?: TElseExpression,
        whenExpressions?: TWhenExpressions
    ) {
        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (mainExpression?.params !== undefined && mainExpression.params.length > 0) {
            tmpParams = [...mainExpression.params];
        } else if (mainExpression instanceof QueryParam) {
            tmpParams = [mainExpression];
        }
        super(dbType, tmpParams as TParams, undefined, asName, castType);

        this.mainExpression = mainExpression;
        this.elseExpression = elseExpression;
        this.whenExpressions = whenExpressions;
    }

    when<
        TWhenResult extends TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IComparable<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression>,
        TExpressionResult extends IComparable<TDbType, any, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>,
        TFinalWhenExpressions extends readonly [
            TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
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
        TFinalWhenResult extends TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IComparable<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression> = TWhenResult extends QueryParam<any, any, infer TValueType, any, any> ? IsAny<TValueType> extends true ? MapAnyTypedQueryParamToTyped<TWhenResult, InferMainExpressionType<TMainExpression>> : TWhenResult : TWhenResult
    >(check: TWhenResult, expression: TExpressionResult): SQLCaseExpression<
        TDbType,
        TMainExpression,
        TElseExpression,
        [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]],
        InferResultType<[...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]], TElseExpression>,
        UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TElseExpression, [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]]>>,
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
            resultWhenExpressions as [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TExpressionResult, InferExpressionType<TElseExpression, TWhenExpressions>> : TExpressionResult]]
        )
    }


    else<
        TElseExpressionResult extends IComparable<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions>,
        TFinalElseExpression extends IComparable<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions> = TElseExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TElseExpressionResult, InferExpressionType<undefined, TWhenExpressions>> : TElseExpressionResult
    >(
        elseExpression: TElseExpressionResult
    ): SQLCaseExpression<
        TDbType,
        TMainExpression,
        TFinalElseExpression,
        TWhenExpressions,
        InferResultType<TWhenExpressions, TFinalElseExpression>,
        UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TFinalElseExpression, TWhenExpressions>>,
        TAs,
        TCastType
    > {
        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            elseExpression as IComparable<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions> as TFinalElseExpression,
            this.whenExpressions
        )
    }

}

function generateSQLCaseFn<
    TDbType extends DbType
>(dbType: TDbType) {

    function sqlCase<TExpression extends IComparable<TDbType, any, any, any, any, any, any>>(expression: TExpression): SQLCaseExpression<TDbType, TExpression>
    function sqlCase(): SQLCaseExpression<TDbType>
    function sqlCase<
        TExpression extends IComparable<TDbType, any, any, any, any, any, any>
    >(expression?: TExpression) {
        if (expression === undefined) {
            return new SQLCaseExpression(dbType, undefined, undefined);
        }

        return new SQLCaseExpression<
            TDbType,
            TExpression
        >(dbType, undefined, undefined, expression);
    }

    return sqlCase;
}

export default SQLCaseExpression;

export {
    generateSQLCaseFn
}