import { pgColumnTypes } from "../table/columnTypes.js";
import Column from "../table/column.js";
import { ForeignKey, pgColumn, pgTable } from "../table/table.js";

const usersTable = pgTable(
    'users',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('userName', pgColumnTypes.varchar, false),
        pgColumn('createdAt', pgColumnTypes.date, false),
    ]
)

const employeesTable = pgTable(
    'employees',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('managerId', pgColumnTypes.int, true),
        pgColumn('name', pgColumnTypes.varchar, false),
        pgColumn('salary', pgColumnTypes.decimal, true),
        pgColumn('deptId', pgColumnTypes.int, false)
    ]
)

const customersTable = pgTable(
    'customers',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('customerTypeId', pgColumnTypes.serial, false),
        pgColumn('name', pgColumnTypes.varchar, false),
        pgColumn('createdBy', pgColumnTypes.int, false),
    ],
    undefined,
    undefined,
    [
        new ForeignKey('createdBy', { table: 'users', column: 'id' }),
        new ForeignKey('customerTypeId', { table: 'customerTypes', column: 'id' })
    ]
);

const customerTypesTable = pgTable(
    'customerTypes',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('name', pgColumnTypes.varchar, false)
    ]
);

const corporateCustomersTable = pgTable(
    'corporateCustomers',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('customerId', pgColumnTypes.int, false),
        pgColumn('companyName', pgColumnTypes.varchar, false),
        pgColumn('registrationNumber', pgColumnTypes.varchar, false),
        pgColumn('taxId', pgColumnTypes.varchar, true)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' })
    ]
);

const individualCustomersTable = pgTable(
    'individualCustomers',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('customerId', pgColumnTypes.int, false),
        pgColumn('firstName', pgColumnTypes.varchar, false),
        pgColumn('lastName', pgColumnTypes.varchar, false),
        pgColumn('dateOfBirth', pgColumnTypes.date, false),
        pgColumn('nationalId', pgColumnTypes.varchar, true),
        pgColumn('driverLicenseNumber', pgColumnTypes.varchar, false),
        pgColumn('driverLicenseExpiry', pgColumnTypes.date, false),
        pgColumn('driverLicenseCountry', pgColumnTypes.varchar, false),
        pgColumn('phoneNumber', pgColumnTypes.varchar, true),
        pgColumn('email', pgColumnTypes.varchar, true),
        pgColumn('emergencyContactName', pgColumnTypes.varchar, true),
        pgColumn('emergencyContactPhone', pgColumnTypes.varchar, true),
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' })
    ]
);


const ordersTable = pgTable(
    'orders',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('customerId', pgColumnTypes.int, false),
        pgColumn('amount', pgColumnTypes.decimal, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const orderDetailsTable = pgTable(
    'orderDetails',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('orderId', pgColumnTypes.int, false),
        pgColumn('amount', pgColumnTypes.decimal, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('orderId', { table: 'orders', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);

const shipmentsTable = pgTable(
    'shipments',
    [
        pgColumn('id', pgColumnTypes.serial, false),
        pgColumn('orderId', pgColumnTypes.serial, false),
        pgColumn('createdBy', pgColumnTypes.int, false)
    ],
    undefined,
    undefined,
    [
        new ForeignKey('customerId', { table: 'customers', column: 'id' }),
        new ForeignKey('createdBy', { table: 'users', column: 'id' })
    ]
);


export {
    customersTable,
    customerTypesTable,
    corporateCustomersTable,
    individualCustomersTable,
    usersTable,
    ordersTable,
    orderDetailsTable,
    shipmentsTable,
    employeesTable
}