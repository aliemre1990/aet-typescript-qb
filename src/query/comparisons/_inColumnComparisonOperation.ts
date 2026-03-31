import type { DbType } from "../../db.js";
import type { DbValueTypes, GetColumnTypes } from "../../table/column.js";
import type { IsAny, LiteralToBase, UndefinedIfLengthZero } from "../../utility/common.js";
import BaseColumnComparisonOperation, { inComparisonOperations, type InComparisonOperationType, type InferComparisonParams, type InferValueTypeFromExpression } from "../_baseClasses/BaseColumnComparisonOperation.js";
import { queryBuilderContextFactory, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "../_interfaces/IQueryExpression.js";
import QueryParam from "../param.js";
import QueryBuilder from "../queryBuilder.js";
import { convertArgsToQueryString } from "../uitlity/common.js";
import { extractParams } from "../utility.js";


type MapParamsToTypeRecursively<
    TValueType extends DbValueTypes,
    T extends readonly (TValueType | IQueryExpression<any, any, TValueType, any, any, any, any>)[]
> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends QueryParam<infer DbType, infer Name, infer ValueType, infer As, infer TCastType> ?
    IsAny<ValueType> extends true ?
    Rest extends readonly [any, ...any[]] ?
    [QueryParam<DbType, Name, TValueType | null, As, TCastType>, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [QueryParam<DbType, Name, TValueType | null, As, TCastType>] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...MapParamsToTypeRecursively<TValueType, Rest>] :
    [First] :
    []
    ;


class InColumnComparisonOperation<
    TDbType extends DbType,
    TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TApplied extends readonly (TValueType | null | IQueryExpression<TDbType, any, any, any, any, any, any>)[] | undefined,
    TValueType extends DbValueTypes = InferValueTypeFromExpression<TDbType, TComparing>,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined = UndefinedIfLengthZero<InferComparisonParams<TComparing, TApplied>>,
    TAs extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseColumnComparisonOperation<
    TDbType,
    InComparisonOperationType,
    TParams,
    DetermineValueType<TDbType, TCastType, boolean>,
    DetermineValueType<TDbType, TCastType, boolean>,
    TAs,
    TCastType
> {
    comparing: TComparing;
    value: TApplied;

    as<TAs extends string>(asName: TAs) {
        return new InColumnComparisonOperation<TDbType, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, asName, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new InColumnComparisonOperation<TDbType, TComparing, TApplied, TValueType, TParams, TAs, TCastType>(this.dbType, this.operation, this.comparing, this.value, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let comparingStr = this.comparing.buildSQL(context).query;
        if (this.comparing instanceof QueryBuilder) {
            comparingStr = `(${comparingStr})`;
        }

        let appliedStrArr: string[] = [];
        if (this.value) {
            appliedStrArr = convertArgsToQueryString(this.value, context);
        }

        let queryRes = `${comparingStr} ${this.operation.symbol} (${appliedStrArr.join(', ')})`;

        return { query: queryRes, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        operation: InComparisonOperationType,
        comparing: TComparing,
        value: TApplied,
        asName: TAs,
        castType: TCastType
    ) {
        const params = extractParams<TParams>([comparing, ...(value || [])]);
        super(dbType, operation, params, undefined, asName, castType);

        this.comparing = comparing;
        this.value = value;
    }
}

function generateInComparison(operation: InComparisonOperationType) {

    function inComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        val: TQb & IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>
    ): InColumnComparisonOperation<
        TDbType,
        TComparing,
        [TQb]
    >
    function inComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TValueType extends InferValueTypeFromExpression<TDbType, TComparing>,
        const TValues extends readonly (LiteralToBase<TValueType> | IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[],
        const TFinalValues extends readonly (LiteralToBase<TValueType> | IQueryExpression<TDbType, any, LiteralToBase<TValueType>, any, any, any, any>)[] = MapParamsToTypeRecursively<LiteralToBase<TValueType>, TValues>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >(
        this: TComparing,
        ...val: TValues
    ): InColumnComparisonOperation<
        TDbType,
        TComparing,
        [...TFinalValues]
    >
    function inComparison<
        TComparing extends IQueryExpression<TDbType, any, any, any, any, any, any>,
        TDbType extends DbType = TComparing extends IQueryExpression<infer DbType, any, any, any, any, any, any> ? DbType : never
    >
        (
            this: TComparing,
            ...val: any[]
        ) {

        const dbType = this.dbType;

        return new InColumnComparisonOperation(
            dbType,
            operation,
            this,
            [...val],
            undefined,
            undefined
        )
    }

    return inComparison;
}

const sqlIn = generateInComparison(inComparisonOperations.in);
const sqlNotIn = generateInComparison(inComparisonOperations.notIn);

export default InColumnComparisonOperation;

export {
    sqlIn,
    sqlNotIn
}
