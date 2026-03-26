import type { UndefinedIfLengthZero } from "../../utility/common.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { ExtractParams } from "../param.js";
import type QueryParam from "../param.js";

type AccumulateColumnParams<TParams extends readonly QueryParam<any, any, any, any, any>[] | undefined, TResult extends readonly any[]> =
    TParams extends undefined ?
    InferParamsFromColumns<TResult> :
    TParams extends QueryParam<any, any, any, any, any>[] ? [...TParams, ...InferParamsFromColumns<TResult>] :
    never;


type InferParamsFromColumns<TResult extends readonly any[]> =
    TResult extends readonly [infer First, ...infer Rest] ?
    Rest extends readonly [any, ...any[]] ?
    [...ExtractParams<First>, ...InferParamsFromColumns<Rest>] :
    ExtractParams<First> :
    [];

export type {
    AccumulateColumnParams
}