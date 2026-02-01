import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type SQLCaseExpression from "../../../query/caseExpression.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import type LiteralValue from "../../../query/literalValue.js";
import type QueryParam from "../../../query/param.js";
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
    .when(({ param }) => param("when").type<string>(), ({ round, param }) => round(param("exp"), 1));
type caseMainExpressionOneWhenWithComparablesParamedParams = typeof caseMainExpressionOneWhenWithComparablesParamed extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type caseMainExpressionOneWhenWithComparablesParamedParamsLength = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParams["length"], 3>>;
type caseMainExpressionOneWhenWithComparablesParamedParam1Type = caseMainExpressionOneWhenWithComparablesParamedParams[0] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam2Type = caseMainExpressionOneWhenWithComparablesParamedParams[1] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam3Type = caseMainExpressionOneWhenWithComparablesParamedParams[2] extends QueryParam<any, any, infer TValueType, any, any, any> ? TValueType : never;
type caseMainExpressionOneWhenWithComparablesParamedParam1TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam1Type, number | null>>;
type caseMainExpressionOneWhenWithComparablesParamedParam2TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam2Type, string>>;
type caseMainExpressionOneWhenWithComparablesParamedParam3TypeTest = AssertTrue<AssertEqual<caseMainExpressionOneWhenWithComparablesParamedParam3Type, number | null>>;

const caseNoBranchElse = caseTester().else("ali");
type caseNoBranchElseReturnType = typeof caseNoBranchElse extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseNoBranchElseReturnTypeTest = AssertTrue<AssertEqual<caseNoBranchElseReturnType, "ali">>;


const caseNoBranchElseWithComparable = caseTester().else(({ literal }) => literal(null));
type caseNoBranchElseWithComparableReturnType = typeof caseNoBranchElseWithComparable extends SQLCaseExpression<any, infer TResultType, any, any, any, any, any, any> ? TResultType : never;
type caseNoBranchElseWithComparableElseExpression = typeof caseNoBranchElseWithComparable extends SQLCaseExpression<any, any, any, infer TElse, any, any, any, any> ? TElse : never;
type caseNoBranchElseWithComparableElseExpressionValueType = caseNoBranchElseWithComparableElseExpression extends LiteralValue<any, infer TValue, any, any> ? TValue : never;
type caseNoBranchElseWithComparableReturnTypeTest = AssertTrue<AssertEqual<caseNoBranchElseWithComparableReturnType, null>>;
type caseNoBranchElseWithComparableElseExpressionTest = AssertTrue<AssertExtends<caseNoBranchElseWithComparableElseExpression, LiteralValue<any, any, any, any>>>;
type caseNoBranchElseWithComparableElseExpressionValueTypeTest = AssertTrue<AssertEqual<caseNoBranchElseWithComparableElseExpressionValueType, null>>;

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


// const caseWithParamOnMainExpression = caseTester(customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("eq")))).when(1, roundTester(1, 2)).when(2, 2);
// // const caseWithParamOnMainExpression = caseTester(customersTable.select().where((tables, { param }) => tables.customers.id.eq(param("eq"))));
// type typeofCaseWithParamOnMainExpression = typeof caseWithParamOnMainExpression;
// type caseWithParamOnMainExpressionParams = typeofCaseWithParamOnMainExpression extends SQLCaseExpression<any, any, any, any, any, infer TParams, any, any> ? TParams : never;
// type caseWithParamOnMainExpressionParam1Type = caseWithParamOnMainExpressionParams[0] extends QueryParam<any, any, infer TVal, any, any> ? TVal : never;
// type caseWithParamOnMainExpressionTest = AssertTrue<AssertEqual<caseWithParamOnMainExpressionParam1Type, number | null>>;

// type typeofWhenExpressions = typeofCaseWithParamOnMainExpression extends SQLCaseExpression<any, any, any, any, infer TWhenExpressions, any, any, any> ? TWhenExpressions : never;