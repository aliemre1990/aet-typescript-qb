import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, customerNameQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester, roundTester } from "../../_functions.js";
import { customersTable, employeesTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";

const likeValue = customerNameQC.like("A%");

// @ts-expect-error
const likeInvalidValue = customerNameQC.like(1);

// @ts-expect-error
const likeInvalidComparable = empSalaryQC.like("A%");

const likeLiteral = customerNameQC.like(literalTester("A%"));

const likeComparable = customerNameQC.like(customerNameQC);

// @ts-expect-error
const likeFunction = customerNameQC.like(roundTester(1, 2));

const likeQueryBuilder = customerNameQC.like(customersTable.select((cols) => [cols.customers.name]));

const likeQueryBuilder_Nullable = customerNameQC.like(employeesTable.select((cols) => [cols.employees.position]));

const likeParam = customerNameQC.like(paramTester("name"));
type typeof_LikeParam = typeof likeParam;
type typeof_LikeParam_Applied = typeof_LikeParam extends ColumnComparisonOperation<any, any, infer TApplied, any, any, any, any> ? TApplied : never;
type typeof_LikeParam_Applied_ParamType = typeof_LikeParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type likeParam_Test = AssertTrue<AssertEqual<typeof_LikeParam_Applied_ParamType, string>>;

const likeNullableParam = customerNameQC.like(paramTester("name").type<string | null>());
type typeof_LikeNullableParam = typeof likeNullableParam;
type typeof_LikeNullableParam_Applied = typeof_LikeNullableParam extends ColumnComparisonOperation<any, any, infer TApplied, any, any, any, any> ? TApplied : never;
type typeof_LikeNullableParam_Applied_ParamType = typeof_LikeNullableParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type likeNullableParam_Test = AssertTrue<AssertEqual<typeof_LikeNullableParam_Applied_ParamType, string | null>>;