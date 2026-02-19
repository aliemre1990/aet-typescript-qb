import { type PgDbType } from "../../../db.js";
import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type { InferParamsFromOps } from "../../../query/_types/paramAccumulationComparison.js";
import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import QueryParam from "../../../query/param.js";
import { customerCreatedByQC, customerIdQC, customerNameQC, empSalaryQC } from "../../_columns.js";
import { coalesceTester, paramTester } from "../../_functions.js";
import { customersTable, employeesTable, ordersTable, usersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const coalesce_NonNull = coalesceTester(empSalaryQC, 2000);
type typeof_Coalesce_NonNull = typeof coalesce_NonNull;
type typeof_Coalesce_NonNull_FinalValueType = typeof_Coalesce_NonNull extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type coalesce_NonNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_NonNull_FinalValueType, number>>;

const coalesce_Null = coalesceTester(empSalaryQC, null);
type typeof_Coalesce_Null = typeof coalesce_Null;
type typeof_Coalesce_Null_ValueType = typeof_Coalesce_Null extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_Coalesce_Null_FinalValueType = typeof_Coalesce_Null extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type coalesce_Null_ValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_Null_ValueType, number>>;
type coalesce_Null_FinalValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_Null_FinalValueType, number | null>>;

const coalesce_WithParams_NullableNumberParamBefore = coalesceTester(paramTester("before").type<number | null>(), paramTester("after"));
type typeof_Coalesce_WithParams_NullableNumberParamBefore = typeof coalesce_WithParams_NullableNumberParamBefore;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_ReturnType = typeof_Coalesce_WithParams_NullableNumberParamBefore extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_Params = typeof_Coalesce_WithParams_NullableNumberParamBefore extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamName = typeof_Coalesce_WithParams_NullableNumberParamBefore_Params[0] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamType = typeof_Coalesce_WithParams_NullableNumberParamBefore_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamName = typeof_Coalesce_WithParams_NullableNumberParamBefore_Params[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamType = typeof_Coalesce_WithParams_NullableNumberParamBefore_Params[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamName_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamName, 'before'>>;
type coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamType_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_PreviousParamType, number | null>>;
type coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamName_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamName, 'after'>>;
type coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamType_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_Params_SubsequentParamType, number | null>>;
type coalesce_WithParams_NullableNumberParamBefore_ReturnType_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_ReturnType, number | null>>;

const coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter = coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2").type<number>());
type typeof_Coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter = typeof coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter;
type typeof_Coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter_ReturnType = typeof_Coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter_ReturnType_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithParams_NullableNumberParamBefore_NonNullParamAfter_ReturnType, number>>;

// @ts-expect-error
const coalesce_InvalidType_Param1 = coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2").type<string>());
// @ts-expect-error
const coalesce_InvalidType_Param2 = coalesceTester(customerIdQC, paramTester("param1").type<string>());

const coalesce_With3Params_LastParamAny = coalesceTester(
    paramTester("param1").type<number>(),
    paramTester("param2").type<number | null>(),
    paramTester("param3")
);
type typeof_Coalesce_With3Params_LastParamAny = typeof coalesce_With3Params_LastParamAny;
type typeof_Coalesce_With3Params_LastParamAny_Params = typeof_Coalesce_With3Params_LastParamAny extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type typeof_Coalesce_With3Params_LastParamAny_LastParamType = typeof_Coalesce_With3Params_LastParamAny_Params[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type coalesce_With3Params_LastParamAny_LastParamType_Test = AssertTrue<AssertEqual<typeof_Coalesce_With3Params_LastParamAny_LastParamType, number | null>>;

const coalesce_ParamInferredFromValue = coalesceTester(1, 2, paramTester("param"));
type typeof_Coalesce_ParamInferredFromValue = typeof coalesce_ParamInferredFromValue;
type typeof_Coalesce_ParamInferredFromValue_Args = typeof_Coalesce_ParamInferredFromValue extends ColumnSQLFunction<any, any, infer TArgs, any, any, any, any, any> ? TArgs : never;
type typeof_Coalesce_ParamInferredFromValue_ReturnType = typeof_Coalesce_ParamInferredFromValue extends ColumnSQLFunction<any, any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type typeof_Coalesce_ParamInferredFromValue_Params = typeof_Coalesce_ParamInferredFromValue extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type typeof_Coalesce_ParamInferredFromValue_ParamType = typeof_Coalesce_ParamInferredFromValue_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type coalesce_ParamInferredFromValue_Arg1Type_Test = AssertTrue<AssertEqual<typeof_Coalesce_ParamInferredFromValue_Args[0], number>>
type coalesce_ParamInferredFromValue_Arg2Type_Test = AssertTrue<AssertEqual<typeof_Coalesce_ParamInferredFromValue_Args[1], number>>
type coalesce_ParamInferredFromValue_ReturnType_Test = AssertTrue<AssertEqual<typeof_Coalesce_ParamInferredFromValue_ReturnType, number>>
type typeof_Coalesce_ParamInferredFromValue_ParamType_Test = AssertTrue<AssertEqual<typeof_Coalesce_ParamInferredFromValue_ParamType, number | null>>;

// @ts-expect-error
const coalesce_InvalidTypedColumn = coalesceTester(customerIdQC, customerNameQC);

// @ts-expect-error
const coalesce_InvalidTypedValue = coalesceTester(customerIdQC, "error");

const coalesce_WithNestedFunction = coalesceTester(
    1,
    2,
    paramTester("level1"),
    coalesceTester(
        1,
        2,
        3,
        paramTester("level2"),
        coalesceTester(
            1,
            2,
            3,
            4,
            paramTester("leve3")
        )
    )
);
type typeof_Coalesce_WithNestedFunction = typeof coalesce_WithNestedFunction;
type typeof_Coalesce_WithNestedFunction_Params = typeof_Coalesce_WithNestedFunction extends ColumnSQLFunction<any, any, any, any, infer TParams, any, any, any> ? TParams : never;
type coalesce_WithNestedFunction_Params_Length_Test = AssertTrue<AssertEqual<typeof_Coalesce_WithNestedFunction_Params["length"], 3>>;