import type { DbType } from "../../db.js";
import type { GetColumnTypes } from "../../table/column.js";
import type ColumnsSelection from "../ColumnsSelection.js";
import type QueryParam from "../param.js";
import type { DetermineFinalValueType, DetermineValueType, IQueryExpression } from "../_interfaces/IQueryExpression.js";
import BaseQueryExpression from "./BaseQueryExpression.js";

type ResultShapeItem<TDbType extends DbType> = IQueryExpression<TDbType, any, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type GetFirstTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, infer TValueType, any, any, any, any> ? TValueType :
    never :
    never;

type GetFirstFinalTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType :
    never :
    never;

type GetFirstDefaultKeyFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IQueryExpression<TDbType, any, any, any, any, infer TFieldKey, any> ? TFieldKey :
    never :
    never;

type QueryResultSpecsType<TDbType extends DbType> = "*" | readonly (ColumnsSelection<TDbType, any, any> | IQueryExpression<TDbType, any, any, any, any, any, any>)[]


class BaseQueryBuilder<
    TDbType extends DbType,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined,
    TResult extends ResultShape<TDbType> | undefined,
    TAs extends string | undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined
> extends BaseQueryExpression<
    TDbType,
    TParams,
    DetermineValueType<TDbType, TCastType, GetFirstTypeFromResult<TDbType, TResult>>,
    DetermineFinalValueType<GetFirstFinalTypeFromResult<TDbType, TResult>, DetermineValueType<TDbType, TCastType, GetFirstTypeFromResult<TDbType, TResult>>>,
    GetFirstDefaultKeyFromResult<TDbType, TResult>,
    TAs,
    TCastType
> {
    queryResult: TResult;
    queryResultSpecs: QueryResultSpecsType<TDbType> | undefined;

    constructor(
        dbType: TDbType,
        params: TParams,
        asName: TAs,
        castType: TCastType,
        queryResult: TResult,
        queryResultSpecs: QueryResultSpecsType<TDbType> | undefined
    ) {
        const fieldName = queryResult !== undefined && queryResult.length > 0 ? queryResult[0].asName || queryResult[0].fieldName : "";
        super(dbType, params, fieldName, asName, castType);

        this.queryResult = queryResult;
        this.queryResultSpecs = queryResultSpecs;
    }
}

export default BaseQueryBuilder;

export type {
    ResultShapeItem,
    ResultShape,
    GetFirstTypeFromResult,
    GetFirstFinalTypeFromResult,
    GetFirstDefaultKeyFromResult,
    QueryResultSpecsType
}

