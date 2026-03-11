import test from "node:test";
import assert from "node:assert";

import { paramTester, sqlTester } from "../_functions.js";

test.suite("COMPARISON OPERATIONS TESTS", () => {
    test("SQL with null value.", () => {
        const qb = sqlTester`round(${null})`;
        const buildRes = qb.buildSQL();

        const query = buildRes.query;

        assert.equal(`round(NULL)`, query);
    });

    test("SQL with integer value.", () => {
        const qb = sqlTester`round(${1})`;
        const buildRes = qb.buildSQL();

        const query = buildRes.query;

        assert.equal(`round(1)`, query);
    });

    test("SQL with string value.", () => {
        const qb = sqlTester`round(${"1"})`;
        const buildRes = qb.buildSQL();

        const query = buildRes.query;

        assert.equal(`round('1')`, query);
    });

    test("SQL with param.", () => {
        const qb = sqlTester`round(${paramTester("param")})`;
        const buildRes = qb.buildSQL();

        const query = buildRes.query;
        const params = buildRes.params;

        assert.equal(`round($1)`, query);
        assert.equal("param", params[0]);
    });

    test("SQL with param using alias.", () => {
        const qb = sqlTester`round(${paramTester("param")})`.as("roundAlias");
        const buildRes = qb.buildSQL();

        const query = buildRes.query;
        const params = buildRes.params;

        assert.equal(`round($1) AS "roundAlias"`, query);
        assert.equal("param", params[0]);
    });

});
