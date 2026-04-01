import type { DbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import QueryParam from "../param.js";
import { convertArgsToQueryString } from "../utility/common.js";
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
    TArgs extends (
        DbValueTypes | null |
        IQueryExpression<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TDbType, TCastType, NonNullable<TReturnType>>,
    DetermineFinalValueType<TReturnType, DetermineValueType<TDbType, TCastType, NonNullable<TReturnType>>>,
    undefined,
    TAs,
    TCastType
> {
    args: TArgs;
    sqlFunction: SQLFunction;

    as<TAs extends string>(asName: TAs) {
        return new ColumnSQLFunction<TDbType, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.sqlFunction, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new ColumnSQLFunction<TDbType, TArgs, TReturnType, TParams, TAs, TCastType>(this.dbType, this.args, this.sqlFunction, this.asName, type);
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
        sqlFunction: SQLFunction,
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