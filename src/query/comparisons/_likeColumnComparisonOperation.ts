import type { DbType } from "../../db.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { ConvertComparisonParamToNonNullTyped, InferComparisonParams, InferFinalValueTypeFromApplied, InferFinalValueTypeFromExpression, InferValueTypeFromExpression, LikeComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import BaseColumnComparisonOperation, { likeComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import { extractParams } from "../utility.js";

type InferLikeComparisonReturnType<
    TComparingType extends string | null,
    TAppliedType extends string | null
> =
    null extends TComparingType ? boolean | null :
    null extends TAppliedType ? boolean | null :
    boolean;

class LikeColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends LikeComparisonOperationType,
    TComparing extends IQueryExpression<TDbType, any, any, string | null, any, any, any>,
    TApplied extends string | null | IQueryExpression<TDbType, any, any, string | null, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromExpression<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>,
    TAs,
    TCastType
> {
    comparing: TComparing;
    value: TApplied

    as<TAs extends string>(asName: TAs) {
        return new LikeColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new LikeColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
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

        let queryRes = `${comparingStr} ${this.operation.symbol} ${this.value instanceof QueryBuilder ? `(${appliedStrArr[0]})` : appliedStrArr[0]}`;

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
        const params = extractParams<TParams>([comparing, value]);
        super(dbType, operation, params, undefined, asName, castType);

        this.comparing = comparing;
        this.value = value;
    }
}

function generateLikeComparison<TComparisonType extends LikeComparisonOperationType>(operation: TComparisonType) {

    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: TParamValue extends string ? TParamMedian : never
    ): LikeColumnComparisonOperation<
        TDbType,
        TComparisonType,
        TComparing,
        ConvertComparisonParamToNonNullTyped<TParamMedian, string>
    >
    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TApplied extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: TApplied):
        LikeColumnComparisonOperation<
            TDbType,
            TComparisonType,
            TComparing,
            TApplied
        >
    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never,
    >(this: TComparing, value: string):
        LikeColumnComparisonOperation<
            TDbType,
            TComparisonType,
            TComparing,
            InferValueTypeFromExpression<TDbType, TComparing>
        >
    function likeComparison<TComparing extends IQueryExpression<any, any, any, any, any, any, any>,>(
        this: TComparing,
        value: any
    ) {
        const dbType = this.dbType;

        return new LikeColumnComparisonOperation(
            dbType,
            operation,
            this,
            value,
            undefined,
            undefined
        );
    }

    return likeComparison;
}

const like = generateLikeComparison(likeComparisonOperations.like);
const notLike = generateLikeComparison(likeComparisonOperations.notLike);

export default LikeColumnComparisonOperation;

export {
    like,
    notLike
}