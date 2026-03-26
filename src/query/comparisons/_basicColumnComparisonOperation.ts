import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { LiteralToBase, UndefinedIfLengthZero } from "../../utility/common.js";
import type { BasicComparisonOperationType, ConvertComparisonParamToTyped, InferComparisonParams, InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";
import BaseColumnComparisonOperation, { basicComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
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


function generateBasicComparison(operation: BasicComparisonOperationType) {

    function basicComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: TParamValue extends (LiteralToBase<TValueType> | null) ? TParamMedian : never):
        BasicColumnComparisonOperation<
            TDbType,
            typeof operation,
            TComparing,
            ConvertComparisonParamToTyped<TParamMedian, TValueType>

        >
    function basicComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: TApplied):
        BasicColumnComparisonOperation<
            TDbType,
            typeof operation,
            TComparing,
            TApplied
        >
    function basicComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: LiteralToBase<TValueType> | null):
        BasicColumnComparisonOperation<
            TDbType,
            typeof operation,
            TComparing,
            TValueType | null
        >
    function basicComparison<TComparing extends IQueryExpression<any, any, any, any, any, any, any>,>(
        this: TComparing,
        value: any
    ) {
        const dbType = this.dbType;

        return new BasicColumnComparisonOperation(
            dbType,
            operation,
            this,
            value,
            undefined,
            undefined
        );
    }

    return basicComparison;
}

const eq = generateBasicComparison(basicComparisonOperations.eq);
const notEq = generateBasicComparison(basicComparisonOperations.notEq);
const gt = generateBasicComparison(basicComparisonOperations.gt);
const gte = generateBasicComparison(basicComparisonOperations.gte);
const lt = generateBasicComparison(basicComparisonOperations.lt);
const lte = generateBasicComparison(basicComparisonOperations.lte);

export default BasicColumnComparisonOperation;

export {
    eq,
    notEq,
    gt,
    gte,
    lt,
    lte
}