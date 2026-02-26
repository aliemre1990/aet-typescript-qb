import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type QueryParam from "../param.js";

type AccumulateComparisonParams<TCbResult extends ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any, any>, TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined = undefined> =
    TCbResult extends { params?: infer TCompParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined } ?
    [...(TParams extends undefined ? [] : TParams), ...(TCompParams extends undefined ? [] : TCompParams)] :
    [...(TParams extends undefined ? [] : TParams)];


// type InferParamsFromOps<T> =
//     T extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any, any> ?
//     TComparing extends IComparable<any, any, any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any, any, any>[] ?
//     [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>,] :
//     [...InferParamsFromComparables<[TComparing]>] :
//     TApplied extends readonly IComparable<any, any, any, any, any, any, any>[] ?
//     [...InferParamsFromComparables<TApplied>] :
//     [] :
//     T extends ColumnLogicalOperation<any, infer TOps, any> ?
//     InferParamsFromOpsArray<TOps> :
//     [];

// type InferParamsFromOpsArray<T extends readonly any[]> =
//     T extends readonly [infer First, ...infer Rest] ?
//     First extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any, any> ?
//     TComparing extends IComparable<any, any, any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any, any, any>[] ?
//     [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :
//     [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromOpsArray<Rest>] :

//     TApplied extends IComparable<any, any, any, any, any, any, any>[] ?
//     [...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :

//     InferParamsFromOpsArray<Rest> :
//     First extends ColumnLogicalOperation<any, infer TOps, any> ?
//     [...InferParamsFromOpsArray<TOps>, ...InferParamsFromOpsArray<Rest>] :
//     InferParamsFromOpsArray<Rest> :
//     [];

// type InferParamsFromComparables<T> =
//     T extends readonly [infer First, ...infer Rest] ?
//     First extends IComparable<any, infer TParams, any, any, any, any, any> ?
//     [...(TParams extends undefined ? [] : TParams), ...InferParamsFromComparables<Rest>] :
//     [...InferParamsFromComparables<Rest>] :
//     [];

export type {
    AccumulateComparisonParams,
}