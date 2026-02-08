import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type SQLCaseExpression from "../../../query/caseExpression.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import type LiteralValue from "../../../query/literalValue.js";
import type QueryParam from "../../../query/param.js";
import type { DbValueTypes } from "../../../table/column.js";
import { caseTester, literalTester, paramTester, roundTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertExtends, AssertTrue } from "../_typeTestingUtilities.js";

const caseWithNoBranch = caseTester();
type typeof_CaseWithNoBranch_ResultType = typeof caseWithNoBranch extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : any;
type typeof_CaseWithNoBranch_Params = typeof caseWithNoBranch extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type caseWithNoBranch_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_ResultType, never>>;
type caseWithNoBranch_ParamsTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_Params, undefined>>;

const caseWithNoBranch_WithMainExpression = caseTester(customersTable.select((tables) => [tables.customers.id]));
type typeof_CaseWithNoBranch_WithMainExpression_ResultType = typeof caseWithNoBranch_WithMainExpression extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : any;
type typeof_CaseWithNoBranch_WithMainExpression_Params = typeof caseWithNoBranch_WithMainExpression extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type caseWithNoBranch_WithMainExpression_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_WithMainExpression_ResultType, never>>;
type caseWithNoBranch_WithMainExpression_ParamsTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_WithMainExpression_Params, undefined>>;

const caseWithNoBranch_WithMainExpressionWithParams = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))));
type typeof_CaseWithNoBranch_WithMainExpressionWithParams_Params = typeof caseWithNoBranch_WithMainExpressionWithParams extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithNoBranch_WithMainExpressionWithParams_MainParamType = typeof_CaseWithNoBranch_WithMainExpressionWithParams_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithNoBranch_WithMainExpression_WithParams_MainParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_WithMainExpressionWithParams_MainParamType, number | null>>;

const caseWithMainExpression_OneWhenWithLiterals = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(1, 2);
type typeof_CaseWithMainExpression_OneWhenWithLiterals_ResultType = typeof caseWithMainExpression_OneWhenWithLiterals extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithMainExpression_OneWhenWithLiterals_WhenExpressionsType = typeof caseWithMainExpression_OneWhenWithLiterals extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseWithMainExpression_OneWhenWithLiterals_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithLiterals_ResultType, 2 | null>>;
type caseWithMainExpression_OneWhenWithLiterals_WhenExpressionsTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithLiterals_WhenExpressionsType, [[1, 2]]>>;

const caseWithMainExpression_OneWhen_WithWhenComparable = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(1, literalTester(1));
type typeof_CaseWithMainExpression_OneWhen_WithWhenComparable_ResultType = typeof caseWithMainExpression_OneWhen_WithWhenComparable extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithMainExpression_OneWhen_WithWhenComparable_ExpresisonType = typeof caseWithMainExpression_OneWhen_WithWhenComparable extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseWithMainExpression_OneWhen_WithWhenComparable_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhen_WithWhenComparable_ResultType, 1 | null>>;
type caseWithMainExpression_OneWhen_WithWhenComparable_ExpressionTypeTest = AssertTrue<AssertExtends<typeof_CaseWithMainExpression_OneWhen_WithWhenComparable_ExpresisonType, [[number, LiteralValue<any, any, any, any>]]>>;

const caseWithMainExpression_OneWhen_WithThenComparable = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(literalTester(1), 1);
type typeof_CaseWithMainExpression_OneWhen_WithThenComparable_ResultType = typeof caseWithMainExpression_OneWhen_WithThenComparable extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithMainExpression_OneWhen_WithThenComparable_ExpressionType = typeof caseWithMainExpression_OneWhen_WithThenComparable extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseWithMainExpression_OneWhen_WithThenComparable_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhen_WithThenComparable_ResultType, 1 | null>>
type caseWithMainExpression_OneWhen_WithThenComparable_ExpressionTypeTest = AssertTrue<AssertExtends<typeof_CaseWithMainExpression_OneWhen_WithThenComparable_ExpressionType, [[LiteralValue<any, any, any, any>, number]]>>;

const caseWithMainExpression_OneWhenWithComparables = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(literalTester(null), roundTester(2, 1));
type typeof_CaseWithMainExpression_OneWhenWithComparables_ResultType = typeof caseWithMainExpression_OneWhenWithComparables extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ExpressionType = typeof caseWithMainExpression_OneWhenWithComparables extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseWithMainExpression_OneWhenWithComparables_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ResultType, number | null>>;
type caseWithMainExpression_OneWhenWithComparables_ExpressionTypeTest = AssertTrue<AssertExtends<typeof_CaseWithMainExpression_OneWhenWithComparables_ExpressionType, [[LiteralValue<any, any, any, any>, ColumnSQLFunction<any, any, any, any, any, any, any, any>]]>>;

