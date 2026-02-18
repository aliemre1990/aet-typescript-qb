import { type PgDbType } from "../../../db.js";
import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type { InferParamsFromOps } from "../../../query/_types/paramAccumulationComparison.js";
import type ColumnComparisonOperation from "../../../query/comparisons/_comparisonOperations.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import QueryParam from "../../../query/param.js";
import { customerCreatedByQC, customerIdQC, customerNameQC, empSalaryQC } from "../../_columns.js";
import { coalesceTester, paramTester } from "../../_functions.js";
import { customersTable, employeesTable, ordersTable, usersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const coalesce_NonNull = coalesceTester(empSalaryQC, 2000);
type typeof_Coalesce_NonNull = typeof coalesce_NonNull;
type typeof_Coalesce_NonNull_FinalValueType = typeof_Coalesce_NonNull extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type coalesce_NonNull_FinalValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_NonNull_FinalValueType, number>>;

const coalesce_Null = coalesceTester(empSalaryQC, null);
type typeof_Coalesce_Null = typeof coalesce_Null;
type typeof_Coalesce_Null_ValueType = typeof_Coalesce_Null extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeof_Coalesce_Null_FinalValueType = typeof_Coalesce_Null extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type coalesce_Null_ValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_Null_ValueType, number>>;
type coalesce_Null_FinalValueType_Test = AssertTrue<AssertEqual<typeof_Coalesce_Null_FinalValueType, number | null>>;

const coalesce_WithParams_NullableNumberParamBefore = coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2"));
type typeof_Coalesce_WithParams_NullableNumberParamBefore = typeof coalesce_WithParams_NullableNumberParamBefore;


/**
 * Coalesce with params tests
 */
coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2"));
coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2").type<number>());
// @ts-expect-error
coalesceTester(paramTester("param1").type<number | null>(), paramTester("param2").type<string>());
// @ts-expect-error
coalesceTester(customerIdQC, paramTester("param1").type<string>());


const CoalesceWithTypedParams = customersTable
    .select((cols, { coalesce, param }) => {

        return [
            coalesce(param("param1").type<number>(), param("param2").type<number | null>(), param("param3")).as("coalesceResult")
        ]
    }
    ).exec;
type CoalesceWithTypedParamsReturnType = ReturnType<typeof CoalesceWithTypedParams>;
type CoalesceWithTypedParamsResult = { coalesceResult: number }[];
type CoalesceWithTypedParamsTest = AssertTrue<AssertEqual<CoalesceWithTypedParamsResult, CoalesceWithTypedParamsReturnType>>;

type CoalesceWithTypedParamsParams = typeof CoalesceWithTypedParams extends (param: infer TParam) => any ? TParam : never;
type CoalesceWithTypeParamsParamsResult = { param1: number, param2: number | null, param3: number | null };
type CoalesceWithTypedParamsParamsTest = AssertTrue<AssertEqual<CoalesceWithTypedParamsParams, CoalesceWithTypeParamsParamsResult>>


/**
 * 
 */
const pgCoalescePlainWithParam = coalesceTester(1, 2, paramTester("param"));

type pgCoalescePlainWithParamType = typeof pgCoalescePlainWithParam;
type pgCoalescePlainWithParamArgs = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, infer TArgs, any, any, any, any, any> ? TArgs : never;
type pgCoalescePlainWithParamArg0 = pgCoalescePlainWithParamArgs[0];
type pgCoalescePlainWithParamArg1 = pgCoalescePlainWithParamArgs[1];
type pgCoalescePlainWithParamArg2 = pgCoalescePlainWithParamArgs[2];
type pgCoalescePlainWithParamReturnType = pgCoalescePlainWithParamType extends ColumnSQLFunction<any, any, any, infer TRet, any, any, any, any> ? TRet : never;

type pgCoalescePlainWithParamLengthTest = AssertTrue<AssertEqual<3, pgCoalescePlainWithParamArgs["length"]>>;
type pgCoalescePlainWithParamReturnTypeTest = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamReturnType>>
type pgCoalescePlainWithParamArg0Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg0>>;
type pgCoalescePlainWithParamArg1Test = AssertTrue<AssertEqual<number, pgCoalescePlainWithParamArg1>>;
type pgCoalescePlainWithParamArg2Test = AssertTrue<AssertEqual<QueryParam<PgDbType, "param", number | null, any, any>, pgCoalescePlainWithParamArg2>>;

/**
 * Misc
 */
// @ts-expect-error
coalesceTester(customerIdQC, customerNameQC);

// @ts-expect-error
coalesceTester(customerIdQC, "error");

const nonNullCoalesce = coalesceTester(customerIdQC, 2);

const nullCoalesce = coalesceTester(empSalaryQC);
type NullCoalesce = typeof nullCoalesce;
type NullCoalesceRetType = NullCoalesce extends ColumnSQLFunction<any, any, any, infer TRet, any, any, any, any> ? TRet : never;
type NullCoalesceTest = AssertTrue<AssertEqual<number | null, NullCoalesceRetType>>

// @ts-expect-error
coalesceTester(customerNameQC).eq(1);

coalesceTester(customerIdQC).eq(1);

coalesceTester(customerIdQC).eq(customerCreatedByQC);

/**
 * 
 */
const InferParamsFromCoalesce = customersTable
    .join('INNER', () => usersTable, (cols, { coalesce, param }) => {

        const res1 = coalesce(
            1, 2, param("param1"), coalesce(1, 2, 3, param("param2"), coalesce(1, 2, 3, 4, param("param3")))
        ).eq(param("param4"));

        type tp = typeof res1;
        type tp1 = tp extends ColumnComparisonOperation<any, any, any, infer TP> ? TP : never;

        return res1;
    })
    .join('INNER', () => usersTable.as('parentUsers'), (cols, { and, coalesce, param }) => {
        const res = and(
            coalesce("asdf", param("coalesceAnd1")).eq("sadf"),
            coalesce(new Date(), param("coalesceAnd2")).eq(new Date())
        );

        return res;
    })
    .join('INNER', () => ordersTable, (cols) => cols.users.userName.eq(cols.customers.name))
    .select(cols => [cols.customers.id])
    .exec;

type InferParamsFromCoalesceResult = typeof InferParamsFromCoalesce;
type InferParamsFromCoalesceParams = InferParamsFromCoalesceResult extends (params: infer TParam) => any ? TParam : never;
type InferParamsFromCoalesceParamsResult = {
    param3: number | null;
    param2: number | null;
    param1: number | null;
    param4: number | null;
    coalesceAnd1: string | null;
    coalesceAnd2: Date | null;
};
type InferParamsFromCoalesceTest = AssertTrue<AssertEqual<InferParamsFromCoalesceParamsResult, InferParamsFromCoalesceParams>>;

/**
 * 
 */
coalesceTester(empSalaryQC, 100).between(100, 200);
coalesceTester(empSalaryQC, 100).between(100, null);
coalesceTester(empSalaryQC, null).between(500, null);
// @ts-expect-error
coalesceTester(customerNameQC, "ali").between(100, 500);
coalesceTester(customerNameQC, "ali").between(coalesceTester("adsf"), coalesceTester("asdfxcv", null));

/**
 * 
 */
const betweenCoalesceParamed = coalesceTester(customerNameQC, "ali").between(paramTester("betLeft"), coalesceTester("asdf", paramTester("betRight")));

type typeofBetweenCoalesceParamed = typeof betweenCoalesceParamed;
type betweenCoalesceParamedParams = InferParamsFromOps<typeofBetweenCoalesceParamed>;

type betweenCoalesceParamedParamLengthTest = AssertTrue<AssertEqual<2, betweenCoalesceParamedParams["length"]>>;

type betweenCoalesceParamedFirstParamRes = QueryParam<PgDbType, "betLeft", string | null, any, any>;
type betweenCoalesceParamedFirstParamTest = AssertTrue<AssertEqual<betweenCoalesceParamedFirstParamRes, betweenCoalesceParamedParams[0]>>;

type betweenCoalesceParamedSecondParamRes = QueryParam<PgDbType, "betRight", string | null, any, any>;
type betweenCoalesceParamedSecondParamTest = AssertTrue<AssertEqual<betweenCoalesceParamedSecondParamRes, betweenCoalesceParamedParams[1]>>;

