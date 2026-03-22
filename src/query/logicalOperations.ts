import { type DbType } from "../db.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import QueryParam from "./param.js";

type InferLogicalOperationParams<
    TComparisons extends readonly (ColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>)[],
> = TComparisons extends readonly [infer First, ...infer Rest] ?
    First extends { params?: infer TParams extends readonly QueryParam<any, any, any, any, any>[] | undefined } ?
    Rest extends readonly [any, ...any[]] ?
    [...(TParams extends undefined ? [] : TParams), ...InferLogicalOperationParams<Rest>] :
    (TParams extends undefined ? [] : TParams) :
    Rest extends readonly [any, ...any[]] ?
    InferLogicalOperationParams<Rest> :
    [] :
    [];

const logicalOperations = {
    and: { name: 'AND' },
    or: { name: 'OR' }
} as const

type LogicalOperation = (typeof logicalOperations[keyof typeof logicalOperations]);

class ColumnLogicalOperation<
    TDbType extends DbType,
    TComparisons extends readonly (ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferLogicalOperationParams<TComparisons>>,
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

    operator: LogicalOperation;
    comparisons: TComparisons;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAs extends string>(asName: TAs) {
        return new ColumnLogicalOperation<TDbType, TComparisons, TParams, TAs, TCastType>(this.dbType, this.operator, this.comparisons, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new ColumnLogicalOperation<TDbType, TComparisons, TParams, TAs, TCastType>(this.dbType, this.operator, this.comparisons, this.asName, type);
    }

    constructor(
        dbType: TDbType,
        operator: LogicalOperation,
        comparisons: TComparisons,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operator = operator;
        this.comparisons = comparisons;

        this.asName = asName;
        this.castType = castType;
        
        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];

        comparisons.forEach(comp => {
            if (
                comp instanceof Object &&
                "params" in comp &&
                comp.params !== undefined &&
                comp.params.length > 0
            ) {
                tmpParams = [...tmpParams, ...comp.params];
            } else if (comp instanceof QueryParam) {
                tmpParams = [...tmpParams, comp];
            }
        })

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }
    }

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] } {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let previousIsTopLevelVal = context.isTopLevel;
        context.isTopLevel = false;
        let res = this.comparisons.map(comp => comp.buildSQL(context).query).join(` ${this.operator.name} `);
        context.isTopLevel = previousIsTopLevelVal;

        res = context.isTopLevel === false ? `(${res})` : res;
        return { query: res, params: [...(context?.params || [])] };
    }

}

function generateAndFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.and, ops, undefined);
    }
}


function generateOrFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.or, ops, undefined);
    }
}

export default ColumnLogicalOperation;

export {
    logicalOperations,
    generateAndFn,
    generateOrFn
}

export type {
    LogicalOperation
}