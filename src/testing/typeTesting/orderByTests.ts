import { customersTable, ordersTable, shipmentsTable, usersTable } from "../_tables.js";

/**
 * 
 */
const SimpleOrderByQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .orderBy(cols => [cols.customers.name, [cols.customers.id, 'ASC']]);