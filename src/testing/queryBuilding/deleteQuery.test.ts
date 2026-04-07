import '../../moduleInitialization.js';

import test from "node:test";
import assert from "node:assert";

import { customersTable } from "../_tables.js";

test.suite("DELETE QUERY", () => {
    // test("Basic delete query.", () => {
    //     const qb = customersTable.delete();
    //     const buildRes = qb.buildSQL();
    //     const query = buildRes.query;

    //     const expected = `DELETE FROM "customers"`;

    //     assert.equal(query, expected);
    // });

    // test("Delete query with where clause.", () => {
    //     const qb = customersTable.delete().where((tables) => tables.customers.id.eq(10));
    //     const buildRes = qb.buildSQL();
    //     const query = buildRes.query;

    //     const expected = `DELETE FROM "customers" WHERE "customers"."id"=10`;

    //     assert.equal(query, expected);
    // });

    // test("Delete query with where clause and alias.", () => {
    //     const qb = customersTable.as("cst").delete().where((tables) => tables.cst.id.eq(10));
    //     const buildRes = qb.buildSQL();
    //     const query = buildRes.query;

    //     const expected = `DELETE FROM "customers" AS "cst" WHERE "cst"."id"=10`;

    //     assert.equal(query, expected);
    // });

});
