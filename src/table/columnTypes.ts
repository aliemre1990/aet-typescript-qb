import type { DbType, MySQLDbType, PgDbType } from "../db.js";
import type { DbValueTypes } from "./column.js";

const pgColumnTypes = {
    // Numeric Types
    smallInt: 'SMALLINT',               // int2 - signed two-byte integer
    int: 'INTEGER',                     // int, int4 - signed four-byte integer
    bigInt: 'BIGINT',                   // int8 - signed eight-byte integer
    decimal: 'DECIMAL',                 // decimal(p, s) - exact numeric of selectable precision
    numeric: 'NUMERIC',                 // numeric(p, s) - exact numeric of selectable precision
    real: 'REAL',                       // float4 - single precision floating-point number (4 bytes)
    doublePrecision: 'DOUBLE PRECISION',// float, float8 - double precision floating-point number (8 bytes)
    smallSerial: 'SMALLSERIAL',         // serial2 - autoincrementing two-byte integer
    serial: 'SERIAL',                   // serial4 - autoincrementing four-byte integer
    bigSerial: 'BIGSERIAL',             // serial8 - autoincrementing eight-byte integer

    // Monetary Type
    money: 'MONEY',                     // currency amount

    // Character Types
    varchar: 'VARCHAR',                 // varchar(n) - variable-length character string
    char: 'CHAR',                       // char(n) - fixed-length character string
    text: 'TEXT',                       // variable-length character string

    // Binary Data Types
    bytea: 'BYTEA',                     // binary data ("byte array")

    // Date/Time Types
    timestamp: 'TIMESTAMP',                                     // date and time (no time zone)
    timestampWithTimeZone: 'TIMESTAMP WITH TIME ZONE',          // timestamptz - date and time, including time zone
    timestampWithoutTimeZone: 'TIMESTAMP WITHOUT TIME ZONE',    // date and time (no time zone)
    date: 'DATE',                                               // calendar date (year, month, day)
    time: 'TIME',                                               // time of day (no time zone)
    timeWithTimeZone: 'TIME WITH TIME ZONE',                    // timetz - time of day, including time zone
    timeWithoutTimeZone: 'TIME WITHOUT TIME ZONE',              // time of day (no time zone)
    interval: 'INTERVAL',                                       // time span

    // Boolean Type
    boolean: 'BOOLEAN',                 // bool - logical Boolean (true/false)

    // Geometric Types
    point: 'POINT',                     // geometric point on a plane
    line: 'LINE',                       // infinite line on a plane
    lseg: 'LSEG',                       // line segment on a plane
    box: 'BOX',                         // rectangular box on a plane
    path: 'PATH',                       // geometric path on a plane
    polygon: 'POLYGON',                 // closed geometric path on a plane
    circle: 'CIRCLE',                   // circle on a plane

    // Network Address Types
    cidr: 'CIDR',                       // IPv4 or IPv6 network address
    inet: 'INET',                       // IPv4 or IPv6 host address
    macAddr: 'MACADDR',                 // MAC (Media Access Control) address
    macAddr8: 'MACADDR8',               // MAC (Media Access Control) address (EUI-64 format)

    // Bit String Types
    bit: 'BIT',                         // fixed-length bit string
    bitVarying: 'BIT VARYING',          // varbit - variable-length bit string

    // Text Search Types
    tsVector: 'TSVECTOR',               // text search document
    tsQuery: 'TSQUERY',                 // text search query

    // UUID Type
    uuid: 'UUID',                       // universally unique identifier

    // XML Type
    xml: 'XML',                         // XML data

    // JSON Types
    json: 'JSON',                       // textual JSON data
    jsonb: 'JSONB',                     // binary JSON data, decomposed

    // Log Sequence Number Type
    pgLsn: 'PG_LSN',                    // PostgreSQL Log Sequence Number

    // Snapshot Types
    pgSnapshot: 'PG_SNAPSHOT',          // user-level transaction ID snapshot
    txidSnapshot: 'TXID_SNAPSHOT',      // user-level transaction ID snapshot (deprecated; see pg_snapshot)
} as const;
type PgColumnType = typeof pgColumnTypes[keyof typeof pgColumnTypes];

