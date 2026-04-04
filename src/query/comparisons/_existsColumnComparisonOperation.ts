import { PgDbType, type DbType, type MySQLDbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { existsComparisonOperations, type ExistsComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { ExtractParams } from "../param.js";
import type QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { extractParams } from "../utility.js";

class ExistsColumnComparionOperation<
    TDbType extends DbType,
    TCompared extends QueryBuilder<TDbType, any, any, any, any, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<ExtractParams<TCompared>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    ExistsComparisonOperationType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, boolean>,
    TAs,
    TCastType
> {
    compared: TCompared;

    as<TAs extends string>(asName: TAs) {
        return new ExistsColumnComparionOperation<TDbType, TCompared, TParams, TAs, TCastType>(this.dbType, this.operation, this.compared, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new ExistsColumnComparionOperation<TDbType, TCompared, TParams, TAs, TCastType>(this.dbType, this.operation, this.compared, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const queryBuilderResult = this.compared.buildSQL(context).query;

        let queryRes = `${this.operation.symbol}(${queryBuilderResult})`;
        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: ExistsComparisonOperationType,
        compared: TCompared,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>([compared]);
        super(dbType, operation, params, undefined, asName, castType);

        this.compared = compared;
    }
}

function generateExistsComparison<
    TDbType extends DbType
>(dbType: TDbType, operation: ExistsComparisonOperationType) {
    function existsComparison<
        TCompared extends QueryBuilder<TDbType, any, any, any, any, any, any, any, any>,
    >(subQuery: TCompared): ExistsColumnComparionOperation<
        TDbType,
        TCompared,
        undefined
    > {
        return new ExistsColumnComparionOperation(
            dbType,
            operation,
            subQuery,
            undefined,
            undefined
        );
    }

    return existsComparison;
}

export default ExistsColumnComparionOperation;

export {
    generateExistsComparison
}