const caseWithMainExpression_OneWhenWithComparables_ThenParamed = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(paramTester("when"), roundTester(paramTester("then"), 1));
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params = typeof caseWithMainExpression_OneWhenWithComparables_ThenParamed extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamName = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[0] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamType = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamName = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamType = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamType = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamName = typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params[2] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_ParamsLengthTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_Params["length"], 3>>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamName, "idParam">>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_MainParamType, number | null>>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamType, number | null>>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_WhenParamName, "when">>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamType, number | null>>;
type caseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithMainExpression_OneWhenWithComparables_ThenParamed_ThenParamName, "then">>;

const caseWithNoBranch_WithElse = caseTester().else("ali");
type typeof_CaseWithNoBranch_WithElse_ResultType = typeof caseWithNoBranch_WithElse extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseWithNoBranch_WithElse_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_WithElse_ResultType, "ali">>;

const caseWithNoBranch_ElseWithComparable = caseTester().else(literalTester(null));
type typeof_CaseWithNoBranch_ElseWithComparable_ResultType = typeof caseWithNoBranch_ElseWithComparable extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithNoBranch_ElseWithComparable_ElseExpression = typeof caseWithNoBranch_ElseWithComparable extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type typeof_CaseWithNoBranch_ElseWithComparable_ElseExpressionValueType = typeof_CaseWithNoBranch_ElseWithComparable_ElseExpression extends LiteralValue<any, infer TValue, any, any> ? TValue : never;
type caseWithNoBranch_ElseWithComparable_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_ElseWithComparable_ResultType, null>>;
type caseWithNoBranch_ElseWithComparable_ElseExpressionTest = AssertTrue<AssertExtends<typeof_CaseWithNoBranch_ElseWithComparable_ElseExpression, LiteralValue<any, any, any, any>>>;
type caseWithNoBranch_ElseWithComparable_ElseExpressionValueTypeTest = AssertTrue<AssertEqual<typeof_CaseWithNoBranch_ElseWithComparable_ElseExpressionValueType, null>>;

const caseWithParams = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), roundTester(paramTester("then"), 2))
    .else(paramTester("else"));
