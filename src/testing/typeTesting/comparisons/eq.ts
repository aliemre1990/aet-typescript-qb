import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester, roundTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

//
const eqToValue = customerIdQC.eq(1);
//@ts-expect-error
const eqToInvalidValue = customerIdQC.eq("ali");
//
const eqToParam = customerIdQC.eq(paramTester("num"));
type typeof_EqToParam = typeof eqToParam;
type typeof_EqToParam_Applied = typeof_EqToParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_EqToParam_AppliedParam = typeof_EqToParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type eqToParam_Test = AssertTrue<AssertEqual<typeof_EqToParam_AppliedParam, number | null>>;
//
const eqToComparable = customerIdQC.eq(empSalaryQC);
//
const eqToLiteral = customerIdQC.eq(literalTester(1));
//
const eqToParamTyped = customerIdQC.eq(paramTester("num").type<number>());
type typeof_EqToParamTyped = typeof eqToParamTyped;
type typeof_EqToParamTyped_Applied = typeof_EqToParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_EqToParamTyped_AppliedParam = typeof_EqToParamTyped_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type EqToParamTypedTest = AssertTrue<AssertEqual<typeof_EqToParamTyped_AppliedParam, number>>;
// @ts-expect-error
const eqToInvalidParam = customerIdQC.eq(paramTester("num").type<string>());

//
let var1: 1 | null = 1;
const literalEqToNullableVar = literalTester(1).eq(var1);
//
const literalEqToValue = literalTester(1).eq(1);
//
const literalEqToColumn = literalTester(1).eq(customerIdQC);
//
const literalEqToLiteral = literalTester(1).eq(literalTester(2));
//
const literalEqToParam = literalTester(1).eq(paramTester("num"));
type typeof_LiteralEqToParam = typeof literalEqToParam;
type typeof_LiteralEqToParam_Applied = typeof_LiteralEqToParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_LiteralEqToParam_AppliedParam = typeof_LiteralEqToParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type literalEqToParam_Test = AssertTrue<AssertEqual<typeof_LiteralEqToParam_AppliedParam, number | null>>;
//
const literalEqToParamTyped = literalTester(1).eq(paramTester("num").type<number>());
type typeof_LiteralEqToParamTyped = typeof literalEqToParamTyped;
type typeof_LiteralEqToParamTyped_Applied = typeof_LiteralEqToParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_LiteralEqToParamTyped_AppliedParam = typeof_LiteralEqToParamTyped_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type literalEqToParamTyped_Test = AssertTrue<AssertEqual<typeof_LiteralEqToParamTyped_AppliedParam, number>>;
// @ts-expect-error
const literalEqToInvalidParam = literalTester(1).eq(paramTester("num").type<string>());

const functionEqToVal_Valid = roundTester(1, 2).eq(1);
const functionEqToCol_Valid = roundTester(1, 2).eq(empSalaryQC);
const functionEqToFunction_Valid = roundTester(1, 2).eq(roundTester(1, paramTester("param")));
// @ts-expect-error
const functionEqToVal_Invalid = roundTester(1, 2).eq("ali");