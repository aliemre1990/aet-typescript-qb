import type { DbValueTypes } from "../../table/column.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { ExtractParams } from "../param.js";

type InferParamsFromFnArgs<
    T extends (
        DbValueTypes | null |
        IQueryExpression<any, any, any, any, any, any, any>
    )[]
> = InferParamsFromFnArgArray<T>;

type InferParamsFromFnArgArray<T> =
    T extends readonly [infer FirstArg, ...infer RestArgs] ?
    RestArgs extends readonly [any, ...any[]] ?
    [...ExtractParams<FirstArg>, ...InferParamsFromFnArgArray<RestArgs>] :
    [...ExtractParams<FirstArg>] :
    [];

export type {
    InferParamsFromFnArgs
}
