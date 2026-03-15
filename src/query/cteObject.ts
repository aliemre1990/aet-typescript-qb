import type { DbType } from "../db.js";
import type { DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { IName } from "./_interfaces/IName.js";
import type { MapToCTEObject, MapToCTEObjectForRecursive } from "./_types/cteUtility.js";
import between from "./comparisons/between.js";
import eq from "./comparisons/eq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import sqlIn from "./comparisons/in.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import notEq from "./comparisons/notEq.js";
import type QueryParam from "./param.js";
import type { CTEType, MapQueryResultForCombine, ResultShape, UNION_TYPE } from "./queryBuilder.js";
import QueryBuilder, { cteTypes } from "./queryBuilder.js";

type MapResultToCTEObjectEntry<TDbType extends DbType, TComparables extends ResultShape<TDbType>> =
    TComparables extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, any, any, any, any, any, any> ?
    Rest extends ResultShape<TDbType> ?
    [CTEObjectEntry<TDbType, First>, ...MapResultToCTEObjectEntry<TDbType, Rest>] :
    [CTEObjectEntry<TDbType, First>] :
    [] :
    []
    ;

class CTEObjectEntry<
    TDbType extends DbType,
    TComparable extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = TComparable extends IComparable<TDbType, any, infer TValType, any, any, any, any> ? TValType : never,
    TFinalValueType extends TValueType | null = TComparable extends IComparable<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never,
    TDefaultFieldKey extends string = TComparable extends IComparable<TDbType, any, any, any, infer TDefaultFieldKey, infer TAs, any> ? TAs extends undefined ? TDefaultFieldKey : TAs : never,
    TAsName extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    undefined,
    DetermineValueType<TCastType, TValueType>,
    DetermineFinalValueType<TFinalValueType, DetermineValueType<TCastType, TValueType>>,
    TDefaultFieldKey,
    TAsName,
    TCastType
> {
    dbType: TDbType;

    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, TValueType>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TFinalValueType, DetermineValueType<TCastType, TValueType>>;


    params?: undefined;
    asName?: TAsName;
    defaultFieldKey: TDefaultFieldKey;
    castType?: TCastType;

    comparable: TComparable;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    as<TAsName extends string>(val: TAsName) {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName, TCastType>(this.dbType, this.comparable, val, this.ownerName, this.defaultFieldKey, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName, TCastType>(this.dbType, this.comparable, this.asName, this.ownerName, this.defaultFieldKey, type);
    }

    ownerName?: string;
    setOwnerName(val: string) {
        return new CTEObjectEntry<TDbType, TComparable, TValueType, TFinalValueType, TDefaultFieldKey, TAsName, TCastType>(this.dbType, this.comparable, this.asName, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `"${this.ownerName}"."${this.asName || this.defaultFieldKey}"`, params: context.params };
    }

    constructor(
        dbType: TDbType,
        comparable: TComparable,
        asName?: TAsName,
        ownerName?: string,
        defaultFieldKey?: TDefaultFieldKey,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.comparable = comparable;
        this.asName = asName;
        this.ownerName = ownerName;
        this.castType = castType;

        this.defaultFieldKey = defaultFieldKey || (comparable.asName === undefined ? comparable.defaultFieldKey : comparable.asName);
    }
}

class CTEObject<
    TDbType extends DbType,
    TCTEName extends string,
    TCTEType extends CTEType,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, any, any>,
    TEntries extends readonly CTEObjectEntry<TDbType, any, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any, any> ? TRes extends ResultShape<TDbType> ? MapResultToCTEObjectEntry<TDbType, TRes> : never : never,
    TAs extends string | undefined = undefined
> implements IName<TAs extends undefined ? TCTEName : TAs> {
    dbType: TDbType;

    qb: TQb;

    asName?: TAs;
    name: TAs extends undefined ? TCTEName : TAs;
    cteName: TCTEName;
    isColumnListPresent?: boolean;

    cteType: TCTEType;
    cteObjectEntries: TEntries;

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = this.qb.buildSQL(context);
        return { query: query.query, params: [...(query.params)] };
    }

    constructor(
        dbType: TDbType,
        qb: TQb,
        cteName: TCTEName,
        cteType: TCTEType,
        entries?: TEntries,
        asName?: TAs,
        isColumnListPresent?: boolean
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.cteName = cteName;
        this.name = (asName || cteName) as TAs extends undefined ? TCTEName : TAs;
        this.asName = asName;
        this.cteType = cteType;
        this.isColumnListPresent = isColumnListPresent;

        if (entries !== undefined) {
            this.cteObjectEntries = entries;
        } else {
            let tmpEntries: readonly CTEObjectEntry<TDbType, any, any, any, any, any, any>[] = [];
            if (qb.selectResult !== undefined) {
                qb.selectResult.forEach(res => {
                    tmpEntries = [...tmpEntries, (new CTEObjectEntry(dbType, res, undefined, this.cteName))];
                })
            }

            this.cteObjectEntries = tmpEntries as TEntries;
        }
    }

    as<TAs extends string>(val: TAs) {
        const newEntries = this.cteObjectEntries
            .map(ent => new CTEObjectEntry(ent.dbType, ent.comparable, ent.asName, val, ent.defaultFieldKey)) as readonly CTEObjectEntry<TDbType, any, any, any, any, any>[] as TEntries;

        return new CTEObject<TDbType, TCTEName, TCTEType, TQb, TEntries, TAs>(this.dbType, this.qb, this.cteName, this.cteType, newEntries, val);
    }
}


function withAs<
    TCTEName extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(as: TCTEName, qb: TQb) {
    type TCTEObject = MapToCTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>;
    type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never;

    const cteObject = new CTEObject(qb.dbType, qb, as, cteTypes.NON_RECURSIVE) as TCTEObject;
    const cteSpecs = [cteObject] as const;

    let params: readonly QueryParam<TDbType, any, any, any, any, any>[] | undefined = qb.params;
    if (params && params.length === 0) {
        params = undefined;
    }

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        TParams
    >(
        qb.dbType,
        undefined,
        {
            params: params as TParams,
            cteSpecs
        }
    );
}

function withRecursiveAs<
    TCTEName extends string,
    const TColumnNames extends readonly string[],
    TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TRecursivePartResult extends QueryBuilder<
        TDbType,
        any,
        any,
        any,
        MapQueryResultForCombine<TAnchorQb extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never>,
        any,
        any,
        any
    >,
    TDbType extends DbType = TAnchorQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never,
    TFinalCTE extends CTEObject<TDbType, any, any, any, any, any> = MapToCTEObjectForRecursive<TDbType, TCTEName, typeof cteTypes.RECURSIVE, TColumnNames, TAnchorQb>
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
            let currComp = selectResult[i];

            finalCTEentries.push(new CTEObjectEntry(anchorQb.dbType, currComp, undefined, cteName, currName));
        }

        cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE, finalCTEentries) as TFinalCTE;
    }

    let recursiveQb = recursivePart(cte);

    let finalQb: QueryBuilder<TDbType, any, any, any, any, any, any, any>;
    if (unionType === "UNION") {
        finalQb = anchorQb.union(() => recursiveQb);
    } else {
        finalQb = anchorQb.unionAll(() => recursiveQb);
    }

    type TAnchorParams = TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never;
    type TRecursiveParams = TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any, any> ? TParams : never;
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

    let params: readonly QueryParam<TDbType, any, any, any, any, any>[] | undefined = finalQb.params;
    if (params && params.length === 0) {
        params = undefined;
    }


    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        TParamsResult
    >(
        anchorQb.dbType,
        undefined,
        {
            params: params as TParamsResult,
            cteSpecs
        }
    );
}


export default CTEObject;

export {
    CTEObjectEntry,
    withAs,
    withRecursiveAs
}

export type {
    MapResultToCTEObjectEntry
}