import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { type InComparisonOperationType, type InferComparisonParams, type InferValueTypeFromComparable } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";

class InColumnComparisonOperation<
    TDbType extends DbType,
    TOperation extends InComparisonOperationType,
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TApplied extends readonly (TValueType | null | IComparable<TDbType, any, any, any, any, any, any>)[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromComparable<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, TApplied>>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
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
    value: TApplied;

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
        castType: TCastType
    ) {
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
        super(dbType, operation, tmpParams as TParams, undefined, asName, castType);

        this.comparing = comparing;
        this.value = value;
    }
}

export default InColumnComparisonOperation;