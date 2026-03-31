import type { DbType } from "../db.js";
import type { DbValueTypes, GetColumnTypes } from "../table/column.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { IName } from "./_interfaces/IName.js";
import type { ResultShape } from "./queryBuilder.js";
import type QueryBuilder from "./queryBuilder.js";

type MapResultToSubQueryEntry<TDbType extends DbType, TExpressions extends ResultShape<TDbType>> =
    TExpressions extends readonly [infer First, ...infer Rest] ?
    First extends IQueryExpression<TDbType, any, any, any, any, any, any> ?
    Rest extends ResultShape<TDbType> ?
    [SubQueryEntry<TDbType, First>, ...MapResultToSubQueryEntry<TDbType, Rest>] :
    [SubQueryEntry<TDbType, First>] :
    [] :
    []
    ;

class SubQueryEntry<
    TDbType extends DbType,
    TExpression extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TValueType extends DbValueTypes = TExpression extends IQueryExpression<TDbType, any, infer TValType, any, any, any, any> ? TValType : never,
    TFinalValueType extends TValueType | null = TExpression extends IQueryExpression<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never,
    TFieldName extends string = TExpression extends IQueryExpression<TDbType, any, any, any, infer TFieldName, infer TAs, any> ? TAs extends undefined ? TFieldName : TAs : never,
    TAsName extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined
> extends BaseQueryExpression<
    TDbType,
    undefined,
    DetermineValueType<TDbType, TCastType, TValueType>,
    DetermineFinalValueType<TFinalValueType, DetermineValueType<TDbType, TCastType, TValueType>>,
    TFieldName,
    TAsName,
    TCastType
> {
    expression: TExpression;

    as<TAsName extends string>(val: TAsName) {
        return new SubQueryEntry<TDbType, TExpression, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, val, this.castType, this.ownerName);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new SubQueryEntry<TDbType, TExpression, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, this.asName, type, this.ownerName);

    }
    ownerName?: string;
    setOwnerName(val: string): SubQueryEntry<TDbType, TExpression, TValueType, TFinalValueType, TFieldName, TAsName, TCastType> {
        return new SubQueryEntry<TDbType, TExpression, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, this.asName, this.castType, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `"${this.ownerName}"."${this.asName || this.fieldName}"`, params: context.params };
    }

    constructor(
        dbType: TDbType,
        expression: TExpression,
        asName: TAsName,
        castType: TCastType,
        ownerName?: string
    ) {
        const fieldName = expression.asName === undefined ? expression.fieldName : expression.asName;
        super(dbType, undefined, fieldName, asName, castType);
        this.expression = expression;
        this.ownerName = ownerName;
    }
}

class SubQueryObject<
    TDbType extends DbType,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, string, any>,
    TEntries extends readonly SubQueryEntry<TDbType, any, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, string, any> ? MapResultToSubQueryEntry<TDbType, TRes> : never,
    TName extends string = TQb extends QueryBuilder<TDbType, any, any, any, any, any, infer TAsName, any> ? TAsName : never,
> implements IName<TName> {
    dbType: TDbType;
    qb: TQb;
    name: TName;
    subQueryEntries: TEntries;

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const qbBuildRes = this.qb.buildSQL(context);
        let query = `(${qbBuildRes.query})${this.qb.asName ? ` AS "${this.qb.asName}"` : ''}`;
        return { query, params: [...(qbBuildRes.params)] };
    }


    constructor(
        dbType: TDbType,
        qb: TQb
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.name = qb.asName as TName;

        let tmpEntries: readonly SubQueryEntry<TDbType, any, any, any, any, any, any>[] = [];
        if (qb.selectResult !== undefined) {
            qb.selectResult.forEach(res => {
                tmpEntries = [...tmpEntries, (new SubQueryEntry(dbType, res, undefined, undefined, qb.asName))];
            })
        }

        this.subQueryEntries = tmpEntries as TEntries;
    }
}

export default SubQueryObject;

export {
    SubQueryEntry
}

export type {
    MapResultToSubQueryEntry
}