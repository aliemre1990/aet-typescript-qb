import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { BasicComparisonOperationType, InferComparisonParams, InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";
import BaseColumnComparisonOperation from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import { extractParams } from "../utility.js";

class BasicColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends BasicComparisonOperationType,
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TApplied extends TValueType | null | IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = InferValueTypeFromExpression<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
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
    comparing: TComparing;
    value: TApplied

    as<TAs extends string>(asName: TAs) {
        return new BasicColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new BasicColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = convertArgsToQueryString([this.value], context);;

        let queryRes = `${comparingStr}${this.operation.symbol}${this.value instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
        comparing: TComparing,
        value: TApplied,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>([comparing, value])
        super(dbType, operation, params, undefined, asName, castType);
        this.comparing = comparing;
        this.value = value;

    }
}

export default BasicColumnComparisonOperation;