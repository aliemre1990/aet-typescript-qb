import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import type { MapResultToCTEObjectEntry } from "../cteObject.js";
import type CTEObject from "../cteObject.js";
import type { CTEType, ResultShape } from "../queryBuilder.js";
import type QueryBuilder from "../queryBuilder.js";

type MapToCTEObjectForRecursive<
    TDbType extends DbType,
    TCTEName extends string,
    TCTEType extends CTEType,
    TColumnNames extends (readonly string[]) | undefined,
    T extends QueryBuilder<TDbType, any, any, any, any, any, any, any>
> =
    TColumnNames extends undefined ?
    MapToCTEObject<TDbType, TCTEName, TCTEType, T> :
    TColumnNames extends readonly string[] ?
    TColumnNames["length"] extends 0 ?
    MapToCTEObject<TDbType, TCTEName, TCTEType, T> :
    T extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any, any> ?
    TRes extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[] ?
    CTEObject<TDbType, TCTEName, TCTEType, T, MapToColumnMatch<TDbType, TRes, TColumnNames>, undefined> :
    never :
    never :
    never;

type MapToColumnMatch<
    TDbType extends DbType,
    TColumns extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[],
    TColumnNames extends readonly string[]
> =
    TColumnNames extends readonly [infer TFirstName, ...infer TRestNames] ?
    TColumns extends readonly [infer TFirstCol, ...infer TRestCols] ?
    TFirstName extends string ?
    TFirstCol extends IQueryExpression<TDbType, any, infer TValueType, infer TFinalValueType, any, any, any> ?
    TRestNames extends readonly [string, ...string[]] ?
    TRestCols extends readonly [any, ...any[]] ?
    [IQueryExpression<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined, undefined>, ...MapToColumnMatch<TDbType, TRestCols, TRestNames>] :
    [IQueryExpression<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined, undefined>] :
    [IQueryExpression<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined, undefined>] :
    never :
    never :
    [] :
    []
    ;



type MapToCTEObject<TDbType extends DbType, TCTEName extends string, TCTEType extends CTEType, T> =
    T extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, any, any> ?
    CTEObject<TDbType, TCTEName, TCTEType, T, MapResultToCTEObjectEntry<TDbType, TRes>, undefined> : never
    ;



export type {
    MapToCTEObject,
    MapToCTEObjectForRecursive
}