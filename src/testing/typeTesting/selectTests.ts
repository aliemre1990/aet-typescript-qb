import type { ColumnsToResultMap } from "../../query/_types/result.js";
import from from "../../query/from.js";
import type QueryParam from "../../query/param.js";
import type QueryBuilder from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable, shipmentsTable, usersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const selectAll_SingleTable = customersTable.select();
type typeof_SelectAll_SingleTable = typeof selectAll_SingleTable;
type typeof_SelectAll_SingleTable_ResultCols = typeof_SelectAll_SingleTable extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectAll_SingleTable_ResultType = ColumnsToResultMap<any, typeof_SelectAll_SingleTable_ResultCols>;
type typeof_SelectAll_SingleTable_ResultType_Expected = { id: number; customerTypeId: number; name: string; createdBy: number }[];
type selectAll_SingleTable_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectAll_SingleTable_ResultType, typeof_SelectAll_SingleTable_ResultType_Expected>>

const selectViaTableAlias_SingleTable = customersTable.select((cols) => [cols.customers]);
type typeof_SelectViaTableAlias_SingleTable = typeof selectViaTableAlias_SingleTable;
type typeof_SelectViaTableAlias_SingleTable_ResultCols = typeof_SelectViaTableAlias_SingleTable extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectViaTableAlias_SingleTable_ResultType = ColumnsToResultMap<any, typeof_SelectViaTableAlias_SingleTable_ResultCols>;
type typeof_SelectViaTableAlias_SingleTable_ResultType_Expected = { id: number; customerTypeId: number; name: string; createdBy: number }[];
type selectViaTableAlias_SingleTable_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectViaTableAlias_SingleTable_ResultType, typeof_SelectViaTableAlias_SingleTable_ResultType_Expected>>

const selectWhere_WithParams = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .select(cols => [cols.customers.id, cols.customers.name, cols.customers.createdBy]);
type typeof_SelectWhere_WithParams = typeof selectWhere_WithParams;
type typeof_SelectWhere_WithParams_ResultCols = typeof_SelectWhere_WithParams extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectWhere_WithParams_ResultType = ColumnsToResultMap<any, typeof_SelectWhere_WithParams_ResultCols>;
type typeof_SelectWhere_WithParams_Params = typeof selectWhere_WithParams extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_SelectWhere_WithParams_Param1Name = typeof_SelectWhere_WithParams_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_SelectWhere_WithParams_ResultType_Expected = { id: number; name: string; createdBy: number }[];
type selectWhere_WithParams_ParamsLength_Test = AssertTrue<AssertEqual<typeof_SelectWhere_WithParams_Params["length"], 1>>;
type selectWhere_WithParams_Param1Name_Test = AssertTrue<AssertEqual<typeof_SelectWhere_WithParams_Param1Name, "whereparam">>;
type selectWhere_WithParams_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectWhere_WithParams_ResultType, typeof_SelectWhere_WithParams_ResultType_Expected>>

const singleTableSelect_WithTableAlias = customersTable.as("cst").select();
type typeof_SingleTableSelect_WithTableAlias = typeof singleTableSelect_WithTableAlias;
type typeof_SingleTableSelect_WithTableAlias_ResultCols = typeof_SingleTableSelect_WithTableAlias extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SingleTableSelect_WithTableAlias_ResultType = ColumnsToResultMap<any, typeof_SingleTableSelect_WithTableAlias_ResultCols>;
type typeof_SingleTableSelect_WithTableAlias_ResultType_Expected = { id: number; customerTypeId: number; name: string; createdBy: number }[];
type singleTableSelect_WithTableAlias_ResultType_Test = AssertTrue<AssertEqual<typeof_SingleTableSelect_WithTableAlias_ResultType, typeof_SingleTableSelect_WithTableAlias_ResultType_Expected>>

const selectWithJoins = customersTable
    .join('INNER', () => usersTable, (cols) => cols.users.id.eq(cols.customers.createdBy))
    .select(cols => ([
        cols.users.id.as("userId"),
        cols.users.userName,
        cols.users.createdAt.as("userCreatedAt"),
        cols.customers.id.as("customerId"),
        cols.customers.name.as("customerName"),
        cols.customers.createdBy.as("customerCreatedBy")
    ]));
type typeof_SelectWithJoins = typeof selectWithJoins;
type typeof_SelectWithJoins_ResultCols = typeof_SelectWithJoins extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectWithJoins_ResultType = ColumnsToResultMap<any, typeof_SelectWithJoins_ResultCols>;
type typeof_SelectWithJoins_ResultType_Expected = { userId: number, userName: string, userCreatedAt: Date, customerId: number, customerName: string, customerCreatedBy: number }[];
type selectWithJoins_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectWithJoins_ResultType, typeof_SelectWithJoins_ResultType_Expected>>