type PgTypeToJsType<T extends PgColumnType> =
    [T] extends ['SMALLINT' | 'INTEGER' | 'SERIAL' | 'SMALLSERIAL'] ? number :
    [T] extends ['BIGINT' | 'BIGSERIAL'] ? bigint :
    [T] extends ['DECIMAL' | 'NUMERIC' | 'REAL' | 'DOUBLE PRECISION' | 'MONEY'] ? number :
    [T] extends ['VARCHAR' | 'CHAR' | 'TEXT'] ? string :
    [T] extends ['BYTEA'] ? Buffer :
    [T] extends ['TIMESTAMP' | 'TIMESTAMP WITH TIME ZONE' | 'TIMESTAMP WITHOUT TIME ZONE' | 'DATE' | 'TIME' | 'TIME WITH TIME ZONE' | 'TIME WITHOUT TIME ZONE'] ? Date :
    [T] extends ['INTERVAL'] ? string :
    [T] extends ['BOOLEAN'] ? boolean :
    [T] extends ['POINT' | 'LINE' | 'LSEG' | 'BOX' | 'PATH' | 'POLYGON' | 'CIRCLE'] ? object :
    [T] extends ['CIDR' | 'INET' | 'MACADDR' | 'MACADDR8'] ? string :
    [T] extends ['BIT' | 'BIT VARYING'] ? string :
    [T] extends ['TSVECTOR' | 'TSQUERY'] ? string :
    [T] extends ['UUID'] ? string :
    [T] extends ['XML'] ? string :
    [T] extends ['JSON' | 'JSONB'] ? object :
    [T] extends ['PG_LSN'] ? string :
    [T] extends ['PG_SNAPSHOT' | 'TXID_SNAPSHOT'] ? string :
    never;

type JsTypeToPgTypes<T extends DbValueTypes> =
    T extends number ?
    'SMALLINT' | 'INTEGER' | 'SERIAL' | 'SMALLSERIAL' | 'DECIMAL' | 'NUMERIC' | 'REAL' | 'DOUBLE PRECISION' | 'MONEY' :
    T extends bigint ?
    'BIGINT' | 'BIGSERIAL' :
    T extends string ?
    'VARCHAR' | 'CHAR' | 'TEXT' | 'INTERVAL' | 'CIDR' | 'INET' | 'MACADDR' | 'MACADDR8' | 'BIT' | 'BIT VARYING' | 'TSVECTOR' | 'TSQUERY' | 'UUID' | 'XML' | 'PG_LSN' | 'PG_SNAPSHOT' | 'TXID_SNAPSHOT' :
    T extends boolean ?
    'BOOLEAN' :
    T extends Date ?
    'TIMESTAMP' | 'TIMESTAMP WITH TIME ZONE' | 'TIMESTAMP WITHOUT TIME ZONE' | 'DATE' | 'TIME' | 'TIME WITH TIME ZONE' | 'TIME WITHOUT TIME ZONE' :
    T extends Buffer ?
    'BYTEA' :
    T extends object ?
    'POINT' | 'LINE' | 'LSEG' | 'BOX' | 'PATH' | 'POLYGON' | 'CIRCLE' | 'JSON' | 'JSONB' :
    T extends null ?
    PgColumnType :
    never;


const mySQLColumnTypes = {
    // Numeric Types
    tinyInt: 'TINYINT',                 // 1-byte signed integer (-128 to 127)
    smallInt: 'SMALLINT',               // 2-byte signed integer (-32768 to 32767)
    mediumInt: 'MEDIUMINT',             // 3-byte signed integer (-8388608 to 8388607)
    int: 'INT',                         // 4-byte signed integer (-2147483648 to 2147483647)
    bigInt: 'BIGINT',                   // 8-byte signed integer
    decimal: 'DECIMAL',                 // decimal(p, s) - exact numeric of selectable precision
    numeric: 'NUMERIC',                 // numeric(p, s) - exact numeric of selectable precision
    float: 'FLOAT',                     // single precision floating-point number (4 bytes)
    double: 'DOUBLE',                   // double precision floating-point number (8 bytes)
    bit: 'BIT',                         // bit(n) - fixed-length bit string

    // Date/Time Types
    date: 'DATE',                       // calendar date (year, month, day)
    time: 'TIME',                       // time of day (no time zone)
    datetime: 'DATETIME',               // date and time (no time zone)
    timestamp: 'TIMESTAMP',             // date and time (UTC stored)
    year: 'YEAR',                       // year value (1901 to 2155)

    // String Types
    char: 'CHAR',                       // char(n) - fixed-length character string (0-255 bytes)
    varchar: 'VARCHAR',                 // varchar(n) - variable-length character string (0-65535 bytes)
    binary: 'BINARY',                   // binary(n) - fixed-length binary string
    varBinary: 'VARBINARY',             // varbinary(n) - variable-length binary string
    tinyBlob: 'TINYBLOB',               // binary large object (max 255 bytes)
    blob: 'BLOB',                       // binary large object (max 65535 bytes)
    mediumBlob: 'MEDIUMBLOB',           // binary large object (max 16777215 bytes)
    longBlob: 'LONGBLOB',               // binary large object (max 4294967295 bytes)
    tinyText: 'TINYTEXT',               // variable-length string (max 255 bytes)
    text: 'TEXT',                       // variable-length string (max 65535 bytes)
    mediumText: 'MEDIUMTEXT',           // variable-length string (max 16777215 bytes)
    longText: 'LONGTEXT',               // variable-length string (max 4294967295 bytes)
    enum: 'ENUM',                       // enumeration of string values (max 65535 values)
    set: 'SET',                         // set of string values (max 64 members)

    // JSON Type
    json: 'JSON',                       // JSON data

    // Spatial Types
    geometry: 'GEOMETRY',               // any geometry value
    point: 'POINT',                     // a point in 2D space
    lineString: 'LINESTRING',           // a curve with linear interpolation
    polygon: 'POLYGON',                 // a polygon
    multiPoint: 'MULTIPOINT',           // a collection of points
    multiLineString: 'MULTILINESTRING', // a collection of linestrings
    multiPolygon: 'MULTIPOLYGON',       // a collection of polygons
    geometryCollection: 'GEOMETRYCOLLECTION', // a collection of geometry objects
} as const;

