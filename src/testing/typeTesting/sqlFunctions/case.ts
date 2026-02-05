import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type SQLCaseExpression from "../../../query/caseExpression.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import type LiteralValue from "../../../query/literalValue.js";
import type QueryParam from "../../../query/param.js";
import type { DbValueTypes } from "../../../table/column.js";
import { caseTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertExtends, AssertTrue } from "../_typeTestingUtilities.js";

const caseNoBranch = caseTester();
type caseNoBranchResultType = typeof caseNoBranch extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : any;
type caseNoBranchParams = typeof caseNoBranch extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type caseNoBranchResultTypeTest = AssertTrue<AssertEqual<caseNoBranchResultType, never>>;
type caseNoBranchParamsTest = AssertTrue<AssertEqual<caseNoBranchParams, undefined>>;

const caseNoBranchMainExpression = caseTester(customersTable.select((tables) => [tables.customers.id]));
type caseNoBranchMainExpressionResultType = typeof caseNoBranchMainExpression extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : any;
type caseNoBranchMainExpressionParams = typeof caseNoBranchMainExpression extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type caseNoBranchMainExpressionResultTypeTest = AssertTrue<AssertEqual<caseNoBranchMainExpressionResultType, never>>;
type caseNoBranchMainExpressionParamsTest = AssertTrue<AssertEqual<caseNoBranchMainExpressionParams, undefined>>;

const caseNoBranchMainExpressionWithParams = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))));
type caseNoBranchMainExpressionWithParamsParams = typeof caseNoBranchMainExpressionWithParams extends SQLCaseExpression<any, never, any, any, any, infer TParams, any, any> ? TParams : never;
type caseNoBranchMainExpressionWithParamsParamType = caseNoBranchMainExpressionWithParamsParams[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseNoBranchMainExpressionWithParamsParamTypeTest = AssertTrue<AssertEqual<caseNoBranchMainExpressionWithParamsParamType, number | null>>;

/**
 * Only one when branch with literal value
 */
const caseMainExpressionOneWhenWithLiterals = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(1, 2);
type caseMainExpressionOneWhenWithLiteralsResultType = typeof caseMainExpressionOneWhenWithLiterals extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseMainExpressionOneWhenWithLiteralsWhenExpressionsType = typeof caseMainExpressionOneWhenWithLiterals extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseMainExpressionOneWhenWithLiteralsResultTypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithLiteralsResultType, 2 | null>>;
type caseMainExpressionOneWhenWithLiteralsWhenExpressionsTypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithLiteralsWhenExpressionsType, [[1, 2]]>>;

const caseMainExpressionOneWhenWithComparableOverload1 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(1, ({ literal }) => literal(1));
type caseMainExpressionOneWhenWithComparableOverload1ResultType = typeof caseMainExpressionOneWhenWithComparableOverload1 extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseMainExpressionOneWhenWithComparableOverload1ExpressionType = typeof caseMainExpressionOneWhenWithComparableOverload1 extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseMainExpressionOneWhenWithComparableOverload1ResultTypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparableOverload1ResultType, 1 | null>>;
type caseMainExpressionOneWhenWithComparableOverload1ExpressionTypeTest = AssertTrue<AssertExtends<caseMainExpressionOneWhenWithComparableOverload1ExpressionType, [[number, LiteralValue<any, any, any, any>]]>>;

const caseMainExpressionOneWhenWithComparableOverload2 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(({ literal }) => literal(1), 1);
type caseMainExpressionOneWhenWithComparableOverload2ResultType = typeof caseMainExpressionOneWhenWithComparableOverload2 extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseMainExpressionOneWhenWithComparableOverload2ExpressionType = typeof caseMainExpressionOneWhenWithComparableOverload2 extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseMainExpressionOneWhenWithComparableOverload2ResultTypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparableOverload2ResultType, 1 | null>>
type caseMainExpressionOneWhenWithComparableOverload2ExpressionTypeTest = AssertTrue<AssertExtends<caseMainExpressionOneWhenWithComparableOverload2ExpressionType, [[LiteralValue<any, any, any, any>, number]]>>;

const caseMainExpressionOneWhenWithComparables = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(({ literal }) => literal(null), ({ round }) => round(2, 1));
type caseMainExpressionOneWhenWithComparablesResultType = typeof caseMainExpressionOneWhenWithComparables extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseMainExpressionOneWhenWithComparablesExpressionType = typeof caseMainExpressionOneWhenWithComparables extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type caseMainExpressionOneWhenWithComparablesResultTypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesResultType, number | null>>;
type caseMainExpressionOneWhenWithComparablesExpressionTypeTest = AssertTrue<AssertExtends<caseMainExpressionOneWhenWithComparablesExpressionType, [[LiteralValue<any, any, any, any>, ColumnSQLFunction<any, any, any, any, any, any, any, any>]]>>;

const caseMainExpressionOneWhenWithComparablesParamed = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("idParam"))))
    .when(({ param }) => param("when"), ({ round, param }) => round(param("exp"), 1));
