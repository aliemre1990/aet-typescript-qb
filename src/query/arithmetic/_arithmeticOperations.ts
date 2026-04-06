import { type DbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import { queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import type { InferParamsFromFnArgs } from "../_types/inferParamsFromArgs.js";
import QueryParam from "../param.js";
import { convertArgsToQueryString } from "../utility/common.js";
import BaseQueryExpression from "../_baseClasses/BaseQueryExpression.js";
import { extractParams } from "../utility.js";
import type { IsContainsNull, IsContainsNullable } from "../_types/args.js";


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
    TArgs extends (
        DbValueTypes | null |
        IQueryExpression<TDbType, any, any, any, any, any, any>
    )[],
    TReturnType extends DbValueTypes | null,
    TAs extends string | undefined = undefined,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromFnArgs<TArgs>,
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
    operation: ArithmeticOperation;

    as<TAs extends string>(asName: TAs) {
        return new SQLArithmeticOperation<TDbType, TArgs, TReturnType, TAs, TParams, TCastType>(this.dbType, this.args, this.operation, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new SQLArithmeticOperation<TDbType, TArgs, TReturnType, TAs, TParams, TCastType>(this.dbType, this.args, this.operation, this.asName, type);
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
        operation: ArithmeticOperation,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>(args);
        super(dbType, params, undefined, asName, castType);
        this.args = args;
        this.operation = operation;
    }
}

function generateArithmeticOperationFn<TDbType extends DbType>(
    dbType: TDbType,
    operation: ArithmeticOperation
) {
    return <
        TArgs extends (DbValueTypes | null | IQueryExpression<TDbType, any, number, any, any, any, any>)[]
    >
        (...args: TArgs) => {

        return new SQLArithmeticOperation<
            TDbType,
            TArgs,
            IsContainsNull<TDbType, TArgs> extends true ? null : IsContainsNullable<TDbType, TArgs> extends true ? number | null : number
        >(dbType, args, operation, undefined, undefined);
    }
}

export default SQLArithmeticOperation;

export {
    arithmeticOperations,
    generateArithmeticOperationFn
}

export type {
    ArithmeticOperation
}