"use strict";
/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestBodyTable = void 0;
const createSchemaTable_1 = require("./createSchemaTable");
function createRequestBodyTable({ title, body }) {
    return (0, createSchemaTable_1.createSchemaTable)({ title, body });
}
exports.createRequestBodyTable = createRequestBodyTable;
