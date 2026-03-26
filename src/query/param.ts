import { dbTypes, type DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import type { IsAny } from "../utility/common.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";


type ExtractParams<T> =
    T extends QueryParam<any, any, any, any, any> ? [T] :
    T extends { params?: infer TParams extends QueryParam<any, any, any, any, any>[] | undefined } ? TParams extends undefined ? [] : TParams :
    [];

class QueryParam<
    TDbType extends DbType,
    TName extends string,
    TValueType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    undefined,
    DetermineValueType<TCastType, NonNullable<TValueType>>,
    DetermineFinalValueType<IsAny<TValueType> extends true ? DetermineValueType<TCastType, TValueType> | null : TValueType, DetermineValueType<TCastType, NonNullable<TValueType>>>,
    undefined,
    TAs,
    TCastType
> {
    name: TName;
    ownerName?: string;

    constructor(dbType: TDbType, name: TName, asName: TAs, castType: TCastType, ownerName?: string) {
        super(dbType, undefined, undefined, asName, castType);
        this.name = name;
        this.ownerName = ownerName;
    }

    as<TAs extends string>(asName: TAs) {
        return new QueryParam<TDbType, TName, TValueType, TAs, TCastType>(this.dbType, this.name, asName, this.castType, this.ownerName);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new QueryParam<TDbType, TName, TValueType, TAs, TCastType>(this.dbType, this.name, this.asName, type, this.ownerName);
    }

    setOwnerName(val: string): QueryParam<TDbType, TName, TValueType, TAs, TCastType> {
        return new QueryParam<TDbType, TName, TValueType, TAs, TCastType>(this.dbType, this.name, this.asName, this.castType, val);
    }

    type<TValueType extends DbValueTypes | null>() {
        return new QueryParam<TDbType, TName, TValueType, TAs, TCastType>(this.dbType, this.name, this.asName, this.castType, this.ownerName);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let paramIndex = context.params.indexOf(this.name);
        if (paramIndex < 0) {
            paramIndex = context.params.push(this.name) - 1;
        }

        return { query: `$${paramIndex + 1}`, params: context.params };
    }

}



/**
 * This causes infinite loop
 */
function generateParamFn<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TName extends string = string,
    >(
        name: TName
    ) => {
        return new QueryParam<TDbType, TName, any>(dbType, name, undefined, undefined);
    }
}

export default QueryParam;

export {
    generateParamFn
}

export type {
    ExtractParams
}