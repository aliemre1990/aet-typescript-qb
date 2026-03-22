import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { InComparisonOperationType, InferComparisonParams, InferValueTypeFromComparable } from "../_interfaces/IComparisonOperation.js";
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

class InColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends InComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TApplied extends readonly (TValueType | null | IComparable<TDbType, any, any, any, any, any, any>)[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, TApplied>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, boolean>,
    DetermineValueType<TCastType, boolean>,
    undefined,
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
    value: TApplied

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
        return new InColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new InColumnComparisonOperation<TDbType, TOperation, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = [];
        if (this.value) {
            appliedStrArr = convertArgsToQueryString(this.value, context);
        }

        let queryRes = `${comparingStr} ${this.operation.symbol} (${appliedStrArr.join(', ')})`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: TOperation,
        comparing: TComparing,
        value: TApplied,
        asName: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.operation = operation;
        this.comparing = comparing;
        this.value = value;
        this.asName = asName;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;

        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (value !== undefined && value.length > 0) {
            value.forEach(val => {
                if (
                    val instanceof Object &&
                    "params" in val &&
                    val.params !== undefined &&
                    Array.isArray(val.params) &&
                    val.params.length > 0
                ) {
                    tmpParams = [...tmpParams, ...val.params];
                } else if (val instanceof QueryParam) {
                    tmpParams = [...tmpParams, val];
                }
            })
        }

        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }

    }
}

export default InColumnComparisonOperation;