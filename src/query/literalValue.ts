import type { DbType } from "../db.js";
import type { DbValueTypes, GetColumnTypes } from "../table/column.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import {
    IQueryExpressionFinalValueDummySymbol,
    IQueryExpressionValueDummySymbol,
    queryBuilderContextFactory,
    type DetermineFinalValueType,
    type DetermineValueType,
    type QueryBuilderContext
} from "./_interfaces/IQueryExpression.js";
import { convertValueToQueryString } from "./utility/common.js";

class LiteralValue<
    TDbType extends DbType,
    TValue extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    undefined,
    DetermineValueType<TDbType, TCastType, TValue>,
    DetermineFinalValueType<TValue, DetermineValueType<TDbType, TCastType, TValue>>,
    undefined,
    TAs,
    TCastType
> {
    value: TValue;

    as<TAs extends string>(asName: TAs) {
        return new LiteralValue<TDbType, TValue, TAs, TCastType>(this.dbType, this.value, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new LiteralValue<TDbType, TValue, TAs, TCastType>(this.dbType, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext): { query: string; params: string[]; } {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = convertValueToQueryString(this.value);
        query = this.asName ? `${query} AS "${this.asName}"` : query;

        return { query, params: context.params };
    }

    constructor(dbType: TDbType, value: TValue, asName: TAs, castType: TCastType) {
        super(dbType, undefined, undefined, asName, castType);
        this.value = value;
    }
}


/**
 * This causes infinite loop
 */
function generateLiteralValueFn<TDbType extends DbType>(dbType: TDbType) {
    return <const TValue extends DbValueTypes | null>(
        value: TValue
    ) => {
        return new LiteralValue<TDbType, TValue>(dbType, value, undefined, undefined);
    }
}


export default LiteralValue;

export {
    generateLiteralValueFn
}