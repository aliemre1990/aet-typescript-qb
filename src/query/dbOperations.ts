import { dbTypes, type DbType, type MySQLDbType, type PgDbType } from "../db.js"
import { existsComparisonOperations } from "./_baseClasses/BaseColumnComparisonOperation.js"
import type { AggregationFunctions, ArithmeticOperations, DbOperations, LogicalOperators } from "./_types/ops.js"
import generateAvgFn from "./aggregation/avg.js"
import { jsonAggFn, jsonbAggFn } from "./aggregation/json/jsonAgg.js"
import generateSumFn from "./aggregation/sum.js"
import { generateArithmeticAddition } from "./arithmetic/addition.js"
import { generateArithmeticDivision } from "./arithmetic/division.js"
import { generateArithmeticExponentiation } from "./arithmetic/exponentiation.js"
import { generateArithmeticModulo } from "./arithmetic/modulo.js"
import { generateArithmeticMultiplication } from "./arithmetic/multiplication.js"
import { generateArithmeticSubtraction } from "./arithmetic/subtract.js"
import { generateSQLCaseFn } from "./caseExpression.js"
import { generateExistsComparison } from "./comparisons/_existsColumnComparisonOperation.js"
import { generateCoalesceFn } from "./functions/coalesce.js"
import { jsonbBuildObjectFn, jsonBuildObjectFn } from "./functions/jsonFunctions/jsonBuildObject.js"
import generateRoundFn from "./functions/round.js"
import { generateLiteralValueFn } from "./literalValue.js"
import { generateAndFn, generateOrFn } from "./logicalOperations.js"
import { generateParamFn } from "./param.js"
import { generateSqlOperatorFn } from "./sqlOperator.js"

/**
 * Aggregation operations
 */
function generateCommonAggregationFunctions<TDbType extends DbType>(dbType: TDbType) {
    return {
        sum: generateSumFn<TDbType>(dbType),
        avg: generateAvgFn<TDbType>(dbType)
    }
}

const pgAggregationFunctions: AggregationFunctions<PgDbType> = {
    jsonAgg: jsonAggFn,
    jsonbAgg: jsonbAggFn,
    ...generateCommonAggregationFunctions(dbTypes.postgresql)
}

const mysqlAggregationFunctions: AggregationFunctions<MySQLDbType> = {
    ...generateCommonAggregationFunctions(dbTypes.mysql)
}

/**
 * Arithmetic operations
 */
function generateCommonArithmeticOperations<TDbType extends DbType>(dbType: TDbType) {
    return {
        operatorAdd: generateArithmeticAddition(dbType),
        operatorSubtract: generateArithmeticSubtraction(dbType),
        operatorMultiplicate: generateArithmeticMultiplication(dbType),
        operatorDivide: generateArithmeticDivision(dbType),
        operatorModulo: generateArithmeticModulo(dbType)
    }
}


const pgArithmeticOperations: ArithmeticOperations<PgDbType> = {
    ...generateCommonArithmeticOperations(dbTypes.postgresql),
    operatorExponentiation: generateArithmeticExponentiation(dbTypes.postgresql)
}

const mysqlArithmeticOperations: ArithmeticOperations<MySQLDbType> = {
    ...generateCommonArithmeticOperations(dbTypes.mysql)

}

/**
 * Function
 */
function generateCommonFunctions<TDbType extends DbType>(dbType: TDbType) {
    return {
        param: generateParamFn(dbType),
        literal: generateLiteralValueFn(dbType),
        sqlCase: generateSQLCaseFn(dbType),
        sql: generateSqlOperatorFn(dbType),
        exists: generateExistsComparison(dbType, existsComparisonOperations.exists),
        notExists: generateExistsComparison(dbType, existsComparisonOperations.notExists),

        coalesce: generateCoalesceFn(dbType),
        round: generateRoundFn(dbType),
    }
}


/**
 * Logical Operations
 */
function generateCommonLogicalOperators<TDbType extends DbType>(dbType: TDbType) {
    return {
        and: generateAndFn(dbType),
        or: generateOrFn(dbType)
    }
}

const pgLogicalOperators: LogicalOperators<PgDbType> = {
    ...generateCommonLogicalOperators(dbTypes.postgresql)
}

const mysqlLogicalOperators: LogicalOperators<MySQLDbType> = {
    ...generateCommonLogicalOperators(dbTypes.mysql)
}

const pgFunctions: DbOperations<PgDbType> = {
    ...generateCommonFunctions(dbTypes.postgresql),

    jsonBuildObject: jsonBuildObjectFn,
    jsonbBuildObject: jsonbBuildObjectFn,

    ...pgArithmeticOperations,
    ...pgAggregationFunctions,
    ...pgLogicalOperators
}

const mysqlFunctions: DbOperations<MySQLDbType> = {
    ...generateCommonFunctions(dbTypes.mysql),

    ...mysqlArithmeticOperations,
    ...mysqlAggregationFunctions,
    ...mysqlLogicalOperators
}



export {
    pgFunctions,
    mysqlFunctions
}