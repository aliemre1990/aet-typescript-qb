import type { DbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import type { LiteralToBase, UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { betweenComparisonOperations, type BetweenComparisonOperationType, type ConvertComparisonParamToTyped, type InferComparisonParams, type InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import { extractParams } from "../utility.js";

class BetweenColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TLApplied extends TValueType | null | IQueryExpression<TDbType, any, any, any, any, any, any>,
    TRApplied extends TValueType | null | IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = InferValueTypeFromExpression<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TLApplied, TRApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    BetweenComparisonOperationType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, boolean>,
    TAs,
    TCastType
> {
    comparing: TComparing;
    lValue: TLApplied;
    rValue: TRApplied;

    as<TAs extends string>(asName: TAs) {
        return new BetweenColumnComparisonOperation<TDbType, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new BetweenColumnComparisonOperation<TDbType, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = convertArgsToQueryString([this.lValue, this.rValue], context);

        let queryRes = `${comparingStr} ${this.operation.symbol} ${this.lValue instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]} AND ${this.rValue instanceof QueryBuilder ? `(${appliedStrArr[1]})` : appliedStrArr[1]}`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: BetweenComparisonOperationType,
        comparing: TComparing,
        lValue: TLApplied,
        rValue: TRApplied,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>([comparing, lValue, rValue]);
        super(dbType, operation, params, undefined, asName, castType);

        this.comparing = comparing;
        this.lValue = lValue;
        this.rValue = rValue;
    }
}


function generateBetweenComparison(
    operation: BetweenComparisonOperationType
) {

    // params
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
        rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
    ): BetweenColumnComparisonOperation<
        TDbType,
        TComparing,
        ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
        ConvertComparisonParamToTyped<TRParamMedian, TValueType>
    >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
        rightValue: LiteralToBase<TValueType> | null
    ): BetweenColumnComparisonOperation<
        TDbType,
        TComparing,
        ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
        TValueType | null

    >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        leftValue: LiteralToBase<TValueType> | null,
        rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
    ): BetweenColumnComparisonOperation<
        TDbType,
        TComparing,
        TValueType | null,
        ConvertComparisonParamToTyped<TRParamMedian, TValueType>
    >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TLParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TLParamValue extends TLParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        leftValue: TLParamValue extends (LiteralToBase<TValueType> | null) ? TLParamMedian : never,
        rightValue: TRApplied
    ): BetweenColumnComparisonOperation<
        TDbType,
        TComparing,
        ConvertComparisonParamToTyped<TLParamMedian, TValueType>,
        TRApplied
    >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TRParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TRParamValue extends TRParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        leftValue: TLApplied,
        rightValue: TRParamValue extends (LiteralToBase<TValueType> | null) ? TRParamMedian : never
    ): BetweenColumnComparisonOperation<
        TDbType,
        TComparing,
        TLApplied,
        ConvertComparisonParamToTyped<TRParamMedian, TValueType>
    >
    // All same
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: LiteralToBase<TValueType> | null):
        BetweenColumnComparisonOperation<
            TDbType,
            TComparing,
            TValueType | null,
            TValueType | null
        >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(this: TComparing, leftValue: TLApplied, rightValue: TRApplied):
        BetweenColumnComparisonOperation<
            TDbType,
            TComparing,
            TLApplied,
            TRApplied
        >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TLApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(this: TComparing, leftValue: TLApplied, rightValue: LiteralToBase<TValueType> | null):
        BetweenColumnComparisonOperation<
            TDbType,
            TComparing,
            TLApplied,
            TValueType | null
        >
    function betweenComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TRApplied extends IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(this: TComparing, leftValue: LiteralToBase<TValueType> | null, rightValue: TRApplied):
        BetweenColumnComparisonOperation<
            TDbType,
            TComparing,
            TValueType | null,
            TRApplied
        >
    //Implementation
    function betweenComparison<TComparing extends IQueryExpression<any, any, any, any, any, any, any>>(
        this: TComparing,
        leftValue: any,
        rightValue: any
    ) {

        const dbType = this.dbType;

        return new BetweenColumnComparisonOperation(
            dbType,
            operation,
            this,
            leftValue,
            rightValue,
            undefined,
            undefined
        );
    }
    return betweenComparison;
}

const between = generateBetweenComparison(betweenComparisonOperations.between);
const notBetween = generateBetweenComparison(betweenComparisonOperations.notBetween);

export default BetweenColumnComparisonOperation;

export {
    between,
    notBetween
}
