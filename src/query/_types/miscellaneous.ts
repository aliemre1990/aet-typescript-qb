import type { DbType } from "../../db.js";
import type ColumnsSelection from "../ColumnsSelection.js";
import type CTEObject from "../cteObject.js";
import type { CTESpecsType, DMLSpecType, FromItemType, FromType, JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";

type MapCtesToSelectionType<TDbType extends DbType, TCTESpecs extends CTESpecsType<TDbType> | undefined> =
    TCTESpecs extends undefined ? {} :
    TCTESpecs extends readonly CTEObject<TDbType, any, any, any, any>[] ?
    {
        [C in TCTESpecs[number]as C extends { name: infer N extends string } ? N : never]: C
    } :
    never;

type TableToColumnsMap<
    TDbType extends DbType,
    T extends { [key: string]: FromItemType<TDbType> }
> = {
        [K in keyof T]: ColumnsSelection<
            TDbType,
            T[K],
            T[K]["columnsList"] extends undefined ? never : T[K]["columnsList"]
        >
    };

type TablesToObject<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TInnerJoinSpecs extends JoinSpecsType<TDbType> | undefined = undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined = undefined,
    TDMLSpec extends DMLSpecType<TDbType> | undefined = undefined
> =
    (
        TFrom extends undefined ? {} :
        TFrom extends FromType<TDbType> ? { [T in TFrom[number]as T["name"]]: T } : {}
    ) &
    (
        TInnerJoinSpecs extends undefined ? {} :
        TInnerJoinSpecs extends JoinSpecsType<TDbType> ?
        {
            [T in TInnerJoinSpecs[number]as T["table"]["name"]]: T["table"]
        }
        : never
    ) &
    (
        TCTESpecs extends undefined ? {} :
        TCTESpecs extends CTESpecsType<TDbType> ?
        {
            [
            T in TCTESpecs[number]as T["name"]
            ]: T
        }
        : never
    ) &
    (
        TDMLSpec extends undefined ? {} :
        TDMLSpec extends DMLSpecType<TDbType> ? {
            [T in TDMLSpec["table"]["name"]]: TDMLSpec["table"]
        } :
        never
    );

export type {
    TableToColumnsMap,
    TablesToObject,
    MapCtesToSelectionType
}