"use strict";
/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParamsTable = void 0;
const lodash_1 = require("lodash");
const createDescription_1 = require("./createDescription");
const createFullWidthTable_1 = require("./createFullWidthTable");
const schema_1 = require("./schema");
const utils_1 = require("./utils");
function createParamsTable({ parameters, type }) {
    if (parameters === undefined) {
        return undefined;
    }
    const params = parameters.filter((param) => (param === null || param === void 0 ? void 0 : param.in) === type);
    if (params.length === 0) {
        return undefined;
    }
    return (0, createFullWidthTable_1.createFullWidthTable)({
        children: [
            (0, utils_1.create)("thead", {
                children: (0, utils_1.create)("tr", {
                    children: (0, utils_1.create)("th", {
                        style: { textAlign: "left" },
                        children: `${type.charAt(0).toUpperCase() + type.slice(1)} Parameters`,
                    }),
                }),
            }),
            (0, utils_1.create)("tbody", {
                children: params.map((param) => {
                    var _a;
                    return (0, utils_1.create)("tr", {
                        children: (0, utils_1.create)("td", {
                            children: [
                                (0, utils_1.create)("code", { children: (0, lodash_1.escape)(param.name) }),
                                (0, utils_1.guard)(param.schema, (schema) => (0, utils_1.create)("span", {
                                    style: { opacity: "0.6" },
                                    children: ` ${(0, schema_1.getSchemaName)(schema)}`,
                                })),
                                (0, utils_1.guard)(param.required, () => [
                                    (0, utils_1.create)("span", {
                                        style: { opacity: "0.6" },
                                        children: " — ",
                                    }),
                                    (0, utils_1.create)("strong", {
                                        style: {
                                            fontSize: "var(--ifm-code-font-size)",
                                            color: "var(--openapi-required)",
                                        },
                                        children: " REQUIRED",
                                    }),
                                ]),
                                (0, utils_1.guard)((0, schema_1.getQualifierMessage)(param.schema), (message) => (0, utils_1.create)("div", {
                                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                                    children: (0, createDescription_1.createDescription)(message),
                                })),
                                (0, utils_1.guard)((_a = param.schema) === null || _a === void 0 ? void 0 : _a.description, (description) => (0, utils_1.create)("div", {
                                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                                    children: (0, createDescription_1.createDescription)(description),
                                })),
                                (0, utils_1.guard)(param.description, (description) => (0, utils_1.create)("div", {
                                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                                    children: (0, createDescription_1.createDescription)(description),
                                })),
                                (0, utils_1.guard)(param.example, (example) => (0, utils_1.create)("div", {
                                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                                    children: (0, lodash_1.escape)(`Example: ${example}`),
                                })),
                                (0, utils_1.guard)(param.examples, (examples) => (0, utils_1.create)("div", {
                                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                                    children: Object.entries(examples).map(([k, v]) => (0, utils_1.create)("div", {
                                        children: (0, lodash_1.escape)(`Example (${k}): ${v.value}`),
                                    })),
                                })),
                            ],
                        }),
                    });
                }),
            }),
        ],
    });
}
exports.createParamsTable = createParamsTable;