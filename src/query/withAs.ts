import type { DbType } from "../db.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { MapToCTEObject, MapToCTEObjectForRecursive } from "./_types/cteUtility.js";
import CTEObject, { CTEObjectEntry } from "./cteObject.js";
import type QueryParam from "./param.js";
import type { CTEType, MapQueryResultForCombine, UNION_TYPE } from "./queryBuilder.js";
import QueryBuilder, { cteTypes } from "./queryBuilder.js";
import { extractParams } from "./utility.js";

function generateCTEFunctionForStandalone(cteType: CTEType) {

    function cteFn<
        TCTEName extends string,
        TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any, any>,
        TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
    >(as: TCTEName, qb: TQb) {
        type TCTEObject = MapToCTEObject<TDbType, TCTEName, TQb>;
        type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, any, infer TParams, any, any> ? TParams : never;

        const cteObject = new CTEObject(qb.dbType, qb, as, cteType) as TCTEObject;
        const cteSpecs = [cteObject] as const;

        let params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined = qb.params;
        if (params && params.length === 0) {
            params = undefined;
        }

        return new QueryBuilder<
            TDbType,
            undefined,
            undefined,
            typeof cteSpecs,
            undefined,
            undefined,
            TParams
        >(
            qb.dbType,
            undefined,
            undefined,
            undefined,
            {
                params: params as TParams,
                cteSpecs
            }
        );
    }

    return cteFn;
}

const withAs = generateCTEFunctionForStandalone(cteTypes.NON_RECURSIVE);
const withAsMaterialized = generateCTEFunctionForStandalone(cteTypes.MATERIALIZED);
const withAsNotMaterialized = generateCTEFunctionForStandalone(cteTypes.NOT_MATERIALIZED);

function withRecursiveAs<
    TCTEName extends string,
    const TColumnNames extends readonly string[],
    TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TRecursivePartResult extends QueryBuilder<
        TDbType,
        any,
        any,
        any,
        any,
        MapQueryResultForCombine<TAnchorQb extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never>,
        any,
        any,
        any
    >,
    TDbType extends DbType = TAnchorQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never,
    TFinalCTE extends CTEObject<TDbType, any, any, any, any> = MapToCTEObjectForRecursive<TDbType, TCTEName, TColumnNames, TAnchorQb>
>(
    cteName: TCTEName,
    columnNames: TColumnNames,
    anchorQb: TAnchorQb,
    unionType: UNION_TYPE,
    recursivePart: (self: TFinalCTE) => TRecursivePartResult

) {
    // Map anchorqb to cte object with name TCTEName and columns are TColumnsList if specified, else TAnchorQb columns
    // Pass the cte object to recursive part
    let cte: TFinalCTE;
    let finalCTEentries: CTEObjectEntry<TDbType, any, any, any, any, any, any>[] = [];
    if (columnNames.length === 0) {
        cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE) as TFinalCTE;
    } else {
        let selectResult = anchorQb.selectResult;
        if (selectResult === undefined) {
            throw Error("Column list must match the selected columns.");
        }

        if (selectResult.length !== columnNames.length) {
            throw Error("Column list must match the selected columns.");
        }

        for (let i = 0; i < columnNames.length; i++) {
            let currName = columnNames[i];
            let currExp = selectResult[i];

            finalCTEentries.push(new CTEObjectEntry(anchorQb.dbType, currExp, undefined, undefined, cteName, currName));
        }

        cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE, finalCTEentries) as TFinalCTE;
    }

    let recursiveQb = recursivePart(cte);

    let finalQb: QueryBuilder<TDbType, any, any, any, any, any, any, any, any>;
    if (unionType === "UNION") {
        finalQb = anchorQb.union(() => recursiveQb);
    } else {
        finalQb = anchorQb.unionAll(() => recursiveQb);
    }

    type TAnchorParams = TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, any, infer TParams, any, any> ? TParams : never;
    type TRecursiveParams = TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, any, infer TParams, any, any> ? TParams : never;
    type TParams = [...(TAnchorParams extends undefined ? [] : TAnchorParams), ...(TRecursiveParams extends undefined ? [] : TRecursiveParams)];
    type TParamsResult = TParams["length"] extends 0 ? undefined : TParams;

    const cteObject = new CTEObject(
        anchorQb.dbType,
        finalQb,
        cteName,
        cteTypes.RECURSIVE,
        finalCTEentries.length === 0 ? undefined : finalCTEentries, // Override entries from column list if specified
        undefined,
        finalCTEentries.length === 0 ? false : true
    ) as TFinalCTE;
    const cteSpecs = [cteObject] as const;

    let params = extractParams([finalQb]);

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        undefined,
        TParamsResult
    >(
        anchorQb.dbType,
        undefined,
        undefined,
        undefined,
        {
            params: params as TParamsResult,
            cteSpecs
        }
    );
}

export {
    withAs,
    withAsMaterialized,
    withAsNotMaterialized,
    withRecursiveAs,
}