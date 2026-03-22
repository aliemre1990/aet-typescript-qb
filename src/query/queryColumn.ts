import type { DbType } from "../db.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";
import notEq from "./comparisons/notEq.js";
import gt from "./comparisons/gt.js";
import gte from "./comparisons/gte.js";
import lt from "./comparisons/lt.js";
import lte from "./comparisons/lte.js";
import type { PgColumnType } from "../table/columnTypes.js";
import notBetween from "./comparisons/notBetween.js";
import isNull from "./comparisons/isNull.js";
import isNotNull from "./comparisons/isNotNull.js";

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends { tableName: string, asTableName?: string },
    TAsName extends string | undefined = undefined,
    TCastType extends PgColumnType | undefined = undefined,
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> implements IComparable<
    TDbType,
    undefined,
    DetermineValueType<TCastType, TValueType>,
    DetermineFinalValueType<TFinalValueType, DetermineValueType<TCastType, TValueType>>,
    TColumn["name"],
    TAsName,
    TCastType
> {
    [IComparableValueDummySymbol]: DetermineValueType<TCastType, TValueType>;
    [IComparableFinalValueDummySymbol]: DetermineFinalValueType<TFinalValueType, DetermineValueType<TCastType, TValueType>>

    qTableSpecs: TQTableSpecs;

    dbType: TDbType;
    asName: TAsName;
    fieldName: TColumn["name"];
    castType?: TCastType;

    params?: undefined;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
    notBetween: typeof notBetween = notBetween;
    isNull: typeof isNull = isNull;
    isNotNull: typeof isNotNull = isNotNull;

    constructor(
        dbType: TDbType,
        public column: TColumn,
        qTableSpecs: TQTableSpecs,
        asName: TAsName,
        castType?: TCastType
    ) {
        this.asName = asName;
        this.dbType = dbType;
        this.qTableSpecs = qTableSpecs;
        this.fieldName = column.name;
        this.castType = castType;

        this[IComparableValueDummySymbol] = undefined as any;
        this[IComparableFinalValueDummySymbol] = undefined as any;
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