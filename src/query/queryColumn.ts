import type { DbType } from "../db.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type Column from "../table/column.js";
import type { ColumnType, DbValueTypes, GetColumnTypes } from "../table/column.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";

class QueryColumn<
    TDbType extends DbType,
    TName extends string,
    TQTableSpecs extends { tableName: string, asTableName: string | undefined },
    TValueType extends DbValueTypes,
    TFinalValueType extends DbValueTypes | null,
    TAsName extends string | undefined = undefined,
    TCastType extends GetColumnTypes<TDbType> | undefined = undefined,
> extends BaseQueryExpression<
    TDbType,
    undefined,
    DetermineValueType<TDbType, TCastType, TValueType>,
    DetermineFinalValueType<TFinalValueType, DetermineValueType<TDbType, TCastType, TValueType>>,
    TName,
    TAsName,
    TCastType
> {
    qTableSpecs: TQTableSpecs;

    constructor(
        dbType: TDbType,
        name: TName,
        qTableSpecs: TQTableSpecs,
        asName: TAsName,
        castType: TCastType
    ) {
        super(dbType, undefined, name, asName, castType);
        this.qTableSpecs = qTableSpecs;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TName, TQTableSpecs, TValueType, TFinalValueType, TAsName, TCastType>(this.dbType, this.fieldName, this.qTableSpecs, val, this.castType);
    }
    cast<TCastType extends GetColumnTypes<TDbType>>(type: TCastType) {
        return new QueryColumn<TDbType, TName, TQTableSpecs, TValueType, TFinalValueType, TAsName, TCastType>(this.dbType, this.fieldName, this.qTableSpecs, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `"${this.qTableSpecs.asTableName || this.qTableSpecs.tableName}"."${this.fieldName}"${this.asName ? ` AS "${this.asName}"` : ''}`, params: context.params };
    }
}


export default QueryColumn;