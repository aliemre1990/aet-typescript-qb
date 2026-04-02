import { type DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type BaseColumnComparisonOperation from "./_baseClasses/BaseColumnComparisonOperation.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { queryBuilderContextFactory, type DetermineValueType, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import QueryParam from "./param.js";
import { extractParams } from "./utility.js";

type InferLogicalOperationParams<
    TComparisons extends readonly (BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>)[],
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
    TComparisons extends readonly (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferLogicalOperationParams<TComparisons>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, boolean>,
    undefined,
    TAs,
    TCastType
> {
    operator: LogicalOperation;
    comparisons: TComparisons;


    as<TAs extends string>(asName: TAs) {
        return new ColumnLogicalOperation<TDbType, TComparisons, TParams, TAs, TCastType>(this.dbType, this.operator, this.comparisons, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new ColumnLogicalOperation<TDbType, TComparisons, TParams, TAs, TCastType>(this.dbType, this.operator, this.comparisons, this.asName, type);
    }

    constructor(
        dbType: TDbType,
        operator: LogicalOperation,
        comparisons: TComparisons,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>(comparisons);
        super(dbType, params, undefined, asName, castType);

        this.operator = operator;
        this.comparisons = comparisons;
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
        TComparisons extends (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.and, ops, undefined, undefined);
    }
}


function generateOrFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.or, ops, undefined, undefined);
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