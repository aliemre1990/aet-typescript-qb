import type { IQueryExpression } from "../../../query/_interfaces/IQueryExpression.js";
import type BasicColumnComparisonOperation from "../../../query/comparisons/_basicColumnComparisonOperation.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, empPositionQC, empSalaryQC } from "../../_columns.js";
import { literalTester, paramTester, roundTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";

//
const eqToValue = customerIdQC.eq(1);
//@ts-expect-error
const eqToInvalidValue = customerIdQC.eq("ali");
//
const eqToParam = customerIdQC.eq(paramTester("num"));
type typeof_EqToParam = typeof eqToParam;
type typeof_EqToParam_Value = typeof_EqToParam extends BasicColumnComparisonOperation<any, any, infer TValue, any, any, any> ? TValue : never;
type typeof_EqToParam_ParamType = typeof_EqToParam_Value extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type eqToParam_Test = AssertTrue<AssertEqual<typeof_EqToParam_ParamType, number | null>>;
//
const eqToColumn = customerIdQC.eq(empSalaryQC);
//
const eqToLiteral = customerIdQC.eq(literalTester(1));
//
const eqToParamTyped = customerIdQC.eq(paramTester("num").type<number>());
type typeof_EqToParamTyped = typeof eqToParamTyped;
type typeof_EqToParamTyped_Value = typeof_EqToParamTyped extends BasicColumnComparisonOperation<any, any, infer TValue, any, any, any> ? TValue : never;
type typeof_EqToParamTyped_ParamType = typeof_EqToParamTyped_Value extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type EqToParamTypedTest = AssertTrue<AssertEqual<typeof_EqToParamTyped_ParamType, number>>;
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
//
const literalEqToParam = literalTester(1).eq(paramTester("num"));
type typeof_LiteralEqToParam = typeof literalEqToParam;
type typeof_LiteralEqToParam_Value = typeof_LiteralEqToParam extends BasicColumnComparisonOperation<any, any, infer TValue, any, any, any> ? TValue : never;
type typeof_LiteralEqToParam_ParamType = typeof_LiteralEqToParam_Value extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type literalEqToParam_Test = AssertTrue<AssertEqual<typeof_LiteralEqToParam_ParamType, number | null>>;
//
const literalEqToParamTyped = literalTester(1).eq(paramTester("num").type<number>());
type typeof_LiteralEqToParamTyped = typeof literalEqToParamTyped;
type typeof_LiteralEqToParamTyped_Value = typeof_LiteralEqToParamTyped extends BasicColumnComparisonOperation<any, any, infer TValue, any, any, any> ? TValue : never;
type typeof_LiteralEqToParamTyped_ParamType = typeof_LiteralEqToParamTyped_Value extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type literalEqToParamTyped_Test = AssertTrue<AssertEqual<typeof_LiteralEqToParamTyped_ParamType, number>>;
// @ts-expect-error
const literalEqToInvalidParam = literalTester(1).eq(paramTester("num").type<string>());

const functionEqToVal_Valid = roundTester(1, 2).eq(1);
const functionEqToCol_Valid = roundTester(1, 2).eq(empSalaryQC);
const functionEqToFunction_Valid = roundTester(1, 2).eq(roundTester(1, paramTester("param")));
// @ts-expect-error
const functionEqToVal_Invalid = roundTester(1, 2).eq("ali");

const colEqToParam_WithCast = customerIdQC.eq(paramTester("num").type<number>().cast("VARCHAR"));
type typeof_ColEqToParam_WithCast = typeof colEqToParam_WithCast;
type typeof_ColEqToParam_WithCast_Value = typeof_ColEqToParam_WithCast extends BasicColumnComparisonOperation<any, any, infer TValue, any, any, any> ? TValue : never;
type typeof_ColEqToParam_WithCast_ParamType = typeof_ColEqToParam_WithCast_Value extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_ColEqToParam_WithCast_ParamCastType = typeof_ColEqToParam_WithCast_Value extends QueryParam<any, any, any, any, infer TCastType> ? TCastType : never;
type colEqToParam_WithCast_ParamType_Test = AssertTrue<AssertEqual<typeof_ColEqToParam_WithCast_ParamType, number>>;
type colEqToParam_WithCast_ParamCastType_Test = AssertTrue<AssertEqual<typeof_ColEqToParam_WithCast_ParamCastType, "VARCHAR">>;

const eqToNull = customerIdQC.eq(null);
type typeof_EqToNull = typeof eqToNull;
type typeof_EqToNull_ValueType = typeof eqToNull extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type eqToNull_ValueType_Test = AssertTrue<AssertEqual<typeof_EqToNull_ValueType, null>>;

const eqToMaybeNull = customerIdQC.eq(paramTester("num").type<number | null>());
type typeof_EqToMaybeNull = typeof eqToMaybeNull;
type typeof_EqToMaybeNull_ValueType = typeof eqToMaybeNull extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type eqToMaybeNull_ValueType_Test = AssertTrue<AssertEqual<typeof_EqToMaybeNull_ValueType, boolean | null>>;

const maybeNullEqToNull = empPositionQC.eq(null);
type typeof_MaybeNullEqToNull = typeof maybeNullEqToNull;
type typeof_MaybeNullEqToNull_ValueType = typeof maybeNullEqToNull extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type maybeNullEqToNull_ValueType_Test = AssertTrue<AssertEqual<typeof_MaybeNullEqToNull_ValueType, null>>;

const maybeNullEqToVal = empSalaryQC.eq(100);
type typeof_MaybeNullEqToVal = typeof maybeNullEqToVal;
type typeof_MaybeNullEqToVal_ValueType = typeof maybeNullEqToVal extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type maybeNullEqToVal_ValueType_Test = AssertTrue<AssertEqual<typeof_MaybeNullEqToVal_ValueType, boolean | null>>;