type MySQLColumnType = typeof mySQLColumnTypes[keyof typeof mySQLColumnTypes];

type MySQLTypeToJsType<T extends MySQLColumnType> =
    [T] extends ['TINYINT' | 'SMALLINT' | 'MEDIUMINT' | 'INT'] ? number :
    [T] extends ['BIGINT'] ? bigint :
    [T] extends ['DECIMAL' | 'NUMERIC' | 'FLOAT' | 'DOUBLE'] ? number :
    [T] extends ['BIT'] ? boolean :
    [T] extends ['DATE' | 'TIME' | 'DATETIME' | 'TIMESTAMP'] ? Date :
    [T] extends ['YEAR'] ? number :
    [T] extends ['CHAR' | 'VARCHAR' | 'TINYTEXT' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT'] ? string :
    [T] extends ['BINARY' | 'VARBINARY' | 'TINYBLOB' | 'BLOB' | 'MEDIUMBLOB' | 'LONGBLOB'] ? Buffer :
    [T] extends ['ENUM' | 'SET'] ? string :
    [T] extends ['JSON'] ? object :
    [T] extends ['GEOMETRY' | 'POINT' | 'LINESTRING' | 'POLYGON' | 'MULTIPOINT' | 'MULTILINESTRING' | 'MULTIPOLYGON' | 'GEOMETRYCOLLECTION'] ? object :
    never;

type JsTypeToMySQLTypes<T extends DbValueTypes> =
    T extends number ?
    'TINYINT' | 'SMALLINT' | 'MEDIUMINT' | 'INT' | 'DECIMAL' | 'NUMERIC' | 'FLOAT' | 'DOUBLE' | 'YEAR' :
    T extends bigint ?
    'BIGINT' :
    T extends string ?
    'CHAR' | 'VARCHAR' | 'TINYTEXT' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT' | 'ENUM' | 'SET' :
    T extends boolean ?
    'BIT' :
    T extends Date ?
    'DATE' | 'TIME' | 'DATETIME' | 'TIMESTAMP' :
    T extends Buffer ?
    'BINARY' | 'VARBINARY' | 'TINYBLOB' | 'BLOB' | 'MEDIUMBLOB' | 'LONGBLOB' :
    T extends object ?
    'JSON' | 'GEOMETRY' | 'POINT' | 'LINESTRING' | 'POLYGON' | 'MULTIPOINT' | 'MULTILINESTRING' | 'MULTIPOLYGON' | 'GEOMETRYCOLLECTION' :
    T extends null ?
    MySQLColumnType :
    never;

type GetArrayEquivalentPgValueType<T> =
    T extends string | number | bigint | boolean | Date ? T[] :
    T extends object ? object[] :
    T;

type GetValueTypeOfDbType<
    TDbType extends DbType,
    TColType
> =
    [TDbType] extends [PgDbType] ?
    [TColType] extends [PgColumnType] ?
    PgTypeToJsType<TColType> :
    never :
    [TDbType] extends [MySQLDbType] ?
    [TColType] extends [MySQLColumnType] ?
    MySQLTypeToJsType<TColType> :
    never :
    never;

export type {
    PgColumnType,
    PgTypeToJsType,
    JsTypeToPgTypes,
    MySQLColumnType,
    MySQLTypeToJsType,
    JsTypeToMySQLTypes,
    GetArrayEquivalentPgValueType,
    GetValueTypeOfDbType
}

export {
    pgColumnTypes,
    mySQLColumnTypes
}