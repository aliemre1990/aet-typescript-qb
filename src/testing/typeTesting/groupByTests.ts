import type { Query } from "pg";
import type { IQueryExpression } from "../../query/_interfaces/IQueryExpression.js";
import { customersTable, employeesTable, shipmentsTable, usersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";
import type QueryBuilder from "../../query/queryBuilder.js";
import type { ColumnsToResultMap } from "../../query/_types/result.js";
import type QueryParam from "../../query/param.js";

const groupBy_SingleTable = customersTable
    .groupBy(cols => [cols.customers.id, cols.customers.name])
    .select(cols => [cols.customers.id, cols.customers.name])
    ;
type typeof_GroupBy_SingleTable = typeof groupBy_SingleTable;
type typeof_GroupBy_SingleTable_ResultCols = typeof_GroupBy_SingleTable extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_GroupBy_SingleTable_ResultType = ColumnsToResultMap<any, typeof_GroupBy_SingleTable_ResultCols>;
type typeof_GroupBy_SingleTable_ResultType_Expected = { id: number; name: string; }[];
type groupBy_SingleTable_ResultType_Test = AssertTrue<AssertEqual<typeof_GroupBy_SingleTable_ResultType, typeof_GroupBy_SingleTable_ResultType_Expected>>

const groupBy_MultipleTable = customersTable
    .join('INNER', () => usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', () => shipmentsTable, cols => cols.shipments.id.eq(1))
    .join('INNER', () => employeesTable, cols => cols.shipments.id.eq(1))
    .groupBy(cols => [cols.customers, cols.users.id, cols.shipments, cols.employees.id])
    .select();
type typeof_GroupBy_MultipleTable = typeof groupBy_MultipleTable;
type typeof_GroupBy_MultipleTable_ResultCols = typeof_GroupBy_MultipleTable extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_GroupBy_MultipleTable_ResultType = ColumnsToResultMap<any, typeof_GroupBy_MultipleTable_ResultCols>;
type typeof_GroupBy_MultipleTable_ResultType_Expected = {
    id: number;
    customerTypeId: number;
    name: string;
    createdBy: number;
    userName: string;
    createdAt: Date;
    orderId: number;
    managerId: number | null;
    position: string | null;
    salary: number | null;
    deptId: number;
}[];
type groupBy_MultipleTable_ResultType_Test = AssertTrue<AssertEqual<typeof_GroupBy_MultipleTable_ResultType, typeof_GroupBy_MultipleTable_ResultType_Expected>>

const groupBy_Aggregation = customersTable
    .join('INNER', () => usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', () => shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy(cols => [cols.customers, cols.users.id])
    .select((cols, { sum }) => [
        cols.customers.id,
        sum(cols.shipments.orderId).as("totalOrderId")
    ]);
type typeof_GroupBy_Aggregation = typeof groupBy_Aggregation;
type typeof_GroupBy_Aggregation_ResultCols = typeof_GroupBy_Aggregation extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_GroupBy_Aggregation_ResultType = ColumnsToResultMap<any, typeof_GroupBy_Aggregation_ResultCols>;
type typeof_GroupBy_Aggregation_ResultType_Expected = { id: number; totalOrderId: number; }[];
type groupBy_Aggregation_ResultType_Test = AssertTrue<AssertEqual<typeof_GroupBy_Aggregation_ResultType, typeof_GroupBy_Aggregation_ResultType_Expected>>

const groupBy_Having = customersTable
    .join('INNER', () => usersTable, cols => cols.users.id.eq(cols.customers.createdBy))
    .join('INNER', () => shipmentsTable, cols => cols.shipments.id.eq(1))
    .groupBy((cols) => {
        return [cols.customers, cols.users.id]
    })
    .having((cols, { param, sum, and }) => and(cols.customers.id.eq(param("havingParam")), sum(cols.shipments.id).eq(param("sumParam"))))
    .select();
type typeof_GroupBy_Having = typeof groupBy_Having;
type typeof_GroupBy_Having_ResultCols = typeof_GroupBy_Having extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_GroupBy_Having_ResultType = ColumnsToResultMap<any, typeof_GroupBy_Having_ResultCols>;
type typeof_GroupBy_Having_Params = typeof_GroupBy_Having extends QueryBuilder<any, any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_GroupBy_Having_Param1Name = typeof_GroupBy_Having_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_GroupBy_Having_Param2Name = typeof_GroupBy_Having_Params[1] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_GroupBy_Having_ResultType_Expected = {
    id: number;
    customerTypeId: number;
    name: string;
    userName: string;
    createdAt: Date;
    orderId: number;
    createdBy: number;
}[];
type groupBy_Having_ResultType_Test = AssertTrue<AssertEqual<typeof_GroupBy_Having_ResultType, typeof_GroupBy_Having_ResultType_Expected>>;
type groupBy_Having_ParamsLength_Test = AssertTrue<AssertEqual<typeof_GroupBy_Having_Params["length"], 2>>;
type groupBy_Having_Param1Name_Test = AssertTrue<AssertEqual<typeof_GroupBy_Having_Param1Name, "havingParam">>;
type groupBy_Having_Param2Name_Test = AssertTrue<AssertEqual<typeof_GroupBy_Having_Param2Name, "sumParam">>;

