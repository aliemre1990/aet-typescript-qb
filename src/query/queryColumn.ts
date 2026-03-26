import type { DbType } from "../db.js";
import { IQueryExpressionFinalValueDummySymbol, IQueryExpressionValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IQueryExpression, type QueryBuilderContext } from "./_interfaces/IQueryExpression.js";
import type Column from "../table/column.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";
import type { PgColumnType } from "../table/columnTypes.js";
import BaseQueryExpression from "./_baseClasses/BaseQueryExpression.js";

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends { tableName: string, asTableName?: string },
    TAsName extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> extends BaseQueryExpression<
    TDbType,
    undefined,
    DetermineValueType<TCastType, TValueType>,
    DetermineFinalValueType<TFinalValueType, DetermineValueType<TCastType, TValueType>>,
    TColumn["name"],
    TAsName,
    TCastType
> {
    qTableSpecs: TQTableSpecs;

    constructor(
        dbType: TDbType,
        public column: TColumn,
        qTableSpecs: TQTableSpecs,
        asName: TAsName,
        castType: TCastType
    ) {
        super(dbType, undefined, column.name, asName, castType);
        this.qTableSpecs = qTableSpecs;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TCastType, TValueType, TFinalValueType>(this.dbType, this.column, this.qTableSpecs, val, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TCastType, TValueType, TFinalValueType>(this.dbType, this.column, this.qTableSpecs, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `"${this.qTableSpecs.asTableName || this.qTableSpecs.tableName}"."${this.column.name}"${this.asName ? ` AS "${this.asName}"` : ''}`, params: context.params };
    }
}


export default QueryColumn;