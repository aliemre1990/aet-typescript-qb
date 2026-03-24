import type { DbType } from "../../db.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { InferComparisonParams, InferFinalValueTypeFromApplied, InferFinalValueTypeFromComparable, LikeComparisonOperationType } from "../_baseClasses/BaseColumnComparisonOperation.js";
import BaseColumnComparisonOperation from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";

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
    TComparing extends IComparable<TDbType, any, any, string | null, any, any, any>,
    TApplied extends string | null | IComparable<TDbType, any, any, string | null, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> extends BaseColumnComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, InferLikeComparisonReturnType<InferFinalValueTypeFromComparable<TComparing>, InferFinalValueTypeFromApplied<TApplied>>>,
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
        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (
            value instanceof Object &&
            "params" in value &&
            value.params !== undefined &&
            value.params.length > 0
        ) {
            tmpParams = [...tmpParams, ...value.params];
        } else if (value instanceof QueryParam) {
            tmpParams = [...tmpParams, value];
        }
        super(dbType, operation, tmpParams as TParams, undefined, asName, castType);

        this.comparing = comparing;
        this.value = value;
    }
}

export default LikeColumnComparisonOperation;