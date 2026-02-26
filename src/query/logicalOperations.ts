import { type DbType } from "../db.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import { queryBuilderContextFactory, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type QueryParam from "./param.js";

type InferLogicalOperationParams<
    TComparisons extends readonly (ColumnComparisonOperation<any, any, any, any, any> | ColumnLogicalOperation<any, any, any>)[],
> = TComparisons extends readonly [infer First, ...infer Rest] ?
    First extends { params?: infer TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined } ?
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
    TComparisons extends readonly (ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any>)[],
    TParams extends readonly QueryParam<TDbType, string, any, any, any, any>[] | undefined = UndefinedIfLengthZero<InferLogicalOperationParams<TComparisons>>
> {
    dbType: TDbType;
    operator: LogicalOperation;
    comparisons: TComparisons;

    params?: TParams;

    constructor(
        dbType: TDbType,
        operator: LogicalOperation,
        comparisons: TComparisons
    ) {
        this.dbType = dbType;
        this.operator = operator;
        this.comparisons = comparisons;


        let tmpParams: readonly QueryParam<TDbType, any, any, any, any, any>[] = [];

        comparisons.forEach(comp => {
            if (
                comp instanceof Object &&
                "params" in comp &&
                comp.params !== undefined &&
                comp.params.length > 0
            ) {
                tmpParams = [...tmpParams, ...comp.params];
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
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.and, ops);
    }
}


function generateOrFn<TDbType extends DbType>(
    dbType: TDbType
) {
    return function <
        TComparisons extends (ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any>)[]
    >(...ops: TComparisons) {
        return new ColumnLogicalOperation<TDbType, TComparisons>(dbType, logicalOperations.or, ops);
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