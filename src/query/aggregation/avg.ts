import type { DbType } from "../../db.js";
import type { IQueryExpression } from "../_interfaces/IQueryExpression.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateAvgFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends IQueryExpression<TDbType, any, number, any, any, any, any>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            [TAggColumn],
            TAggColumn extends IQueryExpression<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never
        >(dbType, [arg], aggregationOperations.avg, undefined, undefined);

    }
}

export default generateAvgFn;