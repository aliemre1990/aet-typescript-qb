import type { DbType } from "../db.js";
import type { MapCtesToSelectionType } from "./_types/miscellaneous.js";
import type CTEObject from "./cteObject.js";
import QueryParam from "./param.js";
import type { CTESpecsType } from "./queryBuilder.js";

function mapCTESpecsToSelection<TDbType extends DbType, TCTESpecs extends CTESpecsType<TDbType>>(cteSpecs: TCTESpecs) {
    const res = cteSpecs.reduce((prev, curr) => {
        prev[curr.name] = curr;
        return prev;
    }, {} as { [key: string]: CTEObject<any, any, any, any, any, any> }) as MapCtesToSelectionType<TDbType, TCTESpecs>;

    return res;
}

function extractParams<TReturn extends readonly QueryParam<any, any, any, any, any>[] | undefined>(args: readonly any[]): TReturn {
    let params: readonly QueryParam<any, any, any, any, any>[] | undefined = [];

    for (const arg of args) {
        if (arg instanceof QueryParam) {
            params = [...params, arg];
        }
        if (arg !== null && typeof arg === "object" && "params" in arg && arg.params !== undefined && arg.params.length > 0) {
            params = [...params, ...arg.params];
        }
    }
    if (params.length === 0) {
        params = undefined;
    }

    return params as TReturn;
}

export {
    mapCTESpecsToSelection,
    extractParams
}
