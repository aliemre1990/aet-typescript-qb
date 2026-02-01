import { type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { LiteralToBase, UndefinedIfLengthZero } from "../utility/common.js";
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
import { getDbFunctions } from "./uitlity/dbOperations.js";

type InferExpressionType<
    TElseExpression extends IComparable<any, any, any, any, any, any, any> | DbValueTypes | null | undefined = undefined,
    TWhenExpressions extends readonly [
        any,
        IComparable<any, any, any, any, any, any, any> | DbValueTypes | null
    ][] | undefined = undefined
> =
    TWhenExpressions extends readonly [infer First, ...infer Rest] ?
    First extends readonly [any, any] ? First[1] extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType extends null ? DbValueTypes | null : LiteralToBase<TValueType> :
    First[1] extends null ?
    Rest extends readonly [any, ...any] ? InferExpressionType<TElseExpression, Rest> : DbValueTypes | null :
    First[1] extends DbValueTypes | null ? LiteralToBase<First[1]> : DbValueTypes | null :
    never
    :
    TElseExpression extends undefined ? DbValueTypes | null :
    TElseExpression extends null ? DbValueTypes | null :
    TElseExpression extends DbValueTypes | null ? TElseExpression :
    TElseExpression extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType extends null ? DbValueTypes | null : LiteralToBase<TValueType> :
    any;


type AccumulateCaseParams<
    TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined,
    TCaseParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined,
    TCaseResultParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined
> =
    [
        ...(TParams extends undefined ? [] : TParams),
        ...(TCaseParams extends undefined ? [] : TCaseParams),
        ...(TCaseResultParams extends undefined ? [] : TCaseResultParams)
    ];

type AccumulateElseParams<
    TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined,
    TElseParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined
> =
    [
        ...(TParams extends undefined ? [] : TParams),
        ...(TElseParams extends undefined ? [] : TElseParams)
    ];

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
    TParams extends readonly QueryParam<TDbType, string, any, any, any, any>[] | undefined = undefined,
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
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>

    >(check: (ops: DbFunctions<TDbType>) => TWhenResult, result: (ops: DbFunctions<TDbType>) => TExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpression extends undefined ? null : TElseExpression extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpression) |
        (TExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TExpressionResult),

        TMainExpression,
        TElseExpression,
        [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]],

        UndefinedIfLengthZero<
            AccumulateCaseParams<
                TParams,
                TWhenResult extends IComparable<TDbType, infer TCompParams, any, any, any, any, any> ? TCompParams :
                TWhenResult extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) ?
                AccumulateComparisonParams<[], TWhenResult> : undefined,
                TExpressionResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any, any> ? TCaseResultParams : undefined
            >
        >,

        TAs,
        TCastType
    >
    when<
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>

    >(check: (ops: DbFunctions<TDbType>) => TWhenResult, result: TExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpression extends undefined ? null : TElseExpression extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpression) |
        (TExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TExpressionResult),

        TMainExpression,
        TElseExpression,
        [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]],

        UndefinedIfLengthZero<
            AccumulateCaseParams<
                TParams,
                TWhenResult extends IComparable<TDbType, infer TCompParams, any, any, any, any, any> ? TCompParams :
                TWhenResult extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) ?
                AccumulateComparisonParams<[], TWhenResult> : undefined,
                TExpressionResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any, any> ? TCaseResultParams : undefined
            >
        >,

        TAs,
        TCastType
    >
    when<
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>

    >(check: TWhenResult, result: (ops: DbFunctions<TDbType>) => TExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpression extends undefined ? null : TElseExpression extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpression) |
        (TExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TExpressionResult),

        TMainExpression,
        TElseExpression,
        [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]],

        UndefinedIfLengthZero<
            AccumulateCaseParams<
                TParams,
                TWhenResult extends IComparable<TDbType, infer TCompParams, any, any, any, any, any> ? TCompParams :
                TWhenResult extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) ?
                AccumulateComparisonParams<[], TWhenResult> : undefined,
                TExpressionResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any, any> ? TCaseResultParams : undefined
            >
        >,

        TAs,
        TCastType
    >
    when<
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>

    >(check: TWhenResult, result: TExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpression extends undefined ? null : TElseExpression extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpression) |
        (TExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TExpressionResult),

        TMainExpression,
        TElseExpression,
        [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]],

        UndefinedIfLengthZero<
            AccumulateCaseParams<
                TParams,
                TWhenResult extends IComparable<TDbType, infer TCompParams, any, any, any, any, any> ? TCompParams :
                TWhenResult extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) ?
                AccumulateComparisonParams<[], TWhenResult> : undefined,
                TExpressionResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any, any> ? TCaseResultParams : undefined
            >
        >,

        TAs,
        TCastType
    >
    when<
        TWhenResult extends TMainExpression extends undefined ? (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) : IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null,
        TExpressionResult extends IComparable<TDbType, any, InferExpressionType<TElseExpression, TWhenExpressions>, any, any, any, any> | InferExpressionType<TElseExpression, TWhenExpressions>
    >(check: TWhenResult | ((ops: DbFunctions<TDbType>) => TWhenResult), expression: TExpressionResult | ((ops: DbFunctions<TDbType>) => TExpressionResult)): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpression extends undefined ? null : TElseExpression extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpression) |
        (TExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TExpressionResult),

        TMainExpression,
        TElseExpression,
        [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]],

        UndefinedIfLengthZero<
            AccumulateCaseParams<
                TParams,
                TWhenResult extends IComparable<TDbType, infer TCompParams, any, any, any, any, any> ? TCompParams :
                TWhenResult extends (ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>) ?
                AccumulateComparisonParams<[], TWhenResult> : undefined,
                TExpressionResult extends IComparable<TDbType, infer TCaseResultParams, any, any, any, any, any> ? TCaseResultParams : undefined
            >
        >,

        TAs,
        TCastType
    > {
        let checkRes: TWhenResult, expRes: TExpressionResult;

        const functions = getDbFunctions(this.dbType);
        if (typeof check === 'function') {
            checkRes = check(functions);
        } else {
            checkRes = check;
        }
        if (typeof expression == 'function') {
            expRes = expression(functions);
        } else {
            expRes = expression;
        }

        const resultWhenExpressions = this.whenExpressions ? [...this.whenExpressions, [checkRes, expRes]] : [[checkRes, expRes]];

        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            this.elseExpression,
            resultWhenExpressions as [...(TWhenExpressions extends undefined ? [] : TWhenExpressions), [TWhenResult, TExpressionResult]]
        )
    }

    else<
        TElseExpressionResult extends IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    >(elseExpression: (ops: DbFunctions<TDbType>) => TElseExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpressionResult),

        TMainExpression,
        TElseExpressionResult,
        TWhenExpressions,
        UndefinedIfLengthZero<
            AccumulateElseParams<
                TParams,
                TElseExpressionResult extends IComparable<TDbType, infer TElseParams, any, any, any, any, any> ? TElseParams : undefined
            >
        >,
        TAs,
        TCastType
    >
    else<
        TElseExpressionResult extends IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    >(elseExpression: TElseExpressionResult): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpressionResult),

        TMainExpression,
        TElseExpressionResult,
        TWhenExpressions,
        UndefinedIfLengthZero<
            AccumulateElseParams<
                TParams,
                TElseExpressionResult extends IComparable<TDbType, infer TElseParams, any, any, any, any, any> ? TElseParams : undefined
            >
        >,
        TAs,
        TCastType
    >

    else<
        TElseExpressionResult extends IComparable<TDbType, any, any, any, any, any, any> | DbValueTypes | null
    >(
        elseExpression: TElseExpressionResult | ((ops: DbFunctions<TDbType>) => TElseExpressionResult)
    ): SQLCaseExpression<
        TDbType,

        (TResult extends never ? {} : TResult) |
        (TElseExpressionResult extends IComparable<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : TElseExpressionResult),

        TMainExpression,
        TElseExpressionResult,
        TWhenExpressions,
        UndefinedIfLengthZero<
            AccumulateElseParams<
                TParams,
                TElseExpressionResult extends IComparable<TDbType, infer TElseParams, any, any, any, any, any> ? TElseParams : undefined
            >
        >,
        TAs,
        TCastType
    > {
        let elseRes: TElseExpressionResult;

        const functions = getDbFunctions(this.dbType);
        if (typeof elseExpression === 'function') {
            elseRes = elseExpression(functions);
        } else {
            elseRes = elseExpression;
        }

        return new SQLCaseExpression(
            this.dbType,
            this.asName,
            this.castType,
            this.mainExpression,
            elseRes,
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