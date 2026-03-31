import type { DbType } from "../db.js";
import type { GetColumnTypes } from "../table/column.js";
import type { UndefinedIfLengthZero } from "../utility/common.js";
import type { MapCtesToSelectionType } from "./_types/miscellaneous.js";
import type QueryParam from "./param.js";
import type { ExtractParams } from "./param.js";
import QueryBuilder, { combineTypes, type CalculateCombineResult, type CombineSpecsType, type CombineType, type CTESpecsType, type FromType, type JoinSpecsType, type MapQueryResultForCombine, type ResultShape } from "./queryBuilder.js";
import { extractParams, mapCTESpecsToSelection } from "./utility.js";

function generateCombineFunction(combineType: CombineType) {
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisResult>, any, any, any>,
        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisFrom extends FromType<TThisDbType> | undefined = TThis extends QueryBuilder<any, infer TFrom, any, any, any, any, any, any> ? TFrom : never,
        TThisJoinSpecs extends JoinSpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, infer TJoinSpecs, any, any, any, any, any> ? TJoinSpecs : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,
        TThisParams extends DbType = ExtractParams<TThis>,
        TThisAs extends string | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, infer TAs, any> ? TAs : never,
        TThisCastType extends GetColumnTypes<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, any, infer TCastType> ? TCastType : never,
        TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = ExtractParams<TQbResult>,
        TParamsAccumulated extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TThisParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TThisParams : []),
                ...(TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TCombineParams : [])
            ]
        >
    >(
        this: TThis,
        qbSelectionCb: (ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQbResult
    ): QueryBuilder<
        TThisDbType,
        TThisFrom,
        TThisJoinSpecs,
        TThisCTESpecs,
        CalculateCombineResult<TQbResult, TThisResult>,
        TParamsAccumulated,
        TThisAs,
        TThisCastType
    >
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisResult>, any, any, any>,
        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisFrom extends FromType<TThisDbType> | undefined = TThis extends QueryBuilder<any, infer TFrom, any, any, any, any, any, any> ? TFrom : never,
        TThisJoinSpecs extends JoinSpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, infer TJoinSpecs, any, any, any, any, any> ? TJoinSpecs : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,
        TThisParams extends DbType = ExtractParams<TThis>,
        TThisAs extends string | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, infer TAs, any> ? TAs : never,
        TThisCastType extends GetColumnTypes<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, any, infer TCastType> ? TCastType : never,
        TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = ExtractParams<TQbResult>,
        TParamsAccumulated extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TThisParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TThisParams : []),
                ...(TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TCombineParams : [])
            ]
        >
    >(
        this: TThis,
        qbSelectionCb: TQbResult
    ): QueryBuilder<
        TThisDbType,
        TThisFrom,
        TThisJoinSpecs,
        TThisCTESpecs,
        CalculateCombineResult<TQbResult, TThisResult>,
        TParamsAccumulated,
        TThisAs,
        TThisCastType
    >
    function combine<
        TThis extends QueryBuilder<any, any, any, any, any, any, any, any>,
        TQbResult extends QueryBuilder<TThisDbType, any, any, any, MapQueryResultForCombine<TThisResult>, any, any, any>,
        TThisDbType extends DbType = TThis extends QueryBuilder<infer DbType, any, any, any, any, any, any, any> ? DbType : never,
        TThisFrom extends FromType<TThisDbType> | undefined = TThis extends QueryBuilder<any, infer TFrom, any, any, any, any, any, any> ? TFrom : never,
        TThisJoinSpecs extends JoinSpecsType<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, infer TJoinSpecs, any, any, any, any, any> ? TJoinSpecs : never,
        TThisCTESpecs extends CTESpecsType<TThisDbType> = TThis extends QueryBuilder<any, any, any, infer TCTESpecs, any, any, any, any> ? TCTESpecs : never,
        TThisResult extends ResultShape<TThisDbType> = TThis extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never,
        TThisParams extends DbType = ExtractParams<TThis>,
        TThisAs extends string | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, infer TAs, any> ? TAs : never,
        TThisCastType extends GetColumnTypes<TThisDbType> | undefined = TThis extends QueryBuilder<any, any, any, any, any, any, any, infer TCastType> ? TCastType : never,
        TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = ExtractParams<TQbResult>,
        TParamsAccumulated extends readonly QueryParam<TThisDbType, any, any, any, any>[] | undefined = UndefinedIfLengthZero<
            [
                ...(TThisParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TThisParams : []),
                ...(TCombineParams extends readonly QueryParam<TThisDbType, any, any, any, any>[] ? TCombineParams : [])
            ]
        >
    >(
        this: TThis,
        cteSelectionCb: TQbResult | ((ctes: MapCtesToSelectionType<TThisDbType, TThisCTESpecs>) => TQbResult)
    ): QueryBuilder<
        TThisDbType,
        TThisFrom,
        TThisJoinSpecs,
        TThisCTESpecs,
        CalculateCombineResult<TQbResult, TThisResult>,
        TParamsAccumulated,
        TThisAs,
        TThisCastType
    > {
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

        return new QueryBuilder<
            TThisDbType,
            TThisFrom,
            TThisJoinSpecs,
            TThisCTESpecs,
            CalculateCombineResult<TQbResult, TThisResult>,
            TParamsAccumulated,
            TThisAs,
            TThisCastType
        >(
            this.dbType,
            this.fromSpecs,
            this.asName,
            this.castType,
            {
                queryType: this.queryType,
                params: params as TParamsAccumulated,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult as CalculateCombineResult<TQbResult, TThisResult>,
                selectSpecs: this.selectSpecs,
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