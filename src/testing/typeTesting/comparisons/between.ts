import type QueryParam from "../../../query/param.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { customersTable } from "../../_tables.js";
import { paramTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";
import type BetweenColumnComparisonOperation from "../../../query/comparisons/_betweenColumnComparisonOperation.js";

//
const betweenVal = customerIdQC.between(1, 2);
// @ts-expect-error
const betweenInvalidVal1 = customerIdQC.between(1, "ali");
// @ts-expect-error
const betweenInvalidVal2 = customerIdQC.between("ali", 1);
// @ts-expect-error
const betweenInvalidVal3 = customerIdQC.between("ali", "veli");
//
const betweenLRParam = customerIdQC.between(paramTester("left"), paramTester("right"));
type typeof_BetweenLRParam = typeof betweenLRParam;
type typeof_BetweenLRParam_LValue = typeof_BetweenLRParam extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLRParam_RValue = typeof_BetweenLRParam extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLRParam_LParamType = typeof_BetweenLRParam_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParam_RParamType = typeof_BetweenLRParam_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParam_LParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParam_LParamType, number | null>>;
type betweenLRParam_RParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParam_RParamType, number | null>>;
// @ts-expect-error
const betweenInvalidLRParamLTyped = customerIdQC.between(paramTester("left").type<string>(), paramTester("right"));
// @ts-expect-error
const betweenInvalidLRParamRTyped = customerIdQC.between(paramTester("left"), paramTester("right").type<string>());
//
const betweenLRParamLTyped = customerIdQC.between(paramTester("left").type<number>(), paramTester("right"));
type typeof_BetweenLRParamLTyped = typeof betweenLRParamLTyped;
type typeof_BetweenLRParamLTyped_LValue = typeof_BetweenLRParamLTyped extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLRParamLTyped_RValue = typeof_BetweenLRParamLTyped extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLRParamLTyped_LParamType = typeof_BetweenLRParamLTyped_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParamLTyped_RParamType = typeof_BetweenLRParamLTyped_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTyped_LParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamLTyped_LParamType, number>>;
type betweenLRParamLTyped_RParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamLTyped_RParamType, number | null>>;
//
const betweenLRParamRTyped = customerIdQC.between(paramTester("left"), paramTester("right").type<number>());
type typeof_BetweenLRParamRTyped = typeof betweenLRParamRTyped;
type typeof_BetweenLRParamRTyped_LValue = typeof_BetweenLRParamRTyped extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLRParamRTyped_RValue = typeof_BetweenLRParamRTyped extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLRParamRTyped_LParamType = typeof_BetweenLRParamRTyped_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParamRTyped_RParamType = typeof_BetweenLRParamRTyped_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamRTyped_LParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamRTyped_LParamType, number | null>>;
type betweenLRParamRTyped_RParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamRTyped_RParamType, number>>;
// @ts-expect-error
const betweenLRParamInvalidL = customerIdQC.between(paramTester("left").type<string>(), 1);
// @ts-expect-error
const betweenLRParamInvalidR = customerIdQC.between(1, paramTester("right").type<string>());
// @ts-expect-error
const betweenLInvalidParamRCol = customerIdQC.between(paramTester("left").type<string>(), empSalaryQC);
// @ts-expect-error
const betweenLColRInvalidParam = customerIdQC.between(empSalaryQC, paramTester("left").type<string>());
//
const betweenLColRParam = customerIdQC.between(empSalaryQC, paramTester("right"));
type typeof_BetweenLColRParam = typeof betweenLColRParam;
type typeof_BetweenLColRParam_RValue = typeof_BetweenLColRParam extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLColRParam_ParamType = typeof_BetweenLColRParam_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParam_Test = AssertTrue<AssertEqual<typeof_BetweenLColRParam_ParamType, number | null>>;
//
const betweenLColRParamTyped = customerIdQC.between(empSalaryQC, paramTester("right").type<number>());
type typeof_BetweenLColRParamTyped = typeof betweenLColRParamTyped;
type typeof_BetweenLColRParamTyped_RValue = typeof_BetweenLColRParamTyped extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLColRParamTyped_ParamType = typeof_BetweenLColRParamTyped_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParamTyped_Test = AssertTrue<AssertEqual<typeof_BetweenLColRParamTyped_ParamType, number>>;
//
const betweenLParamRCol = customerIdQC.between(paramTester("num"), empSalaryQC);
type typeof_BetweenLParamRCol = typeof betweenLParamRCol;
type typeof_BetweenLParamRCol_LValue = typeof_BetweenLParamRCol extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLParamRCol_ParamType = typeof_BetweenLParamRCol_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRCol_Test = AssertTrue<AssertEqual<typeof_BetweenLParamRCol_ParamType, number | null>>;
//
const betweenLParamTypedRCol = customerIdQC.between(paramTester("num").type<number>(), empSalaryQC);
type typeof_BetweenLParamTypedRCol = typeof betweenLParamTypedRCol;
type typeof_BetweenLParamTypedRCol_LValue = typeof_BetweenLParamTypedRCol extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLParamTypedRCol_ParamType = typeof_BetweenLParamTypedRCol_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRCol_Test = AssertTrue<AssertEqual<typeof_BetweenLParamTypedRCol_ParamType, number>>;
//
const betweenLParamRVal = customerIdQC.between(paramTester("left"), 1);
type typeof_BetweenLParamRVal = typeof betweenLParamRVal;
type typeof_BetweenLParamRVal_LValue = typeof_BetweenLParamRVal extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLParamRVal_ParamType = typeof_BetweenLParamRVal_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRVal_Test = AssertTrue<AssertEqual<typeof_BetweenLParamRVal_ParamType, number | null>>;
//
const betweenLParamTypedRVal = customerIdQC.between(paramTester("left").type<number>(), 1);
type typeof_BetweenLParamTypedRVal = typeof betweenLParamTypedRVal;
type typeof_BetweenLParamTypedRVal_LValue = typeof_BetweenLParamTypedRVal extends BetweenColumnComparisonOperation<any, any, infer TLApplied, any, any, any> ? TLApplied : never;;
type typeof_BetweenLParamTypedRVal_ParamType = typeof_BetweenLParamTypedRVal_LValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRVal_Test = AssertTrue<AssertEqual<typeof_BetweenLParamTypedRVal_ParamType, number>>;
//
const betweenLValRParam = customerIdQC.between(1, paramTester("right"));
type typeof_BetweenLValRParam = typeof betweenLValRParam;
type typeof_BetweenLValRParam_RValue = typeof_BetweenLValRParam extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLValRParam_ParamType = typeof_BetweenLValRParam_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLValRParam_Test = AssertTrue<AssertEqual<typeof_BetweenLValRParam_ParamType, number | null>>;
//
const betweenLValRParamTyped = customerIdQC.between(1, paramTester("right").type<number>());
type typeof_BetweenLValRParamTyped = typeof betweenLValRParamTyped;
type typeof_BetweenLValRParamTyped_RValue = typeof_BetweenLValRParamTyped extends BetweenColumnComparisonOperation<any, any, any, infer TRApplied, any, any> ? TRApplied : never;
type typeof_BetweenLValRParamTyped_ParamType = typeof_BetweenLValRParamTyped_RValue extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLValRParamTyped_Test = AssertTrue<AssertEqual<typeof_BetweenLValRParamTyped_ParamType, number>>;
//
const betweenLQueryRQuery = customerIdQC.between(customersTable.select((tables) => [tables.customers.id]), customersTable.select((tables) => [tables.customers.id]));
// 
const betweenLQueryRVal = customerIdQC.between(customersTable.select((tables) => [tables.customers.id]), 1);
//
const betweenLValRQuery = customerIdQC.between(1, customersTable.select((tables) => [tables.customers.id]));
// @ts-expect-error
const betweenLInvalidQueryRVal = customerIdQC.between(customersTable.select((tables) => [tables.customers.name]), 1);
// @ts-expect-error
const betweenLValRInvalidQuery = customerIdQC.between(1, customersTable.select((tables) => [tables.customers.name]));
