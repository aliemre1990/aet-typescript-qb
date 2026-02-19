import { dbTypes, type PgDbType } from "../db.js";
import ColumnsSelection, { columnsSelectionFactory } from "../query/ColumnsSelection.js";
import QueryColumn from "../query/queryColumn.js";
import QueryTable from "../query/queryTable.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { customersTable } from "./_tables.js";

const customersQueryColumns = customersTable
    .columnsList
    .map(cl => new QueryColumn(dbTypes.postgresql, cl, { tableName: customersTable.name })) as MapToQueryColumns<PgDbType, typeof customersTable.name, typeof customersTable.columnsList>;
const customersQueryTable = new QueryTable<
    PgDbType,
    typeof customersTable.columnsList,
    typeof customersTable.name,
    typeof customersTable,
    typeof customersQueryColumns
>(dbTypes.postgresql, customersTable, customersQueryColumns)

const customersColumnsSelection = columnsSelectionFactory<PgDbType>(customersQueryTable, customersQueryTable.columnsList) as ColumnsSelection<PgDbType, typeof customersQueryTable, typeof customersQueryTable.columnsList>;

export {
    customersColumnsSelection
}