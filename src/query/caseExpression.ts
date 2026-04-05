import { type DbType } from "../db.js";
import type { DbValueTypes, GetColumnTypes } from "../table/column.js";
import type { IsAny, IsExact, IsExactAlt, LiteralToBase, UndefinedIfLengthZero } from "../utility/common.js";
import type BaseColumnComparisonOperation from "./_baseClasses/BaseColumnComparisonOperation.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { ExtractParams } from "./param.js";
import QueryParam from "./param.js";
import { extractParams } from "./utility.js";

type MapQueryParamToType<TQP extends QueryParam<any, any, any, any, any>, TValueType extends DbValueTypes | null> =
    TQP extends QueryParam<infer TDbType, infer TName, any, infer TAs, infer TCastType> ?
    QueryParam<TDbType, TName, TValueType, TAs, TCastType> :
    never;

type MapAnyTypedWhenExpressionParamsToTyped<
    TWhenExpressions extends readonly [any, IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined,
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
    TElseExpression extends IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        any,
        IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null
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

    First[1] extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ?

    TValueType extends null ? DbValueTypes | null : LiteralToBase<TValueType> | null :
    First[1] extends null ?
    Rest extends readonly [any, ...any] ? InferExpressionType<TElseExpression, Rest> : DbValueTypes | null :
    First[1] extends DbValueTypes | null ? LiteralToBase<First[1]> | null : DbValueTypes | null :
    never
    :
    TElseExpression extends undefined ? DbValueTypes | null :
    TElseExpression extends null ? DbValueTypes | null :
    TElseExpression extends DbValueTypes | null ? TElseExpression :
    TElseExpression extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType extends null ?
    DbValueTypes | null : LiteralToBase<TValueType> :
    any;


type AccumulateWhenParams<
    TMainExpression extends IQueryExpression<any, any, any, any, any, any, any> | undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>) : IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null,
        IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null
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
    TMainExpression extends IQueryExpression<any, any, any, any, any, any, any> | undefined,
    TElseExpression extends IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null | undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>) : IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null,
        IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined,
> =
    [
        ...(ExtractParams<TMainExpression>),
        ...(TWhenExpressions extends undefined ? [] : AccumulateWhenParams<TMainExpression, TWhenExpressions>),
        ...(ExtractParams<TElseExpression>)
    ];

type InferMainExpressionType<TMainExpression> =
    TMainExpression extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ?
    IsAny<TValueType> extends true ?
    never :
    IsExactAlt<TValueType, DbValueTypes | null> extends true ?
    never :
    TValueType | null :
    never;

