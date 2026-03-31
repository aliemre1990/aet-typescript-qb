import type { DbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { isNullComparisonOperations, type InferComparisonParams, type IsNullComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { extractParams } from "../utility.js";

class IsNullColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, []>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    IsNullComparisonOperationType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, boolean>,
    TAs,
    TCastType
> {
    comparing: TComparing;

    as<TAs extends string>(asName: TAs) {
        return new IsNullColumnComparisonOperation<TDbType, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new IsNullColumnComparisonOperation<TDbType, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.asName, type);
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
        operation: IsNullComparisonOperationType,
        comparing: TComparing,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>([comparing]);
        super(dbType, operation, params, undefined, asName, castType);

        this.comparing = comparing;
    }
}

function generateIsNullComparison(operation: IsNullComparisonOperationType) {
    function isNullComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing): IsNullColumnComparisonOperation<
        TDbType,
        TComparing,
        undefined
    > {
        const dbType = this.dbType;

        return new IsNullColumnComparisonOperation(
            dbType,
            operation,
            this,
            undefined,
            undefined
        );
    }

    return isNullComparison;
}

const isNull = generateIsNullComparison(isNullComparisonOperations.isNull);
const isNotNull = generateIsNullComparison(isNullComparisonOperations.isNotNull);

export default IsNullColumnComparisonOperation;

export {
    isNull,
    isNotNull
}