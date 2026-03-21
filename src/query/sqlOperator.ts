import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsExact, UndefinedIfLengthZero } from "../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { ExtractParams } from "./param.js";
import type QueryParam from "./param.js";
import { convertValueToQueryString } from "./uitlity/common.js";

type CalculateSQLParams<
    TValues extends readonly (IComparable<any, any, any, any, any, any, any> | ColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any> | DbValueTypes | null)[],
> = TValues extends readonly [infer First, ...infer Rest] ?
    Rest extends readonly [any, ...any[]] ?
    [...ExtractParams<First>, ...CalculateSQLParams<Rest>] :
    ExtractParams<First> :
    [];


class SQLOperator<
    TDbType extends DbType,
    TValues extends readonly (IComparable<TDbType, any, any, any, any, any, any> | ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any> | DbValueTypes | null)[],
    TValueType extends DbValueTypes | null = any,
    TFieldName extends string | undefined = undefined,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<CalculateSQLParams<TValues>>
> implements IComparable<
    TDbType,
    TParams,
    IsExact<TValueType, null> extends true ? null : DetermineValueType<TCastType, NonNullable<TValueType>>,
    DetermineFinalValueType<TValueType, DetermineValueType<TCastType, TValueType>>,
    TFieldName,
    TAs,
    TCastType

> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: IsExact<TValueType, null> extends true ? null : DetermineValueType<TCastType, NonNullable<TValueType>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TValueType, DetermineValueType<TCastType, TValueType>>;
    params?: TParams;
    fieldName: TFieldName;
    asName: TAs;
    castType?: TCastType;

    strs: TemplateStringsArray;
    values: TValues;


    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;



    constructor(dbType: TDbType, strs: TemplateStringsArray, values: TValues, asName: TAs, castType?: TCastType) {
        this.dbType = dbType;
        this.asName = asName;
        this.castType = castType;

        this.strs = strs;
        this.values = values;

        this.fieldName = 'Any Value' as TFieldName;
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
        TValues extends readonly (IComparable<TDbType, any, any, any, any, any, any> | ColumnComparisonOperation<TDbType, any, any, any, any, any, any> | ColumnLogicalOperation<TDbType, any, any, any, any> | DbValueTypes | null)[]
    >(strs: TemplateStringsArray, ...values: TValues): SQLOperator<TDbType, TValues> {
        return new SQLOperator(dbType, strs, values, undefined);
    }
}

export default SQLOperator;

export {
    generateSqlOperatorFn
}