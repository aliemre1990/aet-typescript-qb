import { dbTypes, type PgDbType } from "../../../db.js";
import type { IQueryExpression } from "../../_interfaces/IQueryExpression.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "../_aggregationOperations.js";

/**
 * Passing row object directly to json_agg function is removed due to
 * typescripts lack of preserving the ordering of tuples when used
 * union to tuple trick. When typescript brings union to tuple with
 * preserved order it will be added then.
 */
// type InferTupleFromCols<
//     TCols extends { [key: string]: IQueryExpression<any, any, any, any, any, any, any> },
//     Acc extends readonly any[] = []
// > = {
//         [K in keyof TCols]: TCols[K] extends IQueryExpression<any, any, any, any, infer TFinalType, any, any> ?
//         Exclude<keyof TCols, K> extends never ?
//         [...Acc, TFinalType] :
//         InferTupleFromCols<Pick<TCols, Exclude<keyof TCols, K>>, [...Acc, TFinalType]>
//         : never
//     }



type InferReturnTypeFromArg<TArg> =
    TArg extends IQueryExpression<any, any, any, infer TFinalType, any, any, any> ? TFinalType[] :
    never
    ;


function jsonAggFn<
    TArg extends IQueryExpression<PgDbType, any, any, any, any, any, any>
>(
    arg: TArg
) {
    return new BasicColumnAggregationOperation<
        PgDbType,
        [TArg],
        InferReturnTypeFromArg<TArg>
    >(dbTypes.postgresql, [arg], aggregationOperations.jsonAgg, undefined, undefined);
}


function jsonbAggFn<
    TArg extends IQueryExpression<PgDbType, any, any, any, any, any, any>
>(
    arg: TArg
) {
    return new BasicColumnAggregationOperation<
        PgDbType,
        [TArg],
        InferReturnTypeFromArg<TArg>
    >(dbTypes.postgresql, [arg], aggregationOperations.jsonbAgg, undefined, undefined);
}

export { jsonAggFn, jsonbAggFn };