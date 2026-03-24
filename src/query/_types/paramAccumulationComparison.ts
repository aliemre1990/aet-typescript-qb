import type BaseColumnComparisonOperation from "../_baseClasses/BaseColumnComparisonOperation.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type QueryParam from "../param.js";

type AccumulateComparisonParams<TCbResult extends BaseColumnComparisonOperation<any, any, any, any, any, any, any> | ColumnLogicalOperation<any, any, any, any, any>, TParams extends readonly QueryParam<any, any, any, any, any>[] | undefined = undefined> =
    TCbResult extends { params?: infer TCompParams extends readonly QueryParam<any, any, any, any, any>[] | undefined } ?
    [...(TParams extends undefined ? [] : TParams), ...(TCompParams extends undefined ? [] : TCompParams)] :
    [...(TParams extends undefined ? [] : TParams)];


export type {
    AccumulateComparisonParams,
}