import { dbTypes } from "../db.js";
import { generateArithmeticAddition } from "../query/arithmetic/addition.js";
import { generateSQLCaseFn } from "../query/caseExpression.js";
import { jsonBuildObjectFn } from "../query/functions/jsonFunctions/jsonBuildObject.js";
import generateRoundFn from "../query/functions/round.js";
import { generateLiteralValueFn } from "../query/literalValue.js";
import { generateParamFn } from "../query/param.js";
import generateSumFn from "../query/aggregation/sum.js";//Keep this below, it causes circullar reference issues.
import { generateCoalesceFn } from "../query/functions/coalesce.js";

const paramTester = generateParamFn(dbTypes.postgresql);
const literalTester = generateLiteralValueFn(dbTypes.postgresql);
const caseTester = generateSQLCaseFn(dbTypes.postgresql);
const jsonBuildObjectTester = jsonBuildObjectFn;

const roundTester = generateRoundFn(dbTypes.postgresql);

const sumTester = generateSumFn(dbTypes.postgresql);

const arithmeticAdditionTester = generateArithmeticAddition(dbTypes.postgresql);

const coalesceTester = generateCoalesceFn(dbTypes.postgresql);

export {
    coalesceTester,
    paramTester,
    literalTester,
    caseTester,
    jsonBuildObjectTester,
    roundTester,
    sumTester,
    arithmeticAdditionTester
}