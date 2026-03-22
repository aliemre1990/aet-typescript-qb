import type IsNullColumnComparisonOperation from "../../../query/comparisons/_isNullColumnComparisonOperation.js";
import { customerIdQC } from "../../_columns.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";

const isNullValid = customerIdQC.isNull();
type typeof_IsNullValid = typeof isNullValid;
type typeof_IsNullValid_Comparing = typeof_IsNullValid extends IsNullColumnComparisonOperation<any, any, infer TComparing, any, any, any> ? TComparing : never;
type isNullValid_Comparing_Test = AssertTrue<AssertEqual<typeof_IsNullValid_Comparing, typeof customerIdQC>>;