import type { IQueryExpression } from "../../query/_interfaces/IQueryExpression.js";
import { customerIdQC, empSalaryQC } from "../_columns.js";
import { arithmeticAdditionTester } from "../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const arithmeticWithNull = arithmeticAdditionTester(1, null);
type typeof_ArithmeticWithNull = typeof arithmeticWithNull;
type typeof_ArithmeticWithNull_FinalValueType = typeof_ArithmeticWithNull extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type arithmeticWithNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_ArithmeticWithNull_FinalValueType, null>>;

const arithmeticWithMaybeNull = arithmeticAdditionTester(empSalaryQC, 1);
type typeof_ArithmeticWithMaybeNull = typeof arithmeticWithMaybeNull;
type typeof_ArithmeticWithMaybeNull_FinalValueType = typeof_ArithmeticWithMaybeNull extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type arithmeticWithMaybeNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_ArithmeticWithMaybeNull_FinalValueType, number | null>>;

const arithmeticWithoutNull = arithmeticAdditionTester(1, customerIdQC);
type typeof_ArithmeticWithoutNull = typeof arithmeticWithoutNull;
type typeof_ArithmeticWithoutNull_FinalValueType = typeof_ArithmeticWithoutNull extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type arithmeticWithoutNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_ArithmeticWithoutNull_FinalValueType, number>>;