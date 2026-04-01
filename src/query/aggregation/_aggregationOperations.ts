import type { DbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import QueryParam from "../param.js";
import { convertArgsToQueryString } from "../utility/common.js";
import BaseQueryExpression from "../_baseClasses/BaseQueryExpression.js";
import { extractParams } from "../utility.js";


const aggregationOperations = {
    // Basic aggregations
    count: { name: 'COUNT' },
    countDistinct: { name: 'COUNT_DISTINCT' },
    sum: { name: 'SUM' },
    avg: { name: 'AVG' },
    min: { name: 'MIN' },
    max: { name: 'MAX' },

    // String aggregations
    stringAgg: { name: 'STRING_AGG' },

    // Array aggregations (PostgreSQL)
    arrayAgg: { name: 'ARRAY_AGG' },

    // JSON aggregations (PostgreSQL/MySQL)
    jsonAgg: { name: 'JSON_AGG' },
    jsonbAgg: { name: 'JSONB_AGG' },

    jsonObjectAgg: { name: 'JSON_OBJECT_AGG' },

    // Boolean aggregations
    boolAnd: { name: 'BOOL_AND' },
    boolOr: { name: 'BOOL_OR' },
    every: { name: 'EVERY' }, // PostgreSQL alias for BOOL_AND

    // Window function related (often used with aggregations)
    first: { name: 'FIRST_VALUE' },
    last: { name: 'LAST_VALUE' }
} as const;

type AggregationOperation = (typeof aggregationOperations)[keyof typeof aggregationOperations];

class BasicColumnAggregationOperation<
    TDbType extends DbType,
    TArgs extends (

        DbValueTypes | null |
        IQueryExpression<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TDbType, TCastType, NonNullable<TReturnType>>,
    DetermineFinalValueType<TReturnType, DetermineValueType<TDbType, TCastType, NonNullable<TReturnType>>>,
    undefined,
    TAs,
    TCastType
> {
    args: TArgs;
    operation: AggregationOperation;

    as<TAs extends string>(asName: TAs) {
        return new BasicColumnAggregationOperation<TDbType, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.operation, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new BasicColumnAggregationOperation<TDbType, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.operation, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const argsStrArr = convertArgsToQueryString(this.args, context);
        const argsRes = argsStrArr.join(`, `);
        const queryRes = `${this.operation.name.toUpperCase()}(${argsRes})${this.asName ? ` AS "${this.asName}"` : ''}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        operation: AggregationOperation,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>(args);
        super(dbType, params, undefined, asName, castType);

        this.args = args;
        this.operation = operation;
    }
}

export default BasicColumnAggregationOperation;

export {
    aggregationOperations
}

export type {
    AggregationOperation
}