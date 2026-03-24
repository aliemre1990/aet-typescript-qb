import { type DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import type QueryParam from "../param.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import BaseQueryExpression from "../_baseClasses/BaseQueryExpression.js";


const arithmeticOperations = {
    addition: {
        name: 'ADDITION',
        symbol: "+"
    },
    subtraction: {
        name: 'SUBTRACTION',
        symbol: "-"
    },
    multiplication: {
        name: 'MULTIPLICATION',
        symbol: "*"
    },
    divison: {
        name: 'DIVISION',
        symbol: "/"
    },
    modulo: {
        name: 'MODULO',
        symbol: "%"
    },
    exponentiation: {
        name: 'EXPONENTIATION',
        symbol: "^"
    }
} as const;


type ArithmeticOperation = typeof arithmeticOperations[keyof typeof arithmeticOperations];

class SQLArithmeticOperation<
    TDbType extends DbType,
    TArithmeticOperation extends ArithmeticOperation,
    TArgs extends (
        DbValueTypes | null |
        IComparable<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
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
    operation: TArithmeticOperation;

    as<TAs extends string>(asName: TAs) {
        return new SQLArithmeticOperation<TDbType, TArithmeticOperation, TArgs, TReturnType, TAs, TParams, TCastType>(this.dbType, this.args, this.operation, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new SQLArithmeticOperation<TDbType, TArithmeticOperation, TArgs, TReturnType, TAs, TParams, TCastType>(this.dbType, this.args, this.operation, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }


        let previousIsTopLevelVal = context.isTopLevel;
        context.isTopLevel = false;
        const argsStrArr = convertArgsToQueryString(this.args, context);
        let queryRes = argsStrArr.join(`${this.operation.symbol}`);
        context.isTopLevel = previousIsTopLevelVal;

        queryRes = context.isTopLevel === false ? `(${queryRes})` : queryRes;
        queryRes = this.asName ? `${queryRes} AS "${this.asName}"` : queryRes;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        args: TArgs,
        operation: TArithmeticOperation,
        asName: TAs,
        castType: TCastType
    ) {
        super(dbType, undefined as TParams, undefined, asName, castType);
        this.args = args;
        this.operation = operation;
    }
}

export default SQLArithmeticOperation;

export {
    arithmeticOperations
}

export type {
    ArithmeticOperation
}