import { from } from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const subQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereParam")))
    .select((cols, { round, param }) => ([cols.customers.id, round(cols.customers.createdBy, param("roundParam1")).as("roundResult")]))
    .as("sq1");
const multipleFromQuery_WithSubQuery = from(employeesTable.as("employeesAs"), subQuery)
    .select((tab) => [tab.sq1.id])
    .exec
type typeof_MultipleFromQuery_WithSubQuery_ResultType = ReturnType<typeof multipleFromQuery_WithSubQuery>
type typeof_MultipleFromQuery_WithSubQuery_ParamsResult = typeof multipleFromQuery_WithSubQuery extends (param: infer TParams) => any ? TParams : never;
type typeof_MultipleFromQuery_WithSubQuery_ResultType_Expected = { id: number }[]
type typeof_MultipleFromQuery_WithSubQuery_ParamsResult_Expected = { [key: string]: any; } & { whereParam: number | null, roundParam1: number | null }
type multipleFromQuery_WithSubQuery_ResultType_Test = AssertTrue<AssertEqual<typeof_MultipleFromQuery_WithSubQuery_ResultType, typeof_MultipleFromQuery_WithSubQuery_ResultType_Expected>>;
type multipleFromQuery_WithSubQuery_Params_Test = AssertTrue<AssertEqual<typeof_MultipleFromQuery_WithSubQuery_ParamsResult, typeof_MultipleFromQuery_WithSubQuery_ParamsResult_Expected>>

const subQueryJoin = customersTable
    .join('INNER', () => employeesTable, cols => cols.employees.id.eq(cols.customers.id))
    .join('LEFT', () => subQuery, cols => cols.sq1.id.eq(cols.customers.id))
    .select(cols => [cols.sq1.id])    ;

const selectSubQuery = customersTable
    .select((tables) => [
        tables.customers.id,
        ordersTable
            .select((tabInner, { sum }) => [
                sum(tabInner.orders.customerId).as("totalAmount")
            ])
            .where((tabInner) => tables.customers.id.eq(tabInner.orders.customerId))
            .as("sqSelect")
    ])