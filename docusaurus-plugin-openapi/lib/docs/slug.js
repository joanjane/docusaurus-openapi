"use strict";
/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@docusaurus/utils");
const docs_1 = require("./docs");
const numberPrefix_1 = require("./numberPrefix");
function getSlug({ baseID, frontMatterSlug, source, sourceDirName, stripDirNumberPrefixes = true, numberPrefixParser = numberPrefix_1.DefaultNumberPrefixParser, }) {
    function getDirNameSlug() {
        const dirNameStripped = stripDirNumberPrefixes
            ? (0, numberPrefix_1.stripPathNumberPrefixes)(sourceDirName, numberPrefixParser)
            : sourceDirName;
        const resolveDirname = sourceDirName === "."
            ? "/"
            : (0, utils_1.addLeadingSlash)((0, utils_1.addTrailingSlash)(dirNameStripped));
        return resolveDirname;
    }
    function computeSlug() {
        if (frontMatterSlug === null || frontMatterSlug === void 0 ? void 0 : frontMatterSlug.startsWith("/")) {
            return frontMatterSlug;
        }
        const dirNameSlug = getDirNameSlug();
        if (!frontMatterSlug &&
            (0, docs_1.isCategoryIndex)((0, docs_1.toCategoryIndexMatcherParam)({ source, sourceDirName }))) {
            return dirNameSlug;
        }
        const baseSlug = frontMatterSlug !== null && frontMatterSlug !== void 0 ? frontMatterSlug : baseID;
        return (0, utils_1.resolvePathname)(baseSlug, getDirNameSlug());
    }
    function ensureValidSlug(slug) {
        if (!(0, utils_1.isValidPathname)(slug)) {
            throw new Error(`We couldn't compute a valid slug for document with ID "${baseID}" in "${sourceDirName}" directory.
  The slug we computed looks invalid: ${slug}.
  Maybe your slug front matter is incorrect or there are special characters in the file path?
  By using front matter to set a custom slug, you should be able to fix this error:
  
  ---
  slug: /my/customDocPath
  ---
  `);
        }
        return slug;
    }
    return ensureValidSlug(computeSlug());
}
exports.default = getSlug;