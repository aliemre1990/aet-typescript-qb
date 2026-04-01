import { dbTypes, type DbType } from "../../db.js";
import type { DbOperations } from "../_types/ops.js";
import { mysqlFunctions, pgFunctions } from "../dbOperations.js";

export function getDbFunctions<TDbType extends DbType>(dbType: TDbType) {
    return (dbType === dbTypes.postgresql ? pgFunctions : dbType === dbTypes.mysql ? mysqlFunctions : undefined) as DbOperations<TDbType>;
}