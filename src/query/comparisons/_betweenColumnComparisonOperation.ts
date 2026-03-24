import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { type BetweenComparisonOperationType, type InferComparisonParams, type InferValueTypeFromComparable } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";

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
    lValue: TLApplied;
    rValue: TRApplied;

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
        castType: TCastType
    ) {
        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        if (comparing.params !== undefined && comparing.params.length > 0) {
            tmpParams = [...tmpParams, ...comparing.params];
        }

        if (
            lValue instanceof Object &&
            "params" in lValue &&
            lValue.params !== undefined &&
            lValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ...lValue.params];
        } else if (lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, lValue];
        }

        if (
            rValue instanceof Object &&
            "params" in rValue &&
            rValue.params !== undefined &&
            rValue.params.length > 0
        ) {
            tmpParams = [...tmpParams, ...rValue.params];
        } else if (lValue instanceof QueryParam) {
            tmpParams = [...tmpParams, lValue];
        }
        super(dbType, operation, tmpParams as TParams, undefined, asName, castType);

        this.comparing = comparing;
        this.lValue = lValue;
        this.rValue = rValue;
    }
}

export default BetweenColumnComparisonOperation;
