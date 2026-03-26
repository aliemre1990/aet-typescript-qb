import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateSumFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends IQueryExpression<TDbType, any, number, any, any, any, any>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            typeof aggregationOperations.sum,
            [TAggColumn],
            TAggColumn extends IQueryExpression<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never
        >(dbType, [arg], aggregationOperations.sum, undefined, undefined);

    }
}

export default generateSumFn;