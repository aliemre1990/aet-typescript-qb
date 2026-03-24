import "./moduleInitialization.js"

import { dbTypes, type PgDbType } from "./db.js";
import QueryColumn from "./query/queryColumn.js";
import { customersTable } from "./testing/_tables.js";

const customerIdQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.id,
    NonNullable<typeof customersTable.columns.id.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.id,
    { tableName: customersTable.name },
    undefined,
    undefined
);


customerIdQC.eq(1);

export * from './table/table.js';

export * from './query/_index.js'