type typeof_CaseWithParams_ResultType = typeof caseWithParams extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithParams_ElseExpression = typeof caseWithParams extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type typeof_CaseWithParams_ElseExpressionParamName = typeof_CaseWithParams_ElseExpression extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithParams_ElseExpressionParamType = typeof_CaseWithParams_ElseExpression extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_ParamsType = typeof caseWithParams extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithParams_WhenParamName = typeof_CaseWithParams_ParamsType[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithParams_WhenParamType = typeof_CaseWithParams_ParamsType[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_ThenParamName = typeof_CaseWithParams_ParamsType[2] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithParams_ThenParamType = typeof_CaseWithParams_ParamsType[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_ElseParamFromParamsParamName = typeof_CaseWithParams_ParamsType[3] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeof_CaseWithParams_ElseParamFromParamsParamType = typeof_CaseWithParams_ParamsType[3] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParams_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ResultType, number | null>>;
type caseWithParams_ElseExpressionParamTest = AssertTrue<AssertExtends<typeof_CaseWithParams_ElseExpression, QueryParam<any, any, any, any, any, any>>>;
type caseWithParams_ElseExpressionParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ElseExpressionParamName, "else">>;
type caseWithParams_ElseExpressionParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ElseExpressionParamType, number | null>>;
type caseWithParams_ParamsLengthTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamsType["length"], 4>>;
type caseWithParams_WhenParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithParams_WhenParamName, "when">>;
type caseWithParams_WhenParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_WhenParamType, number | null>>;
type caseWithParams_ThenParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ThenParamName, "then">>;
type caseWithParams_ThenParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ThenParamType, number | null>>;
type caseWithParams_ElseParamFromParamsParamNameTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ElseParamFromParamsParamName, "else">>;
type caseWithParams_ElseParamFromParamsParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ElseParamFromParamsParamType, number | null>>;

const caseWithParams_ParamAfter = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(1, roundTester(1, 1))
    .when(paramTester("when"), paramTester("then"));
type typeof_CaseWithParams_ParamAfter_ResultType = typeof caseWithParams_ParamAfter extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeofCaseWithParamsParamAfterParams = typeof caseWithParams_ParamAfter extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithParams_ParamAfter_ThenParamType = typeofCaseWithParamsParamAfterParams[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_ParamAfter_ThenParamName = typeofCaseWithParamsParamAfterParams[2] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type caseWithParams_ParamAfter_ThenParamName_Test = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamAfter_ThenParamName, "then">>;
type caseWithParams_ParamAfter_ThenParamType_Test = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamAfter_ThenParamType, number | null>>;
type caseWithParams_ParamAfter_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamAfter_ResultType, number | null>>;

const caseWithParams_ParamBefore = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), paramTester("then"))
    .when(1, roundTester(1, 1))
type typeof_CaseWithParams_ParamBefore_ResultType = typeof caseWithParams_ParamBefore extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithParams_ParamBefore_WhenExpressions = typeof caseWithParams_ParamBefore extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type typeof_CaseWithParams_ParamBefore_Params = typeof caseWithParams_ParamBefore extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithParams_ParamBefore_ThenParamType = typeof_CaseWithParams_ParamBefore_Params[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParams_ParamBefore_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamBefore_ResultType, number | null>>;
type caseWithParams_ParamBefore_ParamsLengthTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamBefore_Params["length"], 3>>;
type caseWithParams_ParamBefore_ThenParamEquityTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamBefore_WhenExpressions[0][1], typeof_CaseWithParams_ParamBefore_Params[2]>>;
type caseWithParams_ParamBefore_ThenParamTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_ParamBefore_ThenParamType, number | null>>;

const caseWithParams_OnlyParamsNoElse = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when1"), paramTester("then1"))
    .when(paramTester("when2"), paramTester("then2"))
    .when(paramTester("when3"), paramTester("then3"));
type typeof_CaseWithParams_OnlyParamsNoElse_ResultType = typeof caseWithParams_OnlyParamsNoElse extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithParams_OnlyParamsNoElse_Params = typeof caseWithParams_OnlyParamsNoElse extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_CaseWithParams_OnlyParamsNoElse_ParamMain = typeof_CaseWithParams_OnlyParamsNoElse_Params[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen1 = typeof_CaseWithParams_OnlyParamsNoElse_Params[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen2 = typeof_CaseWithParams_OnlyParamsNoElse_Params[3] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen3 = typeof_CaseWithParams_OnlyParamsNoElse_Params[5] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParams_OnlyParamsNoElse_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_ResultType, DbValueTypes | null>>;
type caseWithParams_OnlyParamsNoElse_ParamsLengthTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_Params["length"], 7>>;
type caseWithParams_OnlyParamsNoElse_ParamMainTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_ParamMain, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen1TypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen1, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen2TypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen2, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen3TypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_OnlyParamsNoElse_ParamWhen3, number | null>>;

const caseWithParams_NonNullResultType = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), paramTester("then").type<number>())
    .when(1, roundTester(1, 1))
    .else(1);
type typeof_CaseWithParams_NonNullResultType_ResultType = typeof caseWithParams_NonNullResultType extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithParams_NonNullResultType_WhenExps = typeof caseWithParams_NonNullResultType extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type typeof_CaseWithParams_NonNullResultType_ElseExp = typeof caseWithParams_NonNullResultType extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type caseWithParams_NonNullResultType_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_NonNullResultType_ResultType, number>>;

const caseWithParams_NullResultType = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), paramTester("then"))
    .when(1, roundTester(1, 1))
    .else(1);
type typeof_CaseWithParams_NullResultType_ResultType = typeof caseWithParams_NullResultType extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeof_CaseWithParams_NullResultType_WhenExpressions = typeof caseWithParams_NullResultType extends SQLCaseExpression<any, any, any, any, infer TWhen, any, any, any> ? TWhen : never;
type caseWithParams_NullResultType_ResultTypeTest = AssertTrue<AssertEqual<typeof_CaseWithParams_NullResultType_ResultType, number | null>>;

const caseValid1 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, 2);
const caseValid2 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, roundTester(2, 1));
const caseValid3 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, roundTester(2, 1))
    .else(1);

const caseInvalid1 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    // @ts-expect-error
    .when(1, "a");
const caseInvalid2 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, "a")
    // @ts-expect-error
    .when(1, ({ round }) => round(2, 1));
const caseInvalid3 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), paramTester("then"))
    .when(1, roundTester(1, 1))
    // @ts-expect-error
    .when(1, ({ round }) => "str")
const caseInvalid4 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(paramTester("when"), paramTester("then"))
    .when(paramTester("when2"), paramTester("then2"))
    .when(1, roundTester(1, 1))
    // @ts-expect-error
    .when(({ param }) => param("when2"), ({ param }) => param("then3").type<string>())
const caseInvalid5 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    // @ts-expect-error
    .when(({ param }) => param("when").type<string>(), ({ param }) => param("then"))


// const caseWithParamOnMainExpression = caseTester(customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("eq")))).when(1, roundTester(1, 2)).when(2, 2);
// // const caseWithParamOnMainExpression = caseTester(customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("eq"))));
// type typeofCaseWithParamOnMainExpression = typeof caseWithParamOnMainExpression;
// type caseWithParamOnMainExpressionParams = typeofCaseWithParamOnMainExpression extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
// type caseWithParamOnMainExpressionParam1Type = caseWithParamOnMainExpressionParams[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
// type caseWithParamOnMainExpressionTest = AssertTrue<AssertEqual<caseWithParamOnMainExpressionParam1Type, number | null>>;

// type typeofWhenExpressions = typeofCaseWithParamOnMainExpression extends SQLCaseExpression<any, any, any, any, infer TWhenExpressions, any, any, any> ? TWhenExpressions : never;