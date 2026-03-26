import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import QueryParam from "../param.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import BaseQueryExpression from "../_baseClasses/BaseQueryExpression.js";
import { extractParams } from "../utility.js";

const sqlFunctions = {
    coalesce: { name: 'COALESCE' },
    round: { name: 'ROUND' },
    jsonBuildObject: { name: 'JSON_BUILD_OBJECT' }

} as const;

type SQLFunction = (typeof sqlFunctions)[keyof typeof sqlFunctions];

class ColumnSQLFunction<
    TDbType extends DbType,
    TSQLFunction extends SQLFunction,
    TArgs extends (
        DbValueTypes | null |
        IQueryExpression<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TReturnType>>,
    DetermineFinalValueType<TReturnType, DetermineValueType<TCastType, NonNullable<TReturnType>>>,
    undefined,
    TAs,
    TCastType
> {
    args: TArgs;
    sqlFunction: TSQLFunction;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.sqlFunction, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new ColumnSQLFunction<TDbType, TSQLFunction, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.sqlFunction, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const argsStrArr = convertArgsToQueryString(this.args, context);
        const argsStrRes = argsStrArr.join(', ');
        const queryRes = `${this.sqlFunction.name.toUpperCase()}(${argsStrRes})${this.asName ? ` AS "${this.asName}"` : ''}`;

        return { query: queryRes, params: context.params };
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        sqlFunction: TSQLFunction,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>(args);
        super(dbType, params, undefined, asName, castType);
        this.args = args;
        this.sqlFunction = sqlFunction;
    }
}

export default ColumnSQLFunction;

export {
    sqlFunctions
}

export type {
    SQLFunction
}