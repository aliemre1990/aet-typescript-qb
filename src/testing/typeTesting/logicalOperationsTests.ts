import type ColumnLogicalOperation from "../../query/logicalOperations.js";
import type QueryParam from "../../query/param.js";
import { customerIdQC, empSalaryQC } from "../_columns.js";
import { andTester, paramTester } from "../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const logicalAndWithParams_Simple = andTester(customerIdQC.eq(paramTester("customerId")), empSalaryQC.eq(paramTester("employeeSalary")));
type typeof_LogicalAndWithParams_Simple = typeof logicalAndWithParams_Simple;
type typeof_LogicalAndWithParams_Simple_Params = typeof_LogicalAndWithParams_Simple extends ColumnLogicalOperation<any, any, infer TParams, any, any> ? TParams : never;
type typeof_LogicalAndWithParams_Simple_Param1Name = typeof_LogicalAndWithParams_Simple_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_LogicalAndWithParams_Simple_Param1Type = typeof_LogicalAndWithParams_Simple_Params[0] extends QueryParam<any, any, infer TValueType, any, any> ? TValueType : never;
type typeof_LogicalAndWithParams_Simple_Param2Name = typeof_LogicalAndWithParams_Simple_Params[1] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_LogicalAndWithParams_Simple_Param2Type = typeof_LogicalAndWithParams_Simple_Params[1] extends QueryParam<any, any, infer TValueType, any, any> ? TValueType : never;
type logicalAndWithParams_Simple_Params_LengthTest = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Simple_Params["length"], 2>>;
type logicalAndWithParams_Simple_Param1Name_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Simple_Param1Name, "customerId">>;
type logicalAndWithParams_Simple_Param1Type_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Simple_Param1Type, number | null>>;
type logicalAndWithParams_Simple_Param2Name_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Simple_Param2Name, "employeeSalary">>;
type logicalAndWithParams_Simple_Param2Type_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Simple_Param2Type, number | null>>;

const logicalAndWithParams_Complex = andTester(
    customerIdQC.between(paramTester("customerIdBetweenL"), paramTester("customerIdBetweenR")),
    customerIdQC.eq(paramTester("customerIdEq")),
    andTester(
        customerIdQC.eq(paramTester("customerIdEqInner")),
        customerIdQC.between(paramTester("customerIdBetweenLInner"), paramTester("customerIdBetweenRInner")),
    )
);
type typeof_LogicalAndWithParams_Complex = typeof logicalAndWithParams_Complex;
type typeof_LogicalAndWithParams_Complex_Params = typeof_LogicalAndWithParams_Complex extends ColumnLogicalOperation<any, any, infer TParams, any, any> ? TParams : never;
type typeof_LogicalAndWithParams_Complex_Ops = typeof_LogicalAndWithParams_Complex extends ColumnLogicalOperation<any, infer TOps, any, any, any> ? TOps : never;
type typeof_LogicalAndWithParams_Complex_InnerOp = typeof_LogicalAndWithParams_Complex_Ops[2];
type typeof_LogicalAndWithParams_Complex_InnerOp_Params = typeof_LogicalAndWithParams_Complex_InnerOp extends ColumnLogicalOperation<any, any, infer TParams, any, any> ? TParams : never;

type logicalAndWithParams_Complex_ParamsLength_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Complex_Params["length"], 6>>;
type logicalAndWithParams_Complex_Ops_Length_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Complex_Ops["length"], 3>>;
type logicalAndWithParams_Comples_InnerOp_ParamsLength_Test = AssertTrue<AssertEqual<typeof_LogicalAndWithParams_Complex_InnerOp_Params["length"], 3>>;