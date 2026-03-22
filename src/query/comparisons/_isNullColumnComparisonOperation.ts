import type { DbType } from "../../db.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { IComparisonOperation, InferComparisonParams, IsNullComparisonOperationType } from "../_interfaces/IComparisonOperation.js";
import type QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import between from "./between.js";
import eq from "./eq.js";
import gt from "./gt.js";
import gte from "./gte.js";
import sqlIn from "./in.js";
import isNotNull from "./isNotNull.js";
import isNull from "./isNull.js";
import like from "./like.js";
import lt from "./lt.js";
import lte from "./lte.js";
import notBetween from "./notBetween.js";
import notEq from "./notEq.js";
import notLike from "./notLike.js";

class IsNullColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends IsNullComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, []>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, boolean>,
    TAs,
    TCastType
> {

    dbType: TDbType;
    params?: TParams;
    [IComparableValueDummySymbol]: DetermineValueType<TCastType, boolean>;
    [IComparableFinalValueDummySymbol]: DetermineValueType<TCastType, boolean>;
    fieldName: undefined = undefined;
    asName: TAs;
    castType?: TCastType;

    operation: TOperation;
    comparing: TComparing;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
    notBetween: typeof notBetween = notBetween;
    isNull: typeof isNull = isNull;
    isNotNull: typeof isNotNull = isNotNull;
    like: typeof like = like;
    notLike: typeof notLike = notLike;

    as<TAs extends string>(asName: TAs) {
        return new IsNullColumnComparisonOperation<TDbType, TOperation, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new IsNullColumnComparisonOperation<TDbType, TOperation, TComparing, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.asName, type);
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
        operation: TOperation,
        comparing: TComparing,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

export default IsNullColumnComparisonOperation;