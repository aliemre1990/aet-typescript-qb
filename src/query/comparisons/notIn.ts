import type { DbType } from "../../db.js";
import ColumnComparisonOperation, { comparisonOperations, type InferValueTypeFromComparable } from "./_comparisonOperations.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsAny, IsExactAlt, LiteralToBase } from "../../utility/common.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import type { DbValueTypes } from "../../table/column.js";
import type { MapParamsToTypeRecursively } from "./in.js";

function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    val: TQb & IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [TQb]
>
function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    const TValues extends readonly (LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[],
    const TFinalValues extends readonly (LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[] = MapParamsToTypeRecursively<LiteralToBase<TValueType>, TValues>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>(
    this: TComparing,
    ...val: TValues
): ColumnComparisonOperation<
    TDbType,
    TComparing,
    [...TFinalValues]
>


function sqlNotIn<
    TComparing extends IComparable<TDbType, any, any, any, any, any, any>,
    TValueType extends InferValueTypeFromComparable<TDbType, TComparing>,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TValues extends LiteralToBase<TValueType> | IComparable<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>,
    TDbType extends DbType = TComparing extends IComparable<infer DbType, any, any, any, any, any, any> ? DbType : never
>
    (
        this: TComparing,
        ...val: (TQb | TValues)[]
    ) {

    const dbType = this.dbType;

    if (val[0] instanceof QueryBuilder) {
        // value is querybuilder
        return new ColumnComparisonOperation(
            dbType,
            comparisonOperations.notIn,
            this,
            [val[0]],
            undefined
        );
    }

    return new ColumnComparisonOperation(
        dbType,
        comparisonOperations.notIn,
        this,
        [...val],
        undefined
    )

}

export default sqlNotIn;
