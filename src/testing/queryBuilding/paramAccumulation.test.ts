import '../../moduleInitialization.js';

import test from "node:test";
import assert from "node:assert";

import { customersTable, ordersTable } from "../_tables.js";
import { from } from "../../query/queryBuilder.js";
import { withAs } from "../../query/cteObject.js";

test.suite("Param accumulation tests.", () => {

    // test("Should 'params' value exist in queryBuilder object.", () => {
    //     const qb = customersTable.select((tables, { param }) => [param("param").as("param")]);
    //     assert.ok(qb.params);

    //     const param = qb.params[0];
    //     assert.equal("param", param.name);
    // });

    // test("Should 'params' value exist in queryBuilder using sub queries.", () => {
    //     const qb = from(customersTable.select((tables, { param }) => [param("param").as("param")]).as("sub"))
    //         .select((tables, { param }) => [tables.sub.param, param("paramOuter").as("paramOuter")]);
    //     assert.ok(qb.params);

    //     const param = qb.params[0];
    //     assert.equal("param", param.name);

    //     const paramOuter = qb.params[1];
    //     assert.equal("paramOuter", paramOuter.name);
    // });

    test("Should 'params' value exist in queryBuilder using cte.", () => {
        const qb = withAs("cte", customersTable.select((tables, { param }) => [param("param").as("param")]))
            .from((ctes) => [ctes.cte])
            .select((tables, { param }) => [tables.cte.param, param("paramOuter").as("paramOuter")]);
        assert.ok(qb.params);

        const param = qb.params[0];
        assert.equal(param.name, "param");

        const paramOuter = qb.params[1];
        assert.equal(paramOuter.name, "paramOuter");
    });

});
