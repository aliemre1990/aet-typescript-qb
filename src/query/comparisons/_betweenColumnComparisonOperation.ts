import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { BetweenComparisonOperationType, IComparisonOperation, InferComparisonParams, InferValueTypeFromComparable } from "../_interfaces/IComparisonOperation.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
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

class BetweenColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends BetweenComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TLApplied extends TValueType | null | IComparable<TDbType, any, any, any, any, any, any>,
    TRApplied extends TValueType | null | IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, [TLApplied, TRApplied]>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
> implements IComparisonOperation<
    TDbType,
    TOperation,
    TParams,
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
    lValue: TLApplied;
    rValue: TRApplied;

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
        return new BetweenColumnComparisonOperation<TDbType, TOperation, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new BetweenColumnComparisonOperation<TDbType, TOperation, TComparing, TLApplied, TRApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.lValue, this.rValue, this.asName, type);
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
        operation: TOperation,
        comparing: TComparing,
        lValue: TLApplied,
        rValue: TRApplied,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.lValue = lValue;
        this.rValue = rValue;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (
            this.lValue instanceof Object &&
            "params" in this.lValue &&
            this.lValue.params !== undefined &&
            this.lValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.lValue.params];
        } else if (this.lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, this.lValue];
        }

        if (
            this.rValue instanceof Object &&
            "params" in this.rValue &&
            this.rValue.params !== undefined &&
            this.rValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ... this.rValue.params];
        } else if (this.lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, this.lValue];
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

export default BetweenColumnComparisonOperation;
