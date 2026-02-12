import type { DbType } from "../../../db.js";
import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type QueryColumn from "../../../query/queryColumn.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { jsonBuildObjectTester, literalTester, paramTester, roundTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const nullLiteral = literalTester(null);
type typeof_NullLiteral = typeof nullLiteral;
type typeof_NullLiteral_ValueType = typeof_NullLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_NullLiteral_FinalValueType = typeof_NullLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullLiteral_ValueTypeTest = AssertTrue<AssertEqual<typeof_NullLiteral_ValueType, null>>;
type nullLiteral_FinalValueTypeTest = AssertTrue<AssertEqual<typeof_NullLiteral_FinalValueType, null>>;

const objectLiteral = literalTester({ a: 1, b: "str" });
type typeof_ObjectLiteral = typeof objectLiteral;
type typeof_ObjectLiteral_ValueType = typeof_ObjectLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_ObjectLiteral_FinalValueType = typeof_ObjectLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type objectLiteral_ValueTypeTest = AssertTrue<AssertEqual<typeof_ObjectLiteral_ValueType, { a: 1, b: "str" }>>;
type objectLiteral_FinalValueTypeTest = AssertTrue<AssertEqual<typeof_ObjectLiteral_FinalValueType, { a: 1, b: "str" }>>;

const numberLiteral = literalTester(1);
type typeof__NumberLiteral_ = typeof numberLiteral;
type typeof__NumberLiteral_ValueType = typeof__NumberLiteral_ extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_NumberLiteralF_inalValueType = typeof__NumberLiteral_ extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type numberLiteral_ValueTypeTest = AssertTrue<AssertEqual<typeof__NumberLiteral_ValueType, 1>>;
type numberLiteral_FinalValueTypeTest = AssertTrue<AssertEqual<typeof_NumberLiteralF_inalValueType, 1>>;

const jsonBuildObjectWithLiteral = jsonBuildObjectTester({ id: customerIdQC, type: literalTester("CUSTOMER_TYPE") });
type typeof_JSONBuildObjectWithLiteral = typeof jsonBuildObjectWithLiteral;
type typeof_JSONBuildObjectWithLiteral_ValueType = typeof_JSONBuildObjectWithLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_JSONBuildObjectWithLiteral_FinalValueType = typeof_JSONBuildObjectWithLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type jsonBuildObjectWithLiteral_ValueTypeTest = AssertTrue<AssertEqual<typeof_JSONBuildObjectWithLiteral_ValueType, { id: number, type: 'CUSTOMER_TYPE' }>>;
type jsonBuildObjectWithLiteral_FinalValueTypeTest = AssertTrue<AssertEqual<typeof_JSONBuildObjectWithLiteral_FinalValueType, { id: number, type: 'CUSTOMER_TYPE' }>>;
