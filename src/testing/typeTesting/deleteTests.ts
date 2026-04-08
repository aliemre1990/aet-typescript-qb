import type BaseQueryBuilder from "../../query/_baseClasses/BaseQueryBuilder";
import type { ColumnsToResultMap } from "../../query/_types/result";
import { customersTable } from "../_tables";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities";

const deleteReturning_All = customersTable.delete().returning();
type typeof_DeleteReturning_All = typeof deleteReturning_All;
type typeof_DeleteReturning_All_ResultCols = typeof_DeleteReturning_All extends BaseQueryBuilder<any, infer TResult, any, any, any> ? TResult : never;
type typeof_DeleteReturning_All_ResultType = ColumnsToResultMap<any, typeof_DeleteReturning_All_ResultCols>;
type typeof_DeleteReturning_All_ResultType_Expected = { id: number, name: string, customerTypeId: number, createdBy: number }[];
type deleteReturning_All_ResultType_Test = AssertTrue<AssertEqual<typeof_DeleteReturning_All_ResultType, typeof_DeleteReturning_All_ResultType_Expected>>;

const deleteReturning_Selection = customersTable.delete().returning(tables => [tables.customers.id]);
type typeof_DeleteReturning_Selection = typeof deleteReturning_Selection;
type typeof_DeleteReturning_Selection_ResultCols = typeof_DeleteReturning_Selection extends BaseQueryBuilder<any, infer TResult, any, any, any> ? TResult : never;
type typeof_DeleteReturning_Selection_ResultType = ColumnsToResultMap<any, typeof_DeleteReturning_Selection_ResultCols>;
type typeof_DeleteReturning_Selection_ResultType_Expected = { id: number }[];
type deleteReturning_Selection_ResultType_Test = AssertTrue<AssertEqual<typeof_DeleteReturning_Selection_ResultType, typeof_DeleteReturning_Selection_ResultType_Expected>>;