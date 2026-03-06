import { withAs, withRecursiveAs } from "../../query/cteObject.js";
import { customersTable, employeesTable, ordersTable } from "../_tables.js";

const cteValid_UsingFrom = withAs("customerCte", customersTable.select((tables) => [tables.customers.id]))
    .from((cteSpecs) => [cteSpecs.customerCte])
    .join('INNER', ordersTable, (tables) => tables.customerCte.id.eq(tables.orders.customerId))
    .select((tables) => [tables.customerCte.id]);

const cteValid_Chaining = withAs("employeesCTE", employeesTable.select())
    .withAs("customersCTE", customersTable.select())
    .from(customersTable)
    .join("LEFT", (ctes) => ctes.employeesCTE, (tbls) => tbls.customers.id.eq(tbls.employeesCTE.id))
    .join("LEFT", (ctes) => ctes.customersCTE, (tbls) => tbls.customers.id.eq(tbls.customersCTE.id))
    .select();

const recursiveCTEValid = withRecursiveAs(
    "subordinates",
    ["id", "name","managerId"],
    employeesTable
        .where((tbl, { param }) => tbl.employees.id.eq(param("id")))
        .select((tbl) => [tbl.employees.id, tbl.employees.name, tbl.employees.managerId]),
    "UNION",
    (self) => {
        return employeesTable
            .select((tables) => [tables.employees.id, tables.employees.name, tables.employees.id])
            .join("INNER", self, (tables) => tables.subordinates.id.eq(tables.employees.managerId));
    }).from((tbls) => [tbls.subordinates])
    .select((tbls) => [tbls.subordinates.id, tbls.subordinates.name]);

