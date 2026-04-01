import { dbTypes, type PgDbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import { customersTable, employeesTable } from "./_tables.js";


const customerIdQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.id.name,
    typeof customersTable.columns.id.tableSpecs & { asTableName: undefined },
    typeof customersTable.columns.id.value,
    typeof customersTable.columns.id.finalValue
>(
    dbTypes.postgresql,
    customersTable.columns.id.name,
    { tableName: customersTable.name, asTableName: undefined },
    undefined,
    undefined
);
const customerCreatedByQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.createdBy.name,
    typeof customersTable.columns.createdBy.tableSpecs & { asTableName: undefined },
    typeof customersTable.columns.createdBy.value,
    typeof customersTable.columns.createdBy.finalValue
>(
    dbTypes.postgresql,
    customersTable.columns.createdBy.name,
    { tableName: customersTable.name, asTableName: undefined },
    undefined,
    undefined
);
const customerNameQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.name.name,
    typeof customersTable.columns.name.tableSpecs & { asTableName: undefined },
    typeof customersTable.columns.name.value,
    typeof customersTable.columns.name.finalValue,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.name.name,
    { tableName: customersTable.name, asTableName: undefined },
    undefined,
    undefined
);

const empPositionQC = new QueryColumn<
    PgDbType,
    typeof employeesTable.columns.position.name,
    typeof employeesTable.columns.position.tableSpecs & { asTableName: undefined },
    typeof employeesTable.columns.position.value,
    typeof employeesTable.columns.position.finalValue,
    undefined
>(
    dbTypes.postgresql,
    employeesTable.columns.position.name,
    { tableName: employeesTable.name, asTableName: undefined },
    undefined,
    undefined
);

const empSalaryQC = new QueryColumn<
    PgDbType,
    typeof employeesTable.columns.salary.name,
    typeof employeesTable.columns.salary.tableSpecs & { asTableName: undefined },
    typeof employeesTable.columns.salary.value,
    typeof employeesTable.columns.salary.finalValue,
    undefined
>(
    dbTypes.postgresql,
    employeesTable.columns.salary.name,
    { tableName: employeesTable.name, asTableName: undefined },
    undefined,
    undefined
);

export {
    customerIdQC,
    customerCreatedByQC,
    customerNameQC,
    empSalaryQC,
    empPositionQC
}

