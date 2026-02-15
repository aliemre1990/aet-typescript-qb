import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";
import { paramTester } from "../../_functions.js";

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
type typeof_BetweenLRParam_Applied = typeof_BetweenLRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLRParam_LParamType = typeof_BetweenLRParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParam_RParamType = typeof_BetweenLRParam_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParam_LParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParam_LParamType, number | null>>;
type betweenLRParam_RParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParam_RParamType, number | null>>;
// @ts-expect-error
const betweenInvalidLRParamLTyped = customerIdQC.between(paramTester("left").type<string>(), paramTester("right"));
// @ts-expect-error
const betweenInvalidLRParamRTyped = customerIdQC.between(paramTester("left"), paramTester("right").type<string>());
//
const betweenLRParamLTyped = customerIdQC.between(paramTester("left").type<number>(), paramTester("right"));
type typeof_BetweenLRParamLTyped = typeof betweenLRParamLTyped;
type typeof_BetweenLRParamLTyped_Applied = typeof_BetweenLRParamLTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLRParamLTyped_LParamType = typeof_BetweenLRParamLTyped_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParamLTyped_RParamType = typeof_BetweenLRParamLTyped_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLRParamLTyped_LParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamLTyped_LParamType, number>>;
type betweenLRParamLTyped_RParamTest = AssertTrue<AssertEqual<typeof_BetweenLRParamLTyped_RParamType, number | null>>;
//
const betweenLRParamRTyped = customerIdQC.between(paramTester("left"), paramTester("right").type<number>());
type typeof_BetweenLRParamRTyped = typeof betweenLRParamRTyped;
type typeof_BetweenLRParamRTyped_Applied = typeof_BetweenLRParamRTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLRParamRTyped_LParamType = typeof_BetweenLRParamRTyped_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_BetweenLRParamRTyped_RParamType = typeof_BetweenLRParamRTyped_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
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
type typeof_BetweenLColRParam_Applied = typeof_BetweenLColRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLColRParam_ParamType = typeof_BetweenLColRParam_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParam_Test = AssertTrue<AssertEqual<typeof_BetweenLColRParam_ParamType, number | null>>;
//
const betweenLColRParamTyped = customerIdQC.between(empSalaryQC, paramTester("right").type<number>());
type typeof_BetweenLColRParamTyped = typeof betweenLColRParamTyped;
type typeof_BetweenLColRParamTypedApplied = typeof_BetweenLColRParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLColRParamTyped_ParamType = typeof_BetweenLColRParamTypedApplied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLColRParamTyped_Test = AssertTrue<AssertEqual<typeof_BetweenLColRParamTyped_ParamType, number>>;
//
const betweenLParamRCol = customerIdQC.between(paramTester("num"), empSalaryQC);
type typeof_BetweenLParamRCol = typeof betweenLParamRCol;
type typeof_BetweenLParamRCol_Applied = typeof_BetweenLParamRCol extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLParamRCol_ParamType = typeof_BetweenLParamRCol_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRCol_Test = AssertTrue<AssertEqual<typeof_BetweenLParamRCol_ParamType, number | null>>;
//
const betweenLParamTypedRCol = customerIdQC.between(paramTester("num").type<number>(), empSalaryQC);
type typeof_BetweenLParamTypedRCol = typeof betweenLParamTypedRCol;
type typeofBetweenLParamTypedRCol_Applied = typeof_BetweenLParamTypedRCol extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLParamTypedRCol_ParamType = typeofBetweenLParamTypedRCol_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRCol_Test = AssertTrue<AssertEqual<typeof_BetweenLParamTypedRCol_ParamType, number>>;
//
const betweenLParamRVal = customerIdQC.between(paramTester("left"), 1);
type typeof_BetweenLParamRVal = typeof betweenLParamRVal;
type typeof_BetweenLParamRVal_Applied = typeof_BetweenLParamRVal extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLParamRVal_ParamType = typeof_BetweenLParamRVal_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamRVal_Test = AssertTrue<AssertEqual<typeof_BetweenLParamRVal_ParamType, number | null>>;
//
const betweenLParamTypedRVal = customerIdQC.between(paramTester("left").type<number>(), 1);
type typeof_BetweenLParamTypedRVal = typeof betweenLParamTypedRVal;
type typeof_BetweenLParamTypedRVal_Applied = typeof_BetweenLParamTypedRVal extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLParamTypedRVal_ParamType = typeof_BetweenLParamTypedRVal_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLParamTypedRVal_Test = AssertTrue<AssertEqual<typeof_BetweenLParamTypedRVal_ParamType, number>>;
//
const betweenLValRParam = customerIdQC.between(1, paramTester("right"));
type typeof_BetweenLValRParam = typeof betweenLValRParam;
type typeof_BetweenLValRParam_Applied = typeof_BetweenLValRParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLValRParam_ParamType = typeof_BetweenLValRParam_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type betweenLValRParam_Test = AssertTrue<AssertEqual<typeof_BetweenLValRParam_ParamType, number | null>>;
//
const betweenLValRParamTyped = customerIdQC.between(1, paramTester("right").type<number>());
type typeof_BetweenLValRParamTyped = typeof betweenLValRParamTyped;
type typeof_BetweenLValRParamTyped_Applied = typeof_BetweenLValRParamTyped extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_BetweenLValRParamTyped_ParamType = typeof_BetweenLValRParamTyped_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
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