const selectWithJoins_UsingTableAlias = customersTable.as("cst")
    .join("INNER", () => usersTable, (cols) => cols.users.id.eq(cols.cst.createdBy))
    .select(cols => ([
        cols.users.id.as("userId"),
        cols.users.userName,
        cols.users.createdAt.as("userCreatedAt"),
        cols.cst.id.as("cstId"),
        cols.cst.name.as("cstName"),
        cols.cst.createdBy.as("cstCreatedBy")
    ]));
type typeof_SelectWithJoins_UsingTableAlias = typeof selectWithJoins_UsingTableAlias;
type typeof_SelectWithJoins_UsingTableAlias_ResultCols = typeof_SelectWithJoins_UsingTableAlias extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectWithJoins_UsingTableAlias_ResultType = ColumnsToResultMap<any, typeof_SelectWithJoins_UsingTableAlias_ResultCols>;
type typeof_SelectWithJoins_UsingTableAlias_ResultType_Expected = { userId: number, userName: string, userCreatedAt: Date, cstId: number, cstName: string, cstCreatedBy: number }[];
type selectWithJoins_UsingTableAlias_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectWithJoins_UsingTableAlias_ResultType, typeof_SelectWithJoins_UsingTableAlias_ResultType_Expected>>

const selectWithParams = customersTable.select((cols, { round, param }) => [
    cols.customers.id,
    round(cols.customers.createdBy, param("roundParam1")).as("roundResult")
]);
type typeof_SelectWithParams = typeof selectWithParams;
type typeof_SelectWithParams_ResultCols = typeof_SelectWithParams extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectWithParams_ResultType = ColumnsToResultMap<any, typeof_SelectWithParams_ResultCols>;
type typeof_SelectWithParams_Params = typeof selectWithParams extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_SelectWithParams_Param1Name = typeof_SelectWithParams_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_SelectWithParams_ResultType_Expected = { id: number; roundResult: number | null }[];
type selectWithParams_ParamsLength_Test = AssertTrue<AssertEqual<typeof_SelectWithParams_Params["length"], 1>>;
type selectWithParams_Param1Name_Test = AssertTrue<AssertEqual<typeof_SelectWithParams_Param1Name, "roundParam1">>;
type selectWithParams_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectWithParams_ResultType, typeof_SelectWithParams_ResultType_Expected>>

const selectWithJSONBuildObject = customersTable
    .join("INNER", () => ordersTable, (cols) => cols.orders.customerId.eq(cols.customers.id))
    .select((cols, { jsonBuildObject }) => [
        cols.customers.id,
        jsonBuildObject(cols.orders).as("ordersObj")
    ]);
type typeof_SelectWithJSONBuildObject = typeof selectWithJSONBuildObject;
type typeof_SelectWithJSONBuildObject_ResultCols = typeof_SelectWithJSONBuildObject extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_SelectWithJSONBuildObject_ResultType = ColumnsToResultMap<any, typeof_SelectWithJSONBuildObject_ResultCols>;
type typeof_SelectWithJSONBuildObject_ResultType_Expected = { id: number; ordersObj: { id: number; customerId: number; amount: number; createdBy: number } }[];
type selectWithJSONBuildObject_ResultType_Test = AssertTrue<AssertEqual<typeof_SelectWithJSONBuildObject_ResultType, typeof_SelectWithJSONBuildObject_ResultType_Expected>>

const selectComparison = customersTable.select((cols) => [
    cols.customers.id.eq(1).as("idEquals1")
]);
type typeof_selectComparison = typeof selectComparison;
type typeof_selectComparison_ResultCols = typeof_selectComparison extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_selectComparison_ResultType = ColumnsToResultMap<any, typeof_selectComparison_ResultCols>;
type typeof_selectComparison_ResultType_Expected = { "idEquals1": boolean }[];
type selectComparison_ResultType_Test = AssertTrue<AssertEqual<typeof_selectComparison_ResultType, typeof_selectComparison_ResultType_Expected>>

const selectLogical = customersTable.select((cols, { and }) => [
    and(cols.customers.id.eq(1), cols.customers.name.eq("Jane")).as("idEquals1AndNameEqualsJane")
]);
type typeof_selectLogical = typeof selectLogical;
type typeof_selectLogical_ResultCols = typeof_selectLogical extends QueryBuilder<any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_selectLogical_ResultType = ColumnsToResultMap<any, typeof_selectLogical_ResultCols>;
type typeof_selectLogical_ResultType_Expected = { "idEquals1AndNameEqualsJane": boolean }[];
type selectLogical_ResultType_Test = AssertTrue<AssertEqual<typeof_selectLogical_ResultType, typeof_selectLogical_ResultType_Expected>>;

const selectInvalid_WithoutAliasOrName = customersTable.select((cols) =>
    [
        // @ts-expect-error
        cols.customers.id.eq(1)
    ]);

const selectInvalid_WithoutAliasOrName_QueryTable = customersTable.as("cst").select((cols) =>
    [
        // @ts-expect-error
        cols.cst.id.eq(1)
    ]);

const selectInvalid_WithoutAliasOrName_SubQuery = from(customersTable.select().as("sub")).select((cols) =>
    [
        // @ts-expect-error
        cols.sub.id.eq(1)
    ]);