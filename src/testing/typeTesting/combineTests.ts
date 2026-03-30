import { withAs } from "../../query/withAs.js";
import { customersTable, employeesTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const unionWithError1 = customersTable.select((tables) => [tables.customers.id, tables.customers.name])
    .unionAll(
        // @ts-expect-error: Column count mismatch
        customersTable.select((tablesInner) => [tablesInner.customers.id])
    )

const unionWithError2 = customersTable.select((tables) => [tables.customers.id, tables.customers.name])
    .unionAll(
        // @ts-expect-error: Column type mismatch
        customersTable.select((tablesInner) => [tablesInner.customers.id, tablesInner.customers.id])
    )

const unionValid_SelectViaTableAlias_BothSide = customersTable
    .select((tbls) => [tbls.customers])
    .union(
        () => customersTable
            .where((tbls, { param }) => tbls.customers.customerTypeId.sqlIn(param("inParam")))
            .select(tbls2 => [tbls2.customers])
    );

const unionValid_SelectViaAllColumns_BothSide = customersTable
    .select()
    .union(
        () => customersTable
            .where((tbls, { param }) => tbls.customers.customerTypeId.sqlIn(param("inParam")))
            .select()
    );


const unionValid_SelectViaAllColumns_Main = customersTable
    .select()
    .union(
        () => customersTable
            .where((tbls, { param }) => tbls.customers.customerTypeId.sqlIn(param("inParam")))
            .select((tables) => [
                tables.customers.id,
                tables.customers.customerTypeId,
                tables.customers.name,
                tables.customers.createdBy
            ])
    );

const unionValid_NullableResult = customersTable
    .select((tables) => [tables.customers.id, tables.customers.name])
    .unionAll(() => employeesTable.select((tablesInner) => [tablesInner.employees.salary, tablesInner.employees.name]));
type typeof_UnionValid_NullableResult_Result = (typeof unionValid_NullableResult.exec) extends () => Array<infer TResult> ? TResult : never;
type expected_UnionValid_NullableResult_Result = { id: number | null, name: string };
type unionValid_NullableResult_Test = AssertTrue<AssertEqual<typeof_UnionValid_NullableResult_Result, expected_UnionValid_NullableResult_Result>>;

const unionValid_NullableResult_NullBefore = customersTable
    .select((tables, { literal }) => [literal(null).as("nullable"), tables.customers.name])
    .unionAll(() => employeesTable.select((tablesInner) => [tablesInner.employees.salary, tablesInner.employees.name]));
type typeof_UnionValid_NullableResult_NullBefore_Result = (typeof unionValid_NullableResult_NullBefore.exec) extends () => Array<infer TResult> ? TResult : never;
type expected_UnionValid_NullableResult_NullBefore_Result = { nullable: number | null, name: string };
type unionValid_NullableResult_NullBefore_Test = AssertTrue<AssertEqual<typeof_UnionValid_NullableResult_NullBefore_Result, expected_UnionValid_NullableResult_NullBefore_Result>>;

const unionValid_WithCTE = withAs("cteTable", customersTable.select())
    .from((ctes) => [ctes.cteTable])
    .select((tables) => [tables.cteTable.id, tables.cteTable.name])
    .unionAll(() => customersTable.select((tables) => [tables.customers.id, tables.customers.name]));