import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { IsContainsNull } from "../_types/args.js";
import SQLArithmeticOperation, { arithmeticOperations } from "./_arithmeticOperations.js";

function generateArithmeticSubtraction<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TArgs extends (DbValueTypes | null | IQueryExpression<TDbType, any, number, any, any, any, any>)[]
    >
        (...args: TArgs) => {

        return new SQLArithmeticOperation<
            TDbType,
            TArgs,
            IsContainsNull<TDbType, TArgs> extends true ? number | null : number
        >(dbType, args, arithmeticOperations.subtraction, undefined, undefined);
    }
}

export {
    generateArithmeticSubtraction
}