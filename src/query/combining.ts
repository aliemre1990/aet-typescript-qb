import type { DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { MapCtesToSelectionType } from "./_types/miscellaneous.js";
import type QueryParam from "./param.js";
import type { ExtractParams } from "./param.js";
import QueryBuilder, { combineTypes, type CalculateCombineResult, type CombineSpecsType, type CombineType, type CTESpecsType, type DMLSpecType, type FromType, type JoinSpecsType, type MapQueryResultForCombine, type ResultShape } from "./queryBuilder.js";
import { extractParams, mapCTESpecsToSelection } from "./utility.js";

type MapToResultQueryBuilder<
    TDbType extends DbType,
    TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
    TTargetQb extends QueryBuilder<any, any, any, any, any, any, any, any>
> =
    TThis extends QueryBuilder<TDbType, infer TFrom, infer TJoinSpecs, infer TCTESpecs, infer TResultShape, infer TParams, infer TAs, infer TCastType> ?
    QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        CalculateCombineResult<TTargetQb, TResultShape>,
        UndefinedIfLengthZero<[...(TParams extends undefined ? [] : TParams), ...(ExtractParams<TTargetQb>)]>,
        TAs,
        TCastType
    > : never;



function generateCombineFunction(combineType: CombineType) {
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisDbType, TThisResult>, any, any, any>,

        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,

    >(
        this: TThis,
        qbSelectionCb: (ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQbResult
    ): MapToResultQueryBuilder<TThisDbType, TThis, TQbResult>
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisDbType, TThisResult>, any, any, any>,

        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,
    >(
        this: TThis,
        qbSelectionCb: TQbResult
    ): MapToResultQueryBuilder<TThisDbType, TThis, TQbResult>
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisDbType, TThisResult>, any, any, any>,
        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,

    >(
        this: TThis,
        cteSelectionCb: TQbResult | ((ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQbResult)
    ): any {
        let res: TQbResult;
        if (typeof cteSelectionCb === "function") {
            let cteSpecs: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSpecs = {} as MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            } else {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TThisDbType, TThisCTESpecs>;
            }
            res = cteSelectionCb(cteSpecs);
        } else {
            res = cteSelectionCb;
        }

        let newCombine = { type: combineType, qb: res };

        let newCombineSpecs: CombineSpecsType<TThisDbType> = [newCombine];
        if (this.combineSpecs !== undefined) {
            newCombineSpecs = [...this.combineSpecs, ...newCombineSpecs];
        }

        const params = extractParams([res.params], this.params);

        return new QueryBuilder(
            this.dbType,
            this.asName,
            this.castType,
            params,
            {
                fromSpecs: this.fromSpecs,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                queryResult: this.queryResult,
                queryResultSpecs: this.queryResultSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: newCombineSpecs
            });
    }

    return combine;
}

const unionFn = generateCombineFunction(combineTypes.UNION);
const unionAllFn = generateCombineFunction(combineTypes.UNION_ALL);
const intersectFn = generateCombineFunction(combineTypes.INTERSECT);
const intersectAllFn = generateCombineFunction(combineTypes.INTERSECT_ALL);
const exceptFn = generateCombineFunction(combineTypes.EXCEPT);
const exceptAllFn = generateCombineFunction(combineTypes.EXCEPT_ALL);

export {
    unionFn,
    unionAllFn,
    intersectFn,
    intersectAllFn,
    exceptFn,
    exceptAllFn
}