type InferResultType<
    TWhenExpressions extends readonly [any, IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined = undefined,
    TElseExpression extends IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined
> = TWhenExpressions extends undefined ?
    TElseExpression extends undefined ? never :
    InferWhenExressionsResult<TWhenExpressions> | InferElseExpressionResult<TElseExpression> :
    InferWhenExressionsResult<TWhenExpressions> | InferElseExpressionResult<TElseExpression>;

type InferElseExpressionResult<
    TElseExpression extends IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined
> =
    TElseExpression extends undefined ?
    null :
    TElseExpression extends IQueryExpression<any, any, any, infer TFinalType, any, any, any> ?
    TFinalType :
    TElseExpression extends DbValueTypes | null ?
    TElseExpression :
    never;

type InferWhenExressionsResult<
    TWhenExpressions extends readonly [any, IQueryExpression<any, any, any, any, any, any, any> | DbValueTypes | null][] | undefined = undefined
> = TWhenExpressions extends [infer First, ...infer Rest] ?
    First extends [any, infer TExp] ?
    TExp extends IQueryExpression<any, any, any, infer TFinalType, any, any, any> ?
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
    TMainExpression extends IQueryExpression<TDbType, any, any, any, any, any, any> | undefined = undefined,
    TElseExpression extends IQueryExpression<TDbType, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IQueryExpression<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        IQueryExpression<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined = undefined,
    TResult extends DbValueTypes | null = InferResultType<TWhenExpressions, TElseExpression>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<AccumulateCaseParams<TMainExpression, TElseExpression, TWhenExpressions>>
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TDbType, TCastType, NonNullable<TResult>>,
    DetermineFinalValueType<TResult, DetermineValueType<TDbType, TCastType, NonNullable<TResult>>>,
    undefined,
    TAs,
    TCastType
> {
    mainExpression?: TMainExpression;
    elseExpression?: TElseExpression;
    whenExpressions?: TWhenExpressions;

    as<TAs extends string>(asName: TAs) {
        return new SQLCaseExpression<TDbType, TMainExpression, TElseExpression, TWhenExpressions, TResult, TAs, TCastType, TParams>(this.dbType, asName, this.castType, this.mainExpression);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new SQLCaseExpression<TDbType, TMainExpression, TElseExpression, TWhenExpressions, TResult, TAs, TCastType, TParams>(this.dbType, this.asName, type, this.mainExpression);
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
        const whenExpressionExtraction = (whenExpressions || []).reduce((acc, whenExp) => [...acc, whenExp[0], whenExp[1]], [] as any[]);
        let expressions = [
            ...(mainExpression ? [mainExpression] : []),
            ...whenExpressionExtraction,
            ...(elseExpression ? [elseExpression] : [])
        ];
        const params = extractParams<TParams>(expressions);
        super(dbType, params, undefined, asName, castType);

        this.mainExpression = mainExpression;
        this.elseExpression = elseExpression;
        this.whenExpressions = whenExpressions;
    }

    when<
        TWhenResult extends TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IQueryExpression<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression>,
        TThen extends IQueryExpression<TDbType, any, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>,
        TFinalWhenExpressions extends readonly [
            TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IQueryExpression<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
            IQueryExpression<TDbType, any, any, any, any, any, any> | DbValueTypes | null
        ][] | undefined = MapAnyTypedWhenExpressionParamsToTyped<
            TWhenExpressions,
            IsExact<
                DbValueTypes | null,
                InferExpressionType<TElseExpression, TWhenExpressions>
            > extends true ?
            TThen extends IQueryExpression<TDbType, any, infer TValType, any, any, any, any> ?
            IsAny<TValType> extends true ? DbValueTypes | null :
            TValType | null :
            TThen | null :
            InferExpressionType<TElseExpression, TWhenExpressions>
        >,
        TFinalWhenResult extends TMainExpression extends undefined ? (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>) : IQueryExpression<TDbType, any, InferMainExpressionType<TMainExpression>, any, any, any, any> | InferMainExpressionType<TMainExpression> = TWhenResult extends QueryParam<any, any, infer TValueType, any, any> ? IsAny<TValueType> extends true ? MapAnyTypedQueryParamToTyped<TWhenResult, InferMainExpressionType<TMainExpression>> : TWhenResult : TWhenResult
    >(check: TWhenResult, then: TThen): SQLCaseExpression<
        TDbType,
        TMainExpression,
        TElseExpression,
        [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TThen extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TThen, InferExpressionType<TElseExpression, TWhenExpressions>> : TThen]],
        InferResultType<[...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TThen extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TThen, InferExpressionType<TElseExpression, TWhenExpressions>> : TThen]], TElseExpression>,
        TAs,
        TCastType
    > {

        const resultWhenExpressions = this.whenExpressions ? [...this.whenExpressions, [check, then]] : [[check, then]];

        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            this.elseExpression,
            resultWhenExpressions as [...(TFinalWhenExpressions extends undefined ? [] : TFinalWhenExpressions), [TFinalWhenResult, TThen extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TThen, InferExpressionType<TElseExpression, TWhenExpressions>> : TThen]]
        )
    }


    else<
        TElseExpressionResult extends IQueryExpression<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions>,
        TFinalElseExpression extends IQueryExpression<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions> = TElseExpressionResult extends QueryParam<any, any, any, any, any> ? MapAnyTypedQueryParamToTyped<TElseExpressionResult, InferExpressionType<undefined, TWhenExpressions>> : TElseExpressionResult
    >(
        elseExpression: TElseExpressionResult
    ): SQLCaseExpression<
        TDbType,
        TMainExpression,
        TFinalElseExpression,
        TWhenExpressions,
        InferResultType<TWhenExpressions, TFinalElseExpression>,
        TAs,
        TCastType
    > {
        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            elseExpression as IQueryExpression<TDbType, any, any, InferExpressionType<undefined, TWhenExpressions>, any, any, any> | InferExpressionType<undefined, TWhenExpressions> as TFinalElseExpression,
            this.whenExpressions
        )
    }

}

function generateSQLCaseFn<
    TDbType extends DbType
>(dbType: TDbType) {

    function sqlCase<TExpression extends IQueryExpression<TDbType, any, any, any, any, any, any>>(expression: TExpression): SQLCaseExpression<TDbType, TExpression>
    function sqlCase(): SQLCaseExpression<TDbType>
    function sqlCase<
        TExpression extends IQueryExpression<TDbType, any, any, any, any, any, any>
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