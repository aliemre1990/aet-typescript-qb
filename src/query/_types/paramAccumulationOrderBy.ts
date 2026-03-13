import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { ExtractParams } from "../param.js";
import type QueryParam from "../param.js";
import type { OrderBySpecsType, OrderType } from "../queryBuilder.js";

type AccumulateOrderByParams<
    TDbType extends DbType,
    TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined,
    TOrderByParams extends OrderBySpecsType<TDbType>
> =
    TParams extends undefined ?
    InferParamsFromOrderByParams<TDbType, TOrderByParams>["length"] extends 0 ? undefined : InferParamsFromOrderByParams<TDbType, TOrderByParams> :
    TParams extends QueryParam<any, any, any, any, any, any>[] ? [...TParams, ...InferParamsFromOrderByParams<TDbType, TOrderByParams>] :
    never;

type InferParamsFromOrderByParams<TDbType extends DbType, TOrderByParams extends OrderBySpecsType<TDbType>> =
    TOrderByParams extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any, any> ?
    Rest extends OrderBySpecsType<TDbType> ?
    [...(ExtractParams<First>), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(ExtractParams<First>)] :
    First extends [infer TComp extends IComparable<TDbType, any, any, any, any, any, any>, OrderType] ? Rest extends OrderBySpecsType<TDbType> ?
    [...(ExtractParams<TComp>), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(ExtractParams<TComp>)] :
    [] :
    [];

export type {
    AccumulateOrderByParams
}