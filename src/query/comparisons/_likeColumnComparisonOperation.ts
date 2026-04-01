import { dbTypes, type DbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { ConvertComparisonParamToNonNullTyped, InferComparisonParams, InferFinalValueTypeFromApplied, InferFinalValueTypeFromExpression, InferValueTypeFromExpression, LikeComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import BaseColumnComparisonOperation, { likeComparisonOperations } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../utility/common.js";
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
    TComparing extends IQueryExpression<TDbType, any, any, string | null, any, any, any>,
    TApplied extends string | null | IQueryExpression<TDbType, any, any, string | null, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    LikeComparisonOperationType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromExpression<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>,
    TAs,
    TCastType
> {
    comparing: TComparing;
    value: TApplied

    as<TAs extends string>(asName: TAs) {
        return new LikeColumnComparisonOperation<TDbType, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new LikeColumnComparisonOperation<TDbType, TComparing, TApplied, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
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
        operation: LikeComparisonOperationType,
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

function generateLikeComparison<
    TDbTypeGenerator extends DbType | undefined = undefined
>(operation: LikeComparisonOperationType) {

    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TParamMedian extends QueryParam<TDbType, string, any, any, any>,
        TParamValue extends TParamMedian extends QueryParam<any, any, infer TVal, any, any> ? TVal : never,
        TDbType extends DbType = TDbTypeGenerator extends undefined ? TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never : TDbTypeGenerator,
    >(this: TComparing, value: TParamValue extends string ? TParamMedian : never
    ): LikeColumnComparisonOperation<
        TDbType,
        TComparing,
        ConvertComparisonParamToNonNullTyped<TParamMedian, string>
    >
    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TApplied extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TDbType extends DbType = TDbTypeGenerator extends undefined ? TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never : TDbTypeGenerator,
    >(this: TComparing, value: TApplied):
        LikeColumnComparisonOperation<
            TDbType,
            TComparing,
            TApplied
        >
    function likeComparison<
        TComparing extends IQueryExpression<TDbType, any, string, any, any, any, any>,
        TDbType extends DbType = TDbTypeGenerator extends undefined ? TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never : TDbTypeGenerator,
    >(this: TComparing, value: string):
        LikeColumnComparisonOperation<
            TDbType,
            TComparing,
            InferValueTypeFromExpression<TDbType, TComparing>
        >
    function likeComparison<TComparing extends IQueryExpression<any, any, any, any, any, any, any>,>(
        this: TComparing,
        value: any
    ) {
        return new LikeColumnComparisonOperation(
            this.dbType,
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
const iLike = generateLikeComparison<typeof dbTypes.postgresql>(likeComparisonOperations.iLike);
const notILike = generateLikeComparison<typeof dbTypes.postgresql>(likeComparisonOperations.notILike);

export default LikeColumnComparisonOperation;

export {
    like,
    notLike,
    iLike,
    notILike
}