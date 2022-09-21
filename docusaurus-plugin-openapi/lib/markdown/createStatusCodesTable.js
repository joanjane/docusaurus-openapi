"use strict";
/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatusCodesTable = void 0;
const createDescription_1 = require("./createDescription");
const createFullWidthTable_1 = require("./createFullWidthTable");
const createSchemaTable_1 = require("./createSchemaTable");
const utils_1 = require("./utils");
function createStatusCodesTable({ responses }) {
    if (responses === undefined) {
        return undefined;
    }
    const codes = Object.keys(responses);
    if (codes.length === 0) {
        return undefined;
    }
    return (0, createFullWidthTable_1.createFullWidthTable)({
        children: [
            (0, utils_1.create)("thead", {
                children: (0, utils_1.create)("tr", {
                    children: (0, utils_1.create)("th", {
                        style: { textAlign: "left" },
                        children: `Responses`,
                    }),
                }),
            }),
            (0, utils_1.create)("tbody", {
                children: codes.map((code) => (0, utils_1.create)("tr", {
                    children: (0, utils_1.create)("td", {
                        children: [
                            (0, utils_1.create)("div", {
                                style: { display: "flex" },
                                children: [
                                    (0, utils_1.create)("div", {
                                        style: { marginRight: "var(--ifm-table-cell-padding)" },
                                        children: (0, utils_1.create)("code", {
                                            children: code,
                                        }),
                                    }),
                                    (0, utils_1.create)("div", {
                                        children: (0, createDescription_1.createDescription)(responses[code].description),
                                    }),
                                ],
                            }),
                            (0, utils_1.create)("div", {
                                children: (0, createSchemaTable_1.createSchemaTable)({
                                    style: {
                                        marginTop: "var(--ifm-table-cell-padding)",
                                        marginBottom: "0px",
                                    },
                                    title: "Schema",
                                    body: {
                                        content: responses[code].content,
                                    },
                                }),
                            }),
                        ],
                    }),
                })),
            }),
        ],
    });
}
exports.createStatusCodesTable = createStatusCodesTable;
