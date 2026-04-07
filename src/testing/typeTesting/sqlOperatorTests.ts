import type { IQueryExpression } from "../../query/_interfaces/IQueryExpression.js";
import type { ColumnsToResultMap } from "../../query/_types/result.js";
import type QueryParam from "../../query/param.js";
import type QueryBuilder from "../../query/queryBuilder.js";
import { customerIdQC } from "../_columns.js";
import { paramTester, sqlTester } from "../_functions.js";
import { customersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const simpleSQL_WithParams = sqlTester`Round(${paramTester("param")})`;
type typeof_SimpleSQL_WithParams = typeof simpleSQL_WithParams;
type typeof_SimpleSQL_WithParams_Params = typeof_SimpleSQL_WithParams extends IQueryExpression<any, infer TParams, any, any, any, any, any> ? TParams : never;
type typeof_SimpleSQL_WithParams_Param1Name = typeof_SimpleSQL_WithParams_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type simpleSQL_WithParams_ParamLength_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithParams_Params["length"], 1>>;
type simpleSQL_WithParams_Param1Name_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithParams_Param1Name, "param">>;

const simpleSQL_WithTypeNull = sqlTester`Round(1)`.specs<null>();
type typeof_SimpleSQL_WithTypeNull = typeof simpleSQL_WithTypeNull;
type typeof_SimpleSQL_WithTypeNull_ValueType = typeof_SimpleSQL_WithTypeNull extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_SimpleSQL_WithTypeNull_FinalValueType = typeof_SimpleSQL_WithTypeNull extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type simpleSQL_WithTypeNull_ValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNull_ValueType, null>>;
type simpleSQL_WithTypeNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNull_FinalValueType, null>>;

const simpleSQL_WithTypeNumberOrNull = sqlTester`Round(1)`.specs<number | null>();
type typeof_SimpleSQL_WithTypeNumberOrNull = typeof simpleSQL_WithTypeNumberOrNull;
type typeof_SimpleSQL_WithTypeNumberOrNull_ValueType = typeof_SimpleSQL_WithTypeNumberOrNull extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_SimpleSQL_WithTypeNumberOrNull_FinalValueType = typeof_SimpleSQL_WithTypeNumberOrNull extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type simpleSQL_WithTypeNumberOrNull_ValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNumberOrNull_ValueType, number>>;
type simpleSQL_WithTypeNumberOrNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNumberOrNull_FinalValueType, number | null>>;

const simpleSQL_WithTypeNull_CastJSON = sqlTester`Round(1)`.specs<null>().cast('JSON');
type typeof_SimpleSQL_WithTypeNull_CastJSON = typeof simpleSQL_WithTypeNull_CastJSON;
type typeof_SimpleSQL_WithTypeNull_CastJSON_ValueType = typeof_SimpleSQL_WithTypeNull_CastJSON extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_SimpleSQL_WithTypeNull_CastJSON_FinalValueType = typeof_SimpleSQL_WithTypeNull_CastJSON extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type simpleSQL_WithTypeNull_CastJSON_ValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNull_CastJSON_ValueType, null>>;
type simpleSQL_WithTypeNull_CastJSON_FinalValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNull_CastJSON_FinalValueType, null>>;

const simpleSQL_WithTypeNumber_CastVarchar = sqlTester`Round(1)`.specs<number>().cast('VARCHAR');
type typeof_SimpleSQL_WithTypeNumber_CastVarchar = typeof simpleSQL_WithTypeNumber_CastVarchar;
type typeof_SimpleSQL_WithTypeNumber_CastVarchar_ValueType = typeof_SimpleSQL_WithTypeNumber_CastVarchar extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_SimpleSQL_WithTypeNumber_CastVarchar_FinalValueType = typeof_SimpleSQL_WithTypeNumber_CastVarchar extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type simpleSQL_WithTypeNumber_CastVarchar_ValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNumber_CastVarchar_ValueType, string>>;
type simpleSQL_WithTypeNumber_CastVarchar_FinalValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeNumber_CastVarchar_FinalValueType, string>>;

const simpleSQL_WithTypeObj_CastJSONB = sqlTester`json_build_object('customerId',${customerIdQC})`.specs<{ customerId: number }>().cast('JSONB');
type typeof_SimpleSQL_WithTypeObj_CastJSONB = typeof simpleSQL_WithTypeObj_CastJSONB;
type typeof_SimpleSQL_WithTypeObj_CastJSONB_ValueType = typeof_SimpleSQL_WithTypeObj_CastJSONB extends IQueryExpression<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_SimpleSQL_WithTypeObj_CastJSONB_FinalValueType = typeof_SimpleSQL_WithTypeObj_CastJSONB extends IQueryExpression<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type simpleSQL_WithTypeObj_CastJSONB_ValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeObj_CastJSONB_ValueType, { customerId: number }>>;
type simpleSQL_WithTypeObj_CastJSONB_FinalValueType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithTypeObj_CastJSONB_FinalValueType, { customerId: number }>>;

const simpleSQL_WithComparison = sqlTester`${customerIdQC.gt(paramTester("param"))}`;
type typeof_SimpleSQL_WithComparison = typeof simpleSQL_WithComparison;
type typeof_SimpleSQL_WithComparison_Params = typeof_SimpleSQL_WithComparison extends IQueryExpression<any, infer TParams, any, any, any, any, any> ? TParams : never;
type typeof_SimpleSQL_WithComparison_Param1Name = typeof_SimpleSQL_WithComparison_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type simpleSQL_WithComparison_ParamLength_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithComparison_Params["length"], 1>>;
type simpleSQL_WithComparison_Param1Name_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_WithComparison_Param1Name, "param">>;

const simpleSQL_InSelectQuery = customersTable.select((tbl, { sql, param }) => [sql`Round${param("roundParam")}`.specs<number, 'round'>()]);
type typeof_SimpleSQL_InSelectQuery = typeof simpleSQL_InSelectQuery;
type typeof_SimpleSQL_InSelectQuery_ResultCols = typeof_SimpleSQL_InSelectQuery extends QueryBuilder<any, any, any, any, infer TResultCols, any, any, any> ? TResultCols : never;
type typeof_SimpleSQL_InSelectQuery_ResultType = ColumnsToResultMap<any, typeof_SimpleSQL_InSelectQuery_ResultCols>;
type typeof_SimpleSQL_InSelectQuery_Params = typeof_SimpleSQL_InSelectQuery extends QueryBuilder<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_SimpleSQL_InSelectQuery_Param1Name = typeof_SimpleSQL_InSelectQuery_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type simpleSQL_InSelectQuery_ResultType_Expected = { round: number }[];
type simpleSQL_InSelectQuery_ResultType_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_InSelectQuery_ResultType, simpleSQL_InSelectQuery_ResultType_Expected>>;
type simpleSQL_InSelectQuery_ParamLength_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_InSelectQuery_Params["length"], 1>>;
type simpleSQL_InSelectQuery_Param1Name_Test = AssertTrue<AssertEqual<typeof_SimpleSQL_InSelectQuery_Param1Name, "roundParam">>;