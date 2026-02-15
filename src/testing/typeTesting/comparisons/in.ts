import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type QueryParam from "../../../query/param.js";
import { customerIdQC } from "../../_columns.js";
import { literalTester, paramTester } from "../../_functions.js";
import { customersTable, employeesTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

//
const inVal = customerIdQC.sqlIn(1, 2, 3);
// @ts-expect-error
const inInvalidVal = customerIdQC.sqlIn("ali", 1);
//
const inQb = customerIdQC.sqlIn(customersTable.select((tables) => [tables.customers.id]));
//
const InNullableQb = customerIdQC.sqlIn(employeesTable.select((tables) => [tables.employees.salary]));
// @ts-expect-error
const inInvalidQb = customerIdQC.sqlIn(customersTable.select((tables) => [tables.customers.name]));
//
const inParam = customerIdQC.sqlIn(paramTester("num1"), paramTester("num2").type<number>(), paramTester("num3").type<number | null>());
type typeof_InParam = typeof inParam;
type typeof_InParam_Applied = typeof_InParam extends ColumnComparisonOperation<any, any, infer TApplied, any> ? TApplied : never;
type typeof_InParam_Param1 = typeof_InParam_Applied[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_InParam_Param2 = typeof_InParam_Applied[1] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type typeof_InParam_Param3 = typeof_InParam_Applied[2] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
type inParam_Param1Test = AssertTrue<AssertEqual<typeof_InParam_Param1, number | null>>;
type inParam_Param2Test = AssertTrue<AssertEqual<typeof_InParam_Param2, number>>;
type inParam_Param3Test = AssertTrue<AssertEqual<typeof_InParam_Param3, number | null>>;
// @ts-expect-error
const inInvalidParam = customerIdQC.sqlIn(paramTester("num").type<string>());

//
const literalInVal = literalTester(1).sqlIn(1, 2, 3)
//
const literalInQb = literalTester(1).sqlIn(customersTable.select((tables) => [tables.customers.id]));
// @ts-expect-error
const literalInInvalidQb = literalTester(1).sqlIn(customersTable.select((tables) => [tables.customers.name]));

