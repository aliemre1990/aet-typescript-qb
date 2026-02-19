import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import type QueryParam from "../../../query/param.js";
import { empSalaryQC } from "../../_columns.js";
import { paramTester, roundTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const roundValues = roundTester(1.55, 1);
type typeof_RoundValues = typeof roundValues;
type typeof_RoundValues_ReturnType = typeof_RoundValues extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type roundValues_ReturnType_Test = AssertTrue<AssertEqual<typeof_RoundValues_ReturnType, number>>;

const roundNonNullParams = roundTester(paramTester("val").type<number>(), paramTester("decimalPlaces").type<number>());
type typeof_RoundNonNullParams = typeof roundNonNullParams;
type typeof_RoundNonNullParams_ReturnType = typeof_RoundNonNullParams extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type typeof_RoundNonNullParams_Params = typeof_RoundNonNullParams extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type typeof_RoundNonNullParams_ValueParamName = typeof_RoundNonNullParams_Params[0] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_RoundNonNullParams_ValueParamType = typeof_RoundNonNullParams_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_RoundNonNullParams_DecimalPlaceParamName = typeof_RoundNonNullParams_Params[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_RoundNonNullParams_DecimalPlaceParamType = typeof_RoundNonNullParams_Params[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type roundNonNullParams_ReturnType_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_ReturnType, number>>;
type roundNonNullParams_ParamsLength_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_Params["length"], 2>>;
type roundNonNullParams_ValueParamName_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_ValueParamName, 'val'>>;
type roundNonNullParams_ValueParamType_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_ValueParamType, number>>;
type roundNonNullParams_DecimalPlaceParamName_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_DecimalPlaceParamName, 'decimalPlaces'>>;
type roundNonNullParams_DecimalPlaceParamType_Test = AssertTrue<AssertEqual<typeof_RoundNonNullParams_DecimalPlaceParamType, number>>;

const roundParamsNotTyped = roundTester(paramTester("value"), paramTester("decimalPlaces"));
type typeof_RoundParamsNotTyped = typeof roundParamsNotTyped;
type typeof_RoundParamsNotTyped_ReturnType = typeof_RoundParamsNotTyped extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type typeof_RoundParamsNotTyped_Params = typeof_RoundParamsNotTyped extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type typeof_RoundParamsNotTyped_ValueParamType = typeof_RoundParamsNotTyped_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type roundParamsNotTyped_ReturnType_Test = AssertTrue<AssertEqual<typeof_RoundParamsNotTyped_ReturnType, number | null>>;
type roundParamsNotTyped_ValueParamType_Test = AssertTrue<AssertEqual<typeof_RoundParamsNotTyped_ValueParamType, number | null>>;

const roundParamsValNull = roundTester(paramTester("value"), 2);
type typeof_RoundParamsValNull = typeof roundParamsValNull;
type typeof_RoundParamsValNull_ReturnType = typeof_RoundParamsValNull extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type roundParamsValNull_ReturnType_Test = AssertTrue<AssertEqual<typeof_RoundParamsValNull_ReturnType, number | null>>;

const roundParamsValNullableCol = roundTester(empSalaryQC, 2);
type typeof_RoundParamsValNullableCol = typeof roundParamsValNullableCol;
type typeof_RoundParamsValNullableCol_ReturnType = typeof_RoundParamsValNullableCol extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type roundParamsValNullableCol_ReturnType_Test = AssertTrue<AssertEqual<typeof_RoundParamsValNullableCol_ReturnType, number | null>>;
