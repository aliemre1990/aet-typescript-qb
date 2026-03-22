import type { DbType } from "../../db.js";
import type QueryParam from "../param.js";
import type { PgColumnType } from "../../table/columnTypes.js";
import type { DetermineValueType, IComparable } from "./IComparable.js";

const basicComparisonOperations = {
    eq: { name: 'EQ', symbol: "=" },
    notEq: { name: 'NOT_EQ', symbol: "!=" },
    gt: { name: 'GT', symbol: ">" },
    gte: { name: 'GTE', symbol: ">=" },
    lt: { name: 'LT', symbol: "<" },
    lte: { name: 'LTE', symbol: "<=" }
} as const;

const betweenComparisonOperations = {
    between: { name: 'BETWEEN', symbol: "BETWEEN" },
    notBetween: { name: 'NOT_BETWEEN', symbol: "NOT BETWEEN" }
} as const;

const inComparisonOperations = {
    in: { name: 'IN', symbol: "IN" },
    notIn: { name: 'NOT_IN', symbol: "NOT IN" }
} as const;

const isNullComparisonOperations = {
    isNull: { name: 'IS_NULL', symbol: "IS NULL" },
    isNotNull: { name: 'IS_NOT_NULL', symbol: "IS NOT NULL" }
} as const;

const likeComparisonOperations = {
    like: { name: 'LIKE', symbol: "LIKE" },
    notLike: { name: 'NOT_LIKE', symbol: "NOT LIKE" },
    iLike: { name: 'ILIKE', symbol: "ILIKE" },
    notILike: { name: 'NOT_ILIKE', symbol: "NOT ILIKE" }
} as const;

type BasicComparisonOperationType = (typeof basicComparisonOperations)[keyof typeof basicComparisonOperations];
type BetweenComparisonOperationType = (typeof betweenComparisonOperations)[keyof typeof betweenComparisonOperations];
type InComparisonOperationType = (typeof inComparisonOperations)[keyof typeof inComparisonOperations];
type IsNullComparisonOperationType = (typeof isNullComparisonOperations)[keyof typeof isNullComparisonOperations];
type LikeComparisonOperationType = (typeof likeComparisonOperations)[keyof typeof likeComparisonOperations];

type ComparisonOperationType =
    BasicComparisonOperationType |
    BetweenComparisonOperationType |
    IsNullComparisonOperationType |
    LikeComparisonOperationType |
    InComparisonOperationType;

interface IComparisonOperation<
    TDbType extends DbType,
    TOperation extends ComparisonOperationType,
    TParams extends readonly QueryParam<TDbType, string, any, any, any>[] | undefined,
    TReturnType extends boolean | null,
    TAs extends string | undefined,
    TCastType extends PgColumnType | undefined
> extends IComparable<
    TDbType,
    TParams,
    TReturnType,
    TReturnType,
    undefined,
    TAs,
    TCastType
> {
    operation: TOperation;
}

export type {
    IComparisonOperation,
    BasicComparisonOperationType,
    BetweenComparisonOperationType,
    InComparisonOperationType,
    IsNullComparisonOperationType,
    LikeComparisonOperationType,
    ComparisonOperationType
}

export {
    basicComparisonOperations,
    betweenComparisonOperations,
    inComparisonOperations,
    isNullComparisonOperations,
    likeComparisonOperations
}