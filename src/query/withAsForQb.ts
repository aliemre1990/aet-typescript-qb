import type { DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { MapCtesToSelectionType } from "./_types/miscellaneous.js";
import CTEObject from "./cteObject.js";
import type { ExtractParams } from "./param.js";
import type QueryParam from "./param.js";
import type { CTESpecsType, CTEType, DMLSpecType, FromType, JoinSpecsType, ResultShape } from "./queryBuilder.js";
import QueryBuilder, { cteTypes } from "./queryBuilder.js";
import { extractParams, mapCTESpecsToSelection } from "./utility.js";

type MapToResultQueryBuilder<
    TQb extends QueryBuilder<any, any, any, any, any, any, any, any>,
    TFinalCTESpecs extends CTESpecsType<any>,
    TParamsAccumulated extends readonly QueryParam<any, any, any, any, any>[] | undefined
> =
    TQb extends QueryBuilder<infer TDbType, infer TFrom, infer TJoinSpecs, any, infer TResultShape, any, infer TAs, infer TCastType> ?
    QueryBuilder<TDbType, TFrom, TJoinSpecs, TFinalCTESpecs, TResultShape, TParamsAccumulated, TAs, TCastType> : never;


function generateCTEFunctionForQb(cteType: CTEType) {

    function cteFn<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TCTEName extends string,
        TQb extends QueryBuilder<TThisDbType, any, any, any, any, any, any, any>,

        TThisDbType extends DbType = TThis extends QueryBuilder<infer TDbType, any, any, any, any, any, any, any> ? TDbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = TThis extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never,

        TCTEObject extends CTEObject<TThisDbType, any, any, any, any> = CTEObject<TThisDbType, TCTEName, TQb>,
        TFinalCTESpec extends readonly CTEObject<TThisDbType, any, any, any, any>[] = readonly [...(TThisCTESpecs extends CTESpecsType<TThisDbType> ? TThisCTESpecs : []), TCTEObject],
        TCTEParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = ExtractParams<TQb>,
        TParamsAccumulated extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TThisParams extends readonly QueryParam<any, any, any, any, any>[] ? TThisParams : []),
                ...(TCTEParams extends readonly QueryParam<any, any, any, any, any>[] ? TCTEParams : [])
            ]>
    >(
        this: TThis,
        as: TCTEName,
        qb: TQb
    ): MapToResultQueryBuilder<TQb, TFinalCTESpec, TParamsAccumulated>
    function cteFn<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TCTEName extends string,
        TQb extends QueryBuilder<TThisDbType, any, any, any, any, any, any, any>,

        TThisDbType extends DbType = TThis extends QueryBuilder<infer TDbType, any, any, any, any, any, any, any> ? TDbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = TThis extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never,

        TCTEObject extends CTEObject<TThisDbType, any, any, any, any> = CTEObject<TThisDbType, TCTEName, TQb>,
        TFinalCTESpec extends readonly CTEObject<TThisDbType, any, any, any, any>[] = readonly [...(TThisCTESpecs extends CTESpecsType<TThisDbType> ? TThisCTESpecs : []), TCTEObject],
        TCTEParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = ExtractParams<TQb>,
        TParamsAccumulated extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TThisParams extends readonly QueryParam<any, any, any, any, any>[] ? TThisParams : []),
                ...(TCTEParams extends readonly QueryParam<any, any, any, any, any>[] ? TCTEParams : [])
            ]>
    >(
        this: TThis,
        as: TCTEName,
        qb: (ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQb
    ): MapToResultQueryBuilder<TQb, TFinalCTESpec, TParamsAccumulated>
    function cteFn<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TCTEName extends string,
        TQb extends QueryBuilder<TThisDbType, any, any, any, any, any, any, any>,

        TThisDbType extends DbType = TThis extends QueryBuilder<infer TDbType, any, any, any, any, any, any, any> ? TDbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
    >(
        this: TThis,
        as: TCTEName,
        qb: TQb | ((ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQb)
    ): any {


        let res: TQb;
        if (typeof qb === "function") {

            let cteSelection: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSelection = {} as MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            } else {
                cteSelection = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            }
            res = qb(cteSelection);
        } else {
            res = qb;
        }

        let newCteSpecs = [...(this.cteSpecs || [] as CTESpecsType<TThisDbType>)];
        const newSpec = new CTEObject(this.dbType, res, as, cteType);

        let foundIndex = newCteSpecs.findIndex(spec => spec.name === newSpec.name) || -1;
        if (foundIndex >= 0) {
            newCteSpecs.toSpliced(foundIndex, 1);
        }
        newCteSpecs.push(newSpec);

        const params = extractParams([res], this.params);

        return new QueryBuilder(
            this.dbType,
            this.asName,
            this.castType,
            params,
            {
                fromSpecs: this.fromSpecs,
                cteSpecs: newCteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                queryResult: this.queryResult,
                queryResultSpecs: this.queryResultSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            }
        );
    }

    return cteFn;
}

const withAsFnForQb = generateCTEFunctionForQb(cteTypes.NON_RECURSIVE);
const withAsMaterializedFnForQb = generateCTEFunctionForQb(cteTypes.MATERIALIZED);
const withAsNotMaterializedFnForQb = generateCTEFunctionForQb(cteTypes.NOT_MATERIALIZED);

export {
    withAsFnForQb,
    withAsMaterializedFnForQb,
    withAsNotMaterializedFnForQb
}