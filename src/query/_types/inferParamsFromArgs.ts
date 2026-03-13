import type { DbValueTypes } from "../../table/column.js";
import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { ExtractParams } from "../param.js";

type InferParamsFromFnArgs<
    T extends (
        DbValueTypes | null |
        IComparable<any, any, any, any, any, any, any>
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
