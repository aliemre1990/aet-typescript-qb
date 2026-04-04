import type { ColumnsToResultMap } from "../../query/_types/result.js";
import type QueryParam from "../../query/param.js";
import type QueryBuilder from "../../query/queryBuilder.js";
import { customersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const joinWithParams = customersTable
    .join("INNER", customersTable.as("c2"), (tables, { param, and }) => and(tables.customers.id.eq(tables.c2.id), tables.customers.createdBy.eq(param("createdByParam"))))
    .select();
type typeof_JoinWithParams = typeof joinWithParams;
type typeof_JoinWithParams_Params = typeof joinWithParams extends QueryBuilder<any, any, any, any, any, any, infer TParams, any, any> ? TParams : never;
type typeof_JoinWithParams_Param1Name = typeof_JoinWithParams_Params[0] extends QueryParam<any, infer TName, any, any, any> ? TName : never;
type typeof_JoinWithParams_Param1Type = typeof_JoinWithParams_Params[0] extends QueryParam<any, any, infer TType, any, any> ? TType : never;
type typeof_JoinWithParams_ResultCols = typeof joinWithParams extends QueryBuilder<any, any, any, any, any, infer TResult, any, any, any> ? TResult : never;
type typeof_JoinWithParams_ResultType = ColumnsToResultMap<any, typeof_JoinWithParams_ResultCols>;
type typeof_JoinWithParams_ResultType_Expected = { id: number; name: string; customerTypeId: number; createdBy: number; }[];
type joinWithParams_ParamsLength_Test = AssertTrue<AssertEqual<typeof_JoinWithParams_Params["length"], 1>>;
type joinWithParams_Param1Name_Test = AssertTrue<AssertEqual<typeof_JoinWithParams_Param1Name, "createdByParam">>;
type joinWithParams_Param1Type_Test = AssertTrue<AssertEqual<typeof_JoinWithParams_Param1Type, number | null>>;
type joinWithParams_ResultType_Test = AssertTrue<AssertEqual<typeof_JoinWithParams_ResultType, typeof_JoinWithParams_ResultType_Expected>>;