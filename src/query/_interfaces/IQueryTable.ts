import type { DbType } from "../../db.js";
import type QueryParam from "../param.js";
import type { IDbType } from "./IDbType.js";
import type { IName } from "./IName.js";
import type { IQueryExpression, QueryBuilderContext } from "./IQueryExpression.js";

interface IQueryTable<
    TDbType extends DbType,
    TName extends string,
    TColumns extends readonly IQueryExpression<TDbType, any, any, any, any, any, any>[],
    // TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = undefined
> extends IName<TName>, IDbType<TDbType> {
    dbType: TDbType;
    name: TName;
    columnsList: TColumns;

    buildSQL(context?: QueryBuilderContext): { query: string, params: string[] };
}

export type { IQueryTable };