import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { CTEObjectEntry, MapResultToCTEObjectEntry } from "../cteObject.js";
import type CTEObject from "../cteObject.js";
import type { CTEType, ResultShape } from "../queryBuilder.js";
import type QueryBuilder from "../queryBuilder.js";

type MapToCTEObjectForRecursive<
    TDbType extends DbType,
    TCTEName extends string,
    TColumnNames extends (readonly string[]) | undefined,
    T extends QueryBuilder<TDbType, any, any, any, any, any, any, any>
> =
    TColumnNames extends undefined ?
    MapToCTEObject<TDbType, TCTEName, T> :
    TColumnNames extends readonly string[] ?
    TColumnNames["length"] extends 0 ?
    MapToCTEObject<TDbType, TCTEName, T> :
    T extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any, any> ?
    TRes extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[] ?
    CTEObject<TDbType, TCTEName, T, MapToColumnMatch<TDbType, TRes, TColumnNames>, undefined> :
    never :
    never :
    never;

type MapToColumnMatch<
    TDbType extends DbType,
    TColumns extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[],
    TColumnNames extends readonly string[]
> = {
        readonly [K in keyof TColumnNames]: K extends keyof TColumns ? TColumns[K] extends
        IQueryExpression<TDbType, any, infer TValueType, infer TFinalValueType, any, infer TAsName, infer TCastType> ?
        CTEObjectEntry<TDbType, TColumns[K], TValueType, TFinalValueType, TColumnNames[K], TAsName, TCastType> : never : never;
    };



type MapToCTEObject<TDbType extends DbType, TCTEName extends string, T> =
    T extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, any, any> ?
    CTEObject<TDbType, TCTEName, T, MapResultToCTEObjectEntry<TDbType, TRes>, undefined> : never
    ;



export type {
    MapToCTEObject,
    MapToCTEObjectForRecursive
}