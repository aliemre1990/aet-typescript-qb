import { customersTable } from "../_tables.js";

const orderByValid_Simple = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .orderBy(cols => [cols.customers.name, [cols.customers.id, 'ASC'], [cols.customers.id, 'DESC']]);