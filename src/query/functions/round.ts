import type { DbType } from "../../db.js";
import type { IsAny } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

/**
 * Used to drop argument to never if non number type of argument is provided.
 */
type IsArgAnyOrNumber<TDbType extends DbType, TFirstArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, number, any, any, any, any> | number | null> =
    TFirstArg extends QueryParam<TDbType, string, infer TValueType, any, any> ? IsAny<TValueType> extends true ? {} :
    number extends TValueType ? {} : never :
    {}
    ;

type DetermineReturnType<TFirstArg, TSecondArg> =
    [TFirstArg, TSecondArg] extends [null, any] | [any, null] | [null, null] ? number | null :
    TFirstArg extends IComparable<any, any, any, infer TFinalType, any, any, any> ? number | null extends TFinalType ? number | null :
    TSecondArg extends IComparable<any, any, any, infer TFinalType, any, any, any> ? number | null extends TFinalType ? number | null :
    number :
    number :
    number


function generateRoundFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TFirstArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, number, any, any, any, any> | number | null,
        TSecondArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, number, any, any, any, any> | number | null,

    >(firstArg: TFirstArg & (IsArgAnyOrNumber<TDbType, TFirstArg>), secondArg: TSecondArg & (IsArgAnyOrNumber<TDbType, TSecondArg>)) => {

        type TFirstArgFormatted = TFirstArg extends QueryParam<TDbType, infer TParamName, infer TValueType, infer TAs, infer TCastType> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number | null, TAs, TCastType> : QueryParam<TDbType, TParamName, TValueType, TAs, TCastType> :
            TFirstArg;

        type TSecondArgFormatted = TSecondArg extends QueryParam<TDbType, infer TParamName, infer TValueType, infer TAs, infer TCastType> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number | null, TAs, TCastType> : QueryParam<TDbType, TParamName, TValueType, TAs, TCastType> :
            TSecondArg;

        let firstArgValue: TFirstArg = firstArg;
        let secondArgValue: TSecondArg = secondArg;

        return new ColumnSQLFunction<
            TDbType,
            typeof sqlFunctions.round,
            [TFirstArgFormatted, TSecondArgFormatted],
            DetermineReturnType<TFirstArgFormatted, TSecondArgFormatted>
        >(dbType, [firstArgValue as TFirstArgFormatted, secondArgValue as TSecondArgFormatted], sqlFunctions.round, undefined, undefined);

    }
}

export default generateRoundFn;