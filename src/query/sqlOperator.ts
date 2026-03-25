import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsExact, UndefinedIfLengthZero } from "../utility/common.js";
import type BaseColumnComparisonOperation from "./_baseClasses/BaseColumnComparisonOperation.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import {
    queryBuilderContextFactory,
    type DetermineFinalValueType,
    type DetermineValueType,
    type IComparable,
    type QueryBuilderContext
} from "./_interfaces/IComparable.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { ExtractParams } from "./param.js";
import QueryParam from "./param.js";
import { convertValueToQueryString } from "./uitlity/common.js";

type CalculateSQLParams<
    TValues extends readonly (IComparable<any, any, any, any, any, any, any> | BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any> | DbValueTypes | null)[],
> = TValues extends readonly [infer First, ...infer Rest] ?
    Rest extends readonly [any, ...any[]] ?
    [...ExtractParams<First>, ...CalculateSQLParams<Rest>] :
    ExtractParams<First> :
    [];


class SQLOperator<
    TDbType extends DbType,
    TValues extends readonly (IComparable<TDbType, any, any, any, any, any, any> | BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any> | DbValueTypes | null)[],
    TValueType extends DbValueTypes | null = any,
    TFieldName extends string | undefined = undefined,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<CalculateSQLParams<TValues>>
> extends BaseQueryExpression<
    TDbType,
    TParams,
    IsExact<TValueType, null> extends true ? null : DetermineValueType<TCastType, NonNullable<TValueType>>,
    DetermineFinalValueType<TValueType, DetermineValueType<TCastType, TValueType>>,
    TFieldName,
    TAs,
    TCastType

> {
    strs: TemplateStringsArray;
    values: TValues;

    constructor(dbType: TDbType, strs: TemplateStringsArray, values: TValues, asName: TAs, castType: TCastType) {
        let tmpParams: readonly QueryParam<TDbType, any, any, any, any>[] = [];
        for (let value of values) {
            if (value instanceof QueryParam) {
                tmpParams = [...tmpParams, value];
            }
            else if (value !== null && typeof value === 'object' && "params" in value && value.params && value.params.length > 0) {
                tmpParams = [...tmpParams, ...value.params];
            }
        }
        super(dbType, tmpParams as TParams, 'Any Value' as TFieldName, asName, castType);
        this.strs = strs;
        this.values = values;
    }

    as<TAs extends string>(asName: TAs) {
        return new SQLOperator<TDbType, TValues, TValueType, TFieldName, TAs, TCastType, TParams>(this.dbType, this.strs, this.values, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new SQLOperator<TDbType, TValues, TValueType, TFieldName, TAs, TCastType, TParams>(this.dbType, this.strs, this.values, this.asName, type);
    }
    specs<TValueType extends DbValueTypes | null, TFieldName extends string = ''>() {
        return new SQLOperator<TDbType, TValues, TValueType, TFieldName, TAs, TCastType, TParams>(this.dbType, this.strs, this.values, this.asName, this.castType);
    }

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] } {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = '';

        for (let i = 0; i < this.strs.length; i++) {
            const val = this.values[i];
            const str = this.strs[i];

            if (i === this.strs.length - 1) {
                query = `${query}${str}`;
                break;
            }

            if (val !== null && typeof val === 'object' && 'buildSQL' in val) {
                const built = val.buildSQL(context);
                query = `${query}${str}${built.query}`;
            } else {
                const arg = convertValueToQueryString(this.values[i]);
                query = `${query}${str}${arg}`;
            }
        };

        if (this.asName) {
            query = `${query} AS "${this.asName}"`;
        }

        return { query, params: context.params };
    }
}


function generateSqlOperatorFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return function <
        TValues extends readonly (IComparable<TDbType, any, any, any, any, any, any> | BaseColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any> | DbValueTypes | null)[]
    >(strs: TemplateStringsArray, ...values: TValues): SQLOperator<TDbType, TValues> {
        return new SQLOperator(dbType, strs, values, undefined, undefined);
    }
}

export default SQLOperator;

export {
    generateSqlOperatorFn
}