type caseMainExpressionOneWhenWithComparablesParamedParams = typeof caseMainExpressionOneWhenWithComparablesParamed extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type caseMainExpressionOneWhenWithComparablesParamedParamsLength = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParams["length"], 3>>;
type caseMainExpressionOneWhenWithComparablesParamedParam1Type = caseMainExpressionOneWhenWithComparablesParamedParams[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam2Type = caseMainExpressionOneWhenWithComparablesParamedParams[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam3Type = caseMainExpressionOneWhenWithComparablesParamedParams[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam1TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam1Type, number | null>>;
type caseMainExpressionOneWhenWithComparablesParamedParam2TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam2Type, number | null>>;
type caseMainExpressionOneWhenWithComparablesParamedParam3TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam3Type, number | null>>;

const caseNoBranchElse = caseTester().else("ali");
type caseNoBranchElseReturnType = typeof caseNoBranchElse extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseNoBranchElseReturnTypeTest = AssertTrue<AssertEqual<caseNoBranchElseReturnType, "ali">>;


const caseNoBranchElseWithComparable = caseTester().else(({ literal }) => literal(null));
type caseNoBranchElseWithComparableResultType = typeof caseNoBranchElseWithComparable extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseNoBranchElseWithComparableElseExpression = typeof caseNoBranchElseWithComparable extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type caseNoBranchElseWithComparableElseExpressionValueType = caseNoBranchElseWithComparableElseExpression extends LiteralValue<any, infer TValue, any, any> ? TValue : never;
type caseNoBranchElseWithComparableReturnTypeTest = AssertTrue<AssertEqual<caseNoBranchElseWithComparableResultType, null>>;
type caseNoBranchElseWithComparableElseExpressionTest = AssertTrue<AssertExtends<caseNoBranchElseWithComparableElseExpression, LiteralValue<any, any, any, any>>>;
type caseNoBranchElseWithComparableElseExpressionValueTypeTest = AssertTrue<AssertEqual<caseNoBranchElseWithComparableElseExpressionValueType, null>>;

const caseWithParams = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(({ param }) => param("when"), ({ round, param }) => round(param("then"), 2))
    .else(({ param, literal }) => param("else"));
type typeofCaseWithParamsResultType = typeof caseWithParams extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeofCaseWithParamsElseExpression = typeof caseWithParams extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type typeofCaseWithParamsElseExpressionParamName = typeofCaseWithParamsElseExpression extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeofCaseWithParamsElseExpressionParamType = typeofCaseWithParamsElseExpression extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParamsParamsType = typeof caseWithParams extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeofCaseWithParamsWhenParamName = typeofCaseWithParamsParamsType[1] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeofCaseWithParamsWhenParamType = typeofCaseWithParamsParamsType[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParamsThenParamName = typeofCaseWithParamsParamsType[2] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeofCaseWithParamsThenParamType = typeofCaseWithParamsParamsType[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParamsElseParamFromParamsParamName = typeofCaseWithParamsParamsType[3] extends QueryParam<any, infer TName, any, any, any, any> ? TName : never;
type typeofCaseWithParamsElseParamFromParamsParamType = typeofCaseWithParamsParamsType[3] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParamsResultTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsResultType, number | null>>;
type caseWithParamsElseExpressionParamTest = AssertTrue<AssertExtends<typeofCaseWithParamsElseExpression, QueryParam<any, any, any, any, any, any>>>;
type caseWithParamsElseExpressionParamNameTest = AssertTrue<AssertEqual<typeofCaseWithParamsElseExpressionParamName, "else">>;
type caseWithParamsElseExpressionParamTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsElseExpressionParamType, number | null>>;
type caseWithParamsParamsLengthTest = AssertTrue<AssertEqual<typeofCaseWithParamsParamsType["length"], 4>>;
type caseWithParamsWhenParamNameTest = AssertTrue<AssertEqual<typeofCaseWithParamsWhenParamName, "when">>;
type caseWithParamsWhenParamTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsWhenParamType, number | null>>;
type caseWithParamsThenParamNameTest = AssertTrue<AssertEqual<typeofCaseWithParamsThenParamName, "then">>;
type caseWithParamsThenParamTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsThenParamType, number | null>>;
type caseWithParamsElseParamFromParamsParamNameTest = AssertTrue<AssertEqual<typeofCaseWithParamsElseParamFromParamsParamName, "else">>;
type caseWithParamsElseParamFromParamsParamTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsElseParamFromParamsParamType, number | null>>;

const caseWithParamsParamAfter = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(1, ({ round }) => round(1, 1))
    .when(({ param }) => param("when"), ({ param }) => param("then"));
type typeofCaseWithParamsParamAfterResultType = typeof caseWithParamsParamAfter extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeofCaseWithParamsParamAfterWhenExpressions = typeof caseWithParamsParamAfter extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;


const caseWithParamsParamBefore = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(({ param }) => param("when"), ({ param }) => param("then"))
    .when(1, ({ round }) => round(1, 1))
type typeofCaseWithParamsParamBeforeResultType = typeof caseWithParamsParamBefore extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeofCaseWithParamsParamBeforeWhenExpressions = typeof caseWithParamsParamBefore extends SQLCaseExpression<any, any, any, any, infer TWhenExps, any, any, any> ? TWhenExps : never;
type typeofCaseWithParamsParamBeforeParams = typeof caseWithParamsParamBefore extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeofCaseWithParamsParamBeforeThenParamType = typeofCaseWithParamsParamBeforeParams[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParamsParamBeforeResultTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsParamBeforeResultType, number | null>>;
type caseWithParamsParamBeforeParamsLengthTest = AssertTrue<AssertEqual<typeofCaseWithParamsParamBeforeParams["length"], 3>>;
type caseWithParamsParamBeforeThenParamEquityTest = AssertTrue<AssertEqual<typeofCaseWithParamsParamBeforeWhenExpressions[0][1], typeofCaseWithParamsParamBeforeParams[2]>>;
type caseWithParamsParamBeforeThenParamTypeTest = AssertTrue<AssertEqual<typeofCaseWithParamsParamBeforeThenParamType, number>>;

const caseWithParams_OnlyParamsNoElse = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(({ param }) => param("when1"), ({ param }) => param("then1"))
    .when(({ param }) => param("when2"), ({ param }) => param("then2"))
    .when(({ param }) => param("when3"), ({ param }) => param("then3"));
type typeofCaseWithParams_OnlyParamsNoElseResultType = typeof caseWithParams_OnlyParamsNoElse extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type typeofCaseWithParams_OnlyParamsNoElseParams = typeof caseWithParams_OnlyParamsNoElse extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeofCaseWithParams_OnlyParamsNoElse_ParamMain = typeofCaseWithParams_OnlyParamsNoElseParams[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParams_OnlyParamsNoElse_ParamWhen1 = typeofCaseWithParams_OnlyParamsNoElseParams[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParams_OnlyParamsNoElse_ParamWhen2 = typeofCaseWithParams_OnlyParamsNoElseParams[3] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type typeofCaseWithParams_OnlyParamsNoElse_ParamWhen3 = typeofCaseWithParams_OnlyParamsNoElseParams[5] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseWithParams_OnlyParamsNoElse_ResultTypeTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElseResultType, DbValueTypes | null>>;
type caseWithParams_OnlyParamsNoElse_ParamsLengthTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElseParams["length"], 7>>;
type caseWithParams_OnlyParamsNoElse_ParamMainTypeTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElse_ParamMain, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen1TypeTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElse_ParamWhen1, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen2TypeTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElse_ParamWhen2, number | null>>;
type caseWithParams_OnlyParamsNoElse_ParamWhen3TypeTest = AssertTrue<AssertEqual<typeofCaseWithParams_OnlyParamsNoElse_ParamWhen3, number | null>>;

const caseValid1 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, 2);
const caseValid2 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, ({ round }) => round(2, 1));
const caseValid3 = caseTester(customersTable.select((tables) => [tables.customers.id]))
    .when(1, 1)
    .when(1, ({ round }) => round(2, 1))
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
    .when(({ param }) => param("when"), ({ param }) => param("then"))
    .when(1, ({ round }) => round(1, 1))
    // @ts-expect-error
    .when(1, ({ round }) => "str")
const caseInvalid4 = caseTester(customersTable.select((tables) => [tables.customers.id]).where((tables, { param }) => tables.customers.id.eq(param("where"))))
    .when(({ param }) => param("when"), ({ param }) => param("then"))
    .when(({ param }) => param("when2"), ({ param }) => param("then2"))
    .when(1, ({ round }) => round(1, 1))
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