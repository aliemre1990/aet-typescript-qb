import type { DbType } from "../db.js";
import type { DbValueTypes, GetColumnTypes } from "../table/column.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";
import { queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type { IName } from "./_interfaces/IName.js";
import type { CTEType, ResultShape } from "./queryBuilder.js";
import QueryBuilder from "./queryBuilder.js";
import type { IQueryTable } from "./_interfaces/IQueryTable.js";

type MapEntriesWithOwnerName<
    TDbType extends DbType,
    TEntries extends readonly CTEObjectEntry<TDbType, any, any, any, any, any, any, any>[],
    TOwnerName extends string
> = {
        readonly [K in keyof TEntries]: TEntries[K] extends
        CTEObjectEntry<TDbType, infer TExpression, any, infer TValueType, infer TFinalValueType, infer TFieldName, infer TAsName, infer TCastType> ?
        CTEObjectEntry<TDbType, TExpression, TOwnerName, TValueType, TFinalValueType, TFieldName, TAsName, TCastType> : never;
    }

type MapResultToCTEObjectEntry<TDbType extends DbType, TExpressions extends ResultShape<TDbType>, TCTEName extends string> = {
    readonly [K in keyof TExpressions]: CTEObjectEntry<TDbType, TExpressions[K], TCTEName>
}

class CTEObjectEntry<
    TDbType extends DbType,
    TExpression extends IQueryExpression<TDbType, any, any, any, any, any, any>,
    TOwnerName extends string,
    TValueType extends DbValueTypes | null = TExpression extends IQueryExpression<TDbType, any, infer TValType, any, any, any, any> ? TValType : never,
    TFinalValueType extends DbValueTypes | null = TExpression extends IQueryExpression<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never,
    TFieldName extends string = TExpression extends IQueryExpression<TDbType, any, any, any, infer TName, infer TAs, any> ? TAs extends undefined ? TName : TAs : never,
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
        return new CTEObjectEntry<TDbType, TExpression, TOwnerName, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, val, this.castType, this.ownerName, this.fieldName);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new CTEObjectEntry<TDbType, TExpression, TOwnerName, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, this.asName, type, this.ownerName, this.fieldName);
    }

    ownerName: TOwnerName;
    setOwnerName<TOwnerName extends string>(val: TOwnerName) {
        return new CTEObjectEntry<TDbType, TExpression, TOwnerName, TValueType, TFinalValueType, TFieldName, TAsName, TCastType>(this.dbType, this.expression, this.asName, this.castType, val);
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
        ownerName: TOwnerName,
        fieldName?: TFieldName,
    ) {
        const fieldNameCalced = fieldName || (expression.asName === undefined ? expression.fieldName : expression.asName);
        super(dbType, undefined, fieldNameCalced, asName, castType);

        this.expression = expression;
        this.ownerName = ownerName;
    }
}

class CTEObject<
    TDbType extends DbType,
    TCTEName extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType>, any, any, any>,
    TEntries extends readonly CTEObjectEntry<TDbType, any, any, any, any, any, any, any>[] = TQb extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any, any> ? TRes extends ResultShape<TDbType> ? MapResultToCTEObjectEntry<TDbType, TRes, TCTEName> : never : never,
    TAs extends string | undefined = undefined
> implements IQueryTable<TDbType, TAs extends undefined ? TCTEName : TAs, TEntries> {

    dbType: TDbType;
    name: TAs extends undefined ? TCTEName : TAs;
    columnsList: TEntries;

    qb: TQb;

    asName?: TAs;
    cteName: TCTEName;
    isColumnListPresent?: boolean;

    cteType: CTEType;

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        let query = this.qb.buildSQL(context);
        return { query: query.query, params: [...(query.params)] };
    }

    constructor(
        dbType: TDbType,
        qb: TQb,
        cteName: TCTEName,
        cteType: CTEType,
        entries?: TEntries,
        asName?: TAs,
        isColumnListPresent?: boolean
    ) {
        this.dbType = dbType;
        this.qb = qb;
        this.cteName = cteName;
        this.name = (asName || cteName) as TAs extends undefined ? TCTEName : TAs;
        this.asName = asName;
        this.cteType = cteType;
        this.isColumnListPresent = isColumnListPresent;

        if (entries !== undefined) {
            this.columnsList = entries;
        } else {
            let tmpEntries: readonly CTEObjectEntry<TDbType, any, any, any, any, any, any>[] = [];
            if (qb.queryResult !== undefined) {
                qb.queryResult.forEach(res => {
                    tmpEntries = [...tmpEntries, (new CTEObjectEntry(dbType, res, undefined, undefined, this.cteName))];
                })
            }

            this.columnsList = tmpEntries as TEntries;
        }
    }

    as<TAs extends string>(val: TAs) {
        const newEntries = this.columnsList
            .map(ent => new CTEObjectEntry(
                ent.dbType,
                ent.expression,
                ent.asName,
                ent.castType,
                ent.fieldName,
                val
            )) as MapEntriesWithOwnerName<TDbType, TEntries, TAs>;

        return new CTEObject<TDbType, TCTEName, TQb, MapEntriesWithOwnerName<TDbType, TEntries, TAs>, TAs>(this.dbType, this.qb, this.cteName, this.cteType, newEntries, val);
    }
}

export default CTEObject;

export {
    CTEObjectEntry,
}

export type {
    MapResultToCTEObjectEntry
}