import type BaseColumnComparisonOperation from "../../../query/_baseClasses/BaseColumnComparisonOperation.js";
import type LikeColumnComparisonOperation from "../../../query/comparisons/_likeColumnComparisonOperation.js";
import type QueryParam from "../../../query/param.js";
import { customerNameQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester, roundTester } from "../../_functions.js";
import { customersTable, employeesTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";

const likeValue = customerNameQC.like("A%");

// @ts-expect-error
const likeInvalidValue = customerNameQC.like(1);

// @ts-expect-error
const likeInvalid_InvalidExpressionType = empSalaryQC.like("A%");

const likeLiteral = customerNameQC.like(literalTester("A%"));

const likeColumn = customerNameQC.like(customerNameQC);

// @ts-expect-error
const likeFunction = customerNameQC.like(roundTester(1, 2));

const likeQueryBuilder = customerNameQC.like(customersTable.select((cols) => [cols.customers.name]));


const likeParam = customerNameQC.like(paramTester("name"));
type typeof_LikeParam = typeof likeParam;
type typeof_LikeParam_Applied = typeof_LikeParam extends LikeColumnComparisonOperation<any, any, infer TApplied, any, any, any> ? TApplied : never;
type typeof_LikeParam_Applied_ReturnType = typeof_LikeParam extends BaseColumnComparisonOperation<any, any, any, any, infer TFinalValueType, any, any> ? TFinalValueType : never;
type typeof_LikeParam_Applied_ParamType = typeof_LikeParam_Applied extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type likeParam_Test = AssertTrue<AssertEqual<typeof_LikeParam_Applied_ParamType, string>>;
type likeParam_ReturnTypeTest = AssertTrue<AssertEqual<typeof_LikeParam_Applied_ReturnType, boolean>>;

const likeNullableParam = customerNameQC.like(paramTester("name").type<string | null>());
type typeof_LikeNullableParam = typeof likeNullableParam;
type typeof_LikeNullableParam_Applied = typeof_LikeNullableParam extends LikeColumnComparisonOperation<any, any, infer TApplied, any, any, any> ? TApplied : never;
type typeof_LikeNullableParam_ReturnType = typeof_LikeNullableParam extends BaseColumnComparisonOperation<any, any, any, any, infer TFinalValueType, any, any> ? TFinalValueType : never;
type typeof_LikeNullableParam_Applied_ParamType = typeof_LikeNullableParam_Applied extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type likeNullableParam_Test = AssertTrue<AssertEqual<typeof_LikeNullableParam_Applied_ParamType, string | null>>;
type likeNullableParam_ReturnTypeTest = AssertTrue<AssertEqual<typeof_LikeNullableParam_ReturnType, boolean | null>>;

const likeQueryBuilder_Nullable = customerNameQC.like(employeesTable.select((cols) => [cols.employees.position]));
type typeof_LikeQueryBuilder_Nullable = typeof likeQueryBuilder_Nullable;
type typeof_LikeQueryBuilder_Nullable_ReturnType = typeof_LikeQueryBuilder_Nullable extends BaseColumnComparisonOperation<any, any, any, any, infer TFinalValueType, any, any> ? TFinalValueType : never;
type likeQueryBuilder_Nullable_ReturnTypeTest = AssertTrue<AssertEqual<typeof_LikeQueryBuilder_Nullable_ReturnType, boolean | null>>;