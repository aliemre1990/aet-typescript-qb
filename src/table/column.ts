import type { DbType, MySQLDbType, PgDbType } from "../db.js";
import type { IDbType } from "../query/_interfaces/IDbType.js";
import type { GetValueTypeOfDbType, MySQLColumnType, PgColumnType, PgTypeToJsType } from "./columnTypes.js";
import type { TableSpecsType } from "./table.js";

type DbValueTypes = string | string[] | number | number[] | bigint | bigint[] | boolean | boolean[] | Date | Date[] | Buffer | object | object[];

type GetColumnTypes<TDbType extends DbType> =
    [TDbType] extends [PgDbType] ? PgColumnType :
    [TDbType] extends [MySQLDbType] ? MySQLColumnType :
    never;


type ColumnType<TDbType extends DbType> = Column<TDbType, GetColumnTypes<TDbType>, string, TableSpecsType, boolean, any, any>;
type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };

class Column<
    TDbType extends DbType,
    TColumnType extends GetColumnTypes<TDbType>,
    TColumnName extends string,
    TTableSpecs extends TableSpecsType,
    TIsNull extends boolean = false,
    TValueType extends DbValueTypes = GetValueTypeOfDbType<TDbType, TColumnType>,
    TFinalValueType extends DbValueTypes | null = TIsNull extends true ? TValueType | null : TValueType
> implements IDbType<TDbType> {

    dbType: TDbType;

    tableSpecs: TTableSpecs;

    value: TValueType;
    finalValue: TFinalValueType;

    constructor(
        dbType: TDbType,
        public name: TColumnName,
        public type: TColumnType,
        public isNullable: TIsNull,
        public defaultValue?: string
    ) {
        this.dbType = dbType;

        this.value = undefined as unknown as TValueType;
        this.finalValue = undefined as unknown as TFinalValueType;

        this.tableSpecs = undefined as unknown as TTableSpecs;
    }

    setTableSpecs(val: TTableSpecs) {
        this.tableSpecs = val;
    }

}

export default Column;

export type {
    DbValueTypes,
    GetColumnTypes,
    ColumnType,
    ColumnsObjectType
}