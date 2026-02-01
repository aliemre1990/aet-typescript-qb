import { dbTypes, type DbType } from "../../db.js";
import type { DbFunctions, DbOperators } from "../_types/ops.js";
import { mysqlDbOperators, mysqlFunctions, pgDbOperators, pgFunctions } from "../dbOperations.js";

export function getDbFunctions<TDbType extends DbType>(dbType: TDbType) {
    return (dbType === dbTypes.postgresql ? pgFunctions : dbType === dbTypes.mysql ? mysqlFunctions : undefined) as DbFunctions<TDbType>;
}

export function getDbOperations<TDbType extends DbType>(dbType: TDbType) {
    return (dbType === dbTypes.postgresql ? pgDbOperators : dbType === dbTypes.mysql ? mysqlDbOperators : undefined) as DbOperators<TDbType>;
}