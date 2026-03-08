import type { ColumnsToResultMap } from "../../query/_types/result.js";
import { withAs, withRecursiveAs } from "../../query/cteObject.js";
import type QueryParam from "../../query/param.js";
import QueryBuilder, { from } from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

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
type typeof_CTEValid_Chaining = typeof cteValid_Chaining;
type typeof_CTEValid_Chaining_ResultCols = typeof_CTEValid_Chaining extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_CTEValid_Chaining_ResultType = ColumnsToResultMap<any, typeof_CTEValid_Chaining_ResultCols>;
type typeof_CTEValid_Chaining_ResultType_Expected = { id: number; customerTypeId: number; name: string; managerId: number | null; salary: number | null; deptId: number; createdBy: number; }[];
type cteValid_Chaining_ResultType_Test = AssertTrue<AssertEqual<typeof_CTEValid_Chaining_ResultType, typeof_CTEValid_Chaining_ResultType_Expected>>;

const recursiveCTEValid_Regular = withRecursiveAs(
    "subordinates",
    ["id", "name", "managerId"],
    employeesTable
        .where((tbl, { param }) => tbl.employees.id.eq(param("employeeId")))
        .select((tbl) => [tbl.employees.id, tbl.employees.name, tbl.employees.managerId]),
    "UNION",
    (self) => {
        return employeesTable
            .select((tables) => [tables.employees.id, tables.employees.name, tables.employees.id])
            .join("INNER", self, (tables) => tables.subordinates.id.eq(tables.employees.managerId));
    })
    .from((tbls) => [tbls.subordinates])
    .select((tbls) => [tbls.subordinates.id, tbls.subordinates.name]);
type typeof_RecursiveCTEValid_Regular = typeof recursiveCTEValid_Regular;
type typeof_RecursiveCTEValid_Regular_Params = typeof_RecursiveCTEValid_Regular extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_RecursiveCTEValid_Regular_Param1_Name = typeof_RecursiveCTEValid_Regular_Params[0] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_RecursiveCTEValid_Regular_ResultCols = typeof_RecursiveCTEValid_Regular extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_RecursiveCTEValid_Regular_ResultType = ColumnsToResultMap<any, typeof_RecursiveCTEValid_Regular_ResultCols>;
type typeof_RecursiveCTEValid_Regular_ResultType_Expected = { id: number; name: string; }[]
type recursiveCTEValid_Regular_ParamsLength_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Regular_Params["length"], 1>>;
type recursiveCTEValid_Regular_Param1_Name_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Regular_Param1_Name, "employeeId">>;
type recursiveCTEValid_Regular_ResultType_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Regular_ResultType, typeof_RecursiveCTEValid_Regular_ResultType_Expected>>;


const recursiveCTEValid_Chained =
    withAs("employeesCTE", employeesTable.select().where((tables, { param }) => tables.employees.id.eq(param("employeeId"))))
        .withRecursiveAs(
            "subordinates",
            ["id", "name", "managerId"],
            employeesTable
                .where((tbl, { param }) => tbl.employees.id.eq(param("employeeId2")))
                .select((tbl) => [tbl.employees.id, tbl.employees.name, tbl.employees.managerId]),
            "UNION",
            (self, tables) => {
                return from(tables.employeesCTE)
                    .select((tablesInner) => [tablesInner.employeesCTE.id, tablesInner.employeesCTE.name, tablesInner.employeesCTE.managerId])
                    .join("INNER", self, (tablesInner) => tablesInner.subordinates.id.eq(tablesInner.employeesCTE.managerId));
            })
        .from((tbls) => [tbls.subordinates])
        .select((tbls) => [tbls.subordinates.id, tbls.subordinates.name]);
type typeof_RecursiveCTEValid_Chained = typeof recursiveCTEValid_Chained;
type typeof_RecursiveCTEValid_Chained_Params = typeof_RecursiveCTEValid_Chained extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : "a";
type typeof_RecursiveCTEValid_Chained_Param1_Name = typeof_RecursiveCTEValid_Chained_Params[0] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_RecursiveCTEValid_Chained_Param2_Name = typeof_RecursiveCTEValid_Chained_Params[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_RecursiveCTEValid_Chained_ResultCols = typeof_RecursiveCTEValid_Chained extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_RecursiveCTEValid_Chained_ResultType = ColumnsToResultMap<any, typeof_RecursiveCTEValid_Chained_ResultCols>;
type typeof_RecursiveCTEValid_Chained_ResultType_Expected = { id: number; name: string; }[]
type recursiveCTEValid_Chained_ParamsLength_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Chained_Params["length"], 2>>;
type recursiveCTEValid_Chained_Param1_Name_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Chained_Param1_Name, "employeeId">>;
type recursiveCTEValid_Chained_Param2_Name_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Chained_Param2_Name, "employeeId2">>;
type recursiveCTEValid_Chained_ResultType_Test = AssertTrue<AssertEqual<typeof_RecursiveCTEValid_Chained_ResultType, typeof_RecursiveCTEValid_Chained_ResultType_Expected>>;
