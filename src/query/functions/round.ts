import type { DbType } from "../../db.js";
import type { IsAny } from "../../utility/common.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

type ExtractArgType<T> = T extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : T;

type DetermineReturnType<TFirstArg, TSecondArg> =
    [TFirstArg] extends [null] ? null :
    [TSecondArg] extends [null] ? null :
    null extends TFirstArg ? number | null :
    null extends TSecondArg ? number | null :
    number;

type ExtractAndDetermineRerturnType<TFirstArg, TSecondArg> = DetermineReturnType<ExtractArgType<TFirstArg>, ExtractArgType<TSecondArg>>;


function generateRoundFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TFirstArg extends QueryParam<TDbType, any, any, any, any> | IQueryExpression<TDbType, any, number | null, any, any, any, any> | number | null,
        TSecondArg extends QueryParam<TDbType, any, any, any, any> | IQueryExpression<TDbType, any, number | null, any, any, any, any> | number | null,

    >(firstArg: TFirstArg, secondArg: TSecondArg) => {

        type TFirstArgFormatted = TFirstArg extends QueryParam<TDbType, infer TParamName, infer TValueType, infer TAs, infer TCastType> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number, TAs, TCastType> : QueryParam<TDbType, TParamName, TValueType, TAs, TCastType> :
            TFirstArg;

        type TSecondArgFormatted = TSecondArg extends QueryParam<TDbType, infer TParamName, infer TValueType, infer TAs, infer TCastType> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number, TAs, TCastType> : QueryParam<TDbType, TParamName, TValueType, TAs, TCastType> :
            TSecondArg;

        let firstArgValue: TFirstArg = firstArg;
        let secondArgValue: TSecondArg = secondArg;

        return new ColumnSQLFunction<
            TDbType,
            [TFirstArgFormatted, TSecondArgFormatted],
            ExtractAndDetermineRerturnType<TFirstArgFormatted, TSecondArgFormatted>
        >(dbType, [firstArgValue as TFirstArgFormatted, secondArgValue as TSecondArgFormatted], sqlFunctions.round, undefined, undefined);

    }
}

export default generateRoundFn;