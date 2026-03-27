import { PgDbType, type DbType, type MySQLDbType } from "../../db.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { existsComparisonOperations, type ExistsComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { ExtractParams } from "../param.js";
import type QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { extractParams } from "../utility.js";

class ExistsColumnComparionOperation<
    TDbType extends DbType,
    TOperation extends ExistsComparisonOperationType,
    TCompared extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<ExtractParams<TCompared>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, boolean>,
    TAs,
    TCastType
> {
    compared: TCompared;

    as<TAs extends string>(asName: TAs) {
        return new ExistsColumnComparionOperation<TDbType, TOperation, TCompared, TParams, TAs, TCastType>(this.dbType, this.operation, this.compared, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new ExistsColumnComparionOperation<TDbType, TOperation, TCompared, TParams, TAs, TCastType>(this.dbType, this.operation, this.compared, this.asName, type);
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
        operation: TOperation,
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
    TDbType extends DbType,
    TComparisonType extends ExistsComparisonOperationType
>(dbType: TDbType, operation: TComparisonType) {
    function existsComparison<
        TCompared extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    >(subQuery: TCompared): ExistsColumnComparionOperation<
        TDbType,
        TComparisonType,
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