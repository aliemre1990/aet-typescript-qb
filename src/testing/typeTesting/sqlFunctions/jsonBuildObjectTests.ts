import type JSONBuildObjectFunction from "../../../query/functions/jsonFunctions/jsonBuildObject.js";
import { customerIdQC, customerNameQC } from "../../_columns.js";
import { customersColumnsSelection } from "../../_columnsSelections.js";
import { jsonBuildObjectTester, literalTester } from "../../_functions.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const jsonBuildObject_ColumnsSelection = jsonBuildObjectTester({ ...customersColumnsSelection });
type typeof_JSONBuildObject_ColumnsSelection = typeof jsonBuildObject_ColumnsSelection;
type typeof_JSONBuildObject_ColumnsSelection_ReturnType = typeof_JSONBuildObject_ColumnsSelection extends JSONBuildObjectFunction<any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type jsonBuildObject_ColumnsSelection_ReturnType_Actual = { id: number, customerTypeId: number, name: string, createdBy: number };
type jsonBuildObject_ColumnsSelection_ReturnType_Test = AssertTrue<AssertEqual<jsonBuildObject_ColumnsSelection_ReturnType_Actual, typeof_JSONBuildObject_ColumnsSelection_ReturnType>>;

const jsonBuildObject_Picked = jsonBuildObjectTester({ id: customerIdQC, name: customerNameQC });
type typeof_JSONBuildObject_Picked = typeof jsonBuildObject_Picked;
type typeof_JSONBuildObject_Picked_ReturnType = typeof_JSONBuildObject_Picked extends JSONBuildObjectFunction<any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type jsonBuildObject_Picked_ReturnType_Actual = { id: number, name: string };
type jsonBuildObject_Picked_ReturnType_Test = AssertTrue<AssertEqual<jsonBuildObject_Picked_ReturnType_Actual, typeof_JSONBuildObject_Picked_ReturnType>>;

const jsonBuildObject_PickedWithLiteralValues = jsonBuildObjectTester({ id: customerIdQC, name: customerNameQC, customerType: literalTester("INDIVIDUAL") });
type typeof_JSONBuildObject_PickedWithLiteralValues = typeof jsonBuildObject_PickedWithLiteralValues;
type typeof_JSONBuildObject_PickedWithLiteralValues_ReturnType = typeof_JSONBuildObject_PickedWithLiteralValues extends JSONBuildObjectFunction<any, any, infer TReturnType, any, any, any, any> ? TReturnType : never;
type jsonBuildObject_PickedWithLiteralValues_ReturnType_Actual = { id: number, name: string, customerType: 'INDIVIDUAL' };
type jsonBuildObject_PickedWithLiteralValues_ReturnType_Test = AssertTrue<AssertEqual<jsonBuildObject_PickedWithLiteralValues_ReturnType_Actual, typeof_JSONBuildObject_PickedWithLiteralValues_ReturnType>>;