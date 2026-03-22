import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import { customerIdQC } from "../../_columns.js";
import type { AssertEqual, AssertTrue } from "../../_typeTestingUtilities.js";

const isNullValid = customerIdQC.isNull();
type typeof_IsNullValid = typeof isNullValid;
type typeof_IsNullValid_Comparing = typeof_IsNullValid extends ColumnComparisonOperation<any, infer TComparing, any, any, any, any, any> ? TComparing : never;
type typeof_IsNullValid_Applied = typeof_IsNullValid extends ColumnComparisonOperation<any, any, infer TApplied, any, any, any, any> ? TApplied : never;
type isNullValid_Comparing_Test = AssertTrue<AssertEqual<typeof_IsNullValid_Comparing, typeof customerIdQC>>;
type isNullValid_Applied_Test = AssertTrue<AssertEqual<typeof_IsNullValid_Applied, undefined>>;