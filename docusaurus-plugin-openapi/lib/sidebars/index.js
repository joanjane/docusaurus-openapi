"use strict";
/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSidebar = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("@docusaurus/utils");
const chalk_1 = __importDefault(require("chalk"));
const clsx_1 = __importDefault(require("clsx"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const lodash_1 = require("lodash");
const CategoryMetadataFilenameBase = "_category_";
const BottomSidebarPosition = 999999;
function isApiItem(item) {
    return item.type === "api";
}
function isInfoItem(item) {
    return item.type === "info";
}
function isMdxItem(item) {
    return item.type === "mdx";
}
const Terminator = "."; // a file or folder can never be "."
const BreadcrumbSeparator = "/";
function getBreadcrumbs(dir) {
    if (dir === Terminator) {
        // this isn't actually needed, but removing would result in an array: [".", "."]
        return [Terminator];
    }
    return [...dir.split(BreadcrumbSeparator).filter(Boolean), Terminator];
}
async function generateSidebar(items, options) {
    var _a, _b, _c, _d, _e, _f;
    const sourceGroups = (0, lodash_1.groupBy)(items, (item) => item.source);
    let sidebar = [];
    let visiting = sidebar;
    for (const items of Object.values(sourceGroups)) {
        if (items.length === 0) {
            // Since the groups are created based on the items, there should never be a length of zero.
            console.warn(chalk_1.default.yellow(`Unnexpected empty group!`));
            continue;
        }
        const { sourceDirName, source } = items[0];
        const breadcrumbs = getBreadcrumbs(sourceDirName);
        let currentPath = [];
        for (const crumb of breadcrumbs) {
            // We hit a spec file, create the groups for it.
            if (crumb === Terminator) {
                if (isMdxItem(items[0])) {
                    visiting.push(...groupByTags(items, options));
                }
                else if (["_spec_.json", "_spec_.yml", "_spec_.yaml"].includes(path_1.default.basename(items[0].source))) {
                    // Don't create a category for this spec file
                    visiting.push(...groupByTags(items, options));
                }
                else {
                    const title = (_b = (_a = items.filter(isApiItem)[0]) === null || _a === void 0 ? void 0 : _a.api.info) === null || _b === void 0 ? void 0 : _b.title;
                    const fileName = path_1.default.basename(source, path_1.default.extname(source));
                    // Title could be an empty string so `??` won't work here.
                    const label = !title ? fileName : title;
                    visiting.push({
                        type: "category",
                        label,
                        position: BottomSidebarPosition,
                        collapsible: options.sidebarCollapsible,
                        collapsed: options.sidebarCollapsed,
                        items: groupByTags(items, options),
                    });
                }
                visiting = sidebar; // reset
                break;
            }
            // Read category file to generate a label for the current path.
            currentPath.push(crumb);
            const categoryPath = path_1.default.join(options.contentPath, ...currentPath);
            const meta = await readCategoryMetadataFile(categoryPath);
            const label = (_c = meta === null || meta === void 0 ? void 0 : meta.label) !== null && _c !== void 0 ? _c : crumb;
            // Check for existing categories for the current label.
            const existingCategory = visiting
                .filter((c) => c.type === "category")
                .find((c) => c.label === label);
            // If exists, skip creating a new one.
            if (existingCategory) {
                visiting = existingCategory.items;
                continue;
            }
            // Otherwise, create a new one.
            const newCategory = {
                type: "category",
                className: meta === null || meta === void 0 ? void 0 : meta.className,
                customProps: meta === null || meta === void 0 ? void 0 : meta.customProps,
                position: (_d = meta === null || meta === void 0 ? void 0 : meta.position) !== null && _d !== void 0 ? _d : BottomSidebarPosition,
                label,
                collapsible: (_e = meta === null || meta === void 0 ? void 0 : meta.collapsible) !== null && _e !== void 0 ? _e : options.sidebarCollapsible,
                collapsed: (_f = meta === null || meta === void 0 ? void 0 : meta.collapsed) !== null && _f !== void 0 ? _f : options.sidebarCollapsed,
                items: [],
            };
            visiting.push(newCategory);
            visiting = newCategory.items;
        }
    }
    // The first group should always be a category, but check for type narrowing
    if (sidebar.length === 1 && sidebar[0].type === "category") {
        return sidebar[0].items;
    }
    // Squash categories that only contain a single API spec
    if (sidebar.length > 0) {
        for (const item of sidebar) {
            if (item.type === "category" &&
                item.items.length === 1 &&
                item.items[0].type === "category") {
                item.items = item.items[0].items;
            }
        }
    }
    sidebar = recursiveSidebarSort(sidebar);
    return sidebar;
}
exports.generateSidebar = generateSidebar;
/**
 * Sort the sidebar recursively based on `position`.
 * @param sidebar
 * @returns
 */
function recursiveSidebarSort(sidebar) {
    // Use lodash sortBy to ensure sorting stability
    sidebar = (0, lodash_1.sortBy)(sidebar, (item) => item.position);
    for (const item of sidebar) {
        if (item.type === "category") {
            item.items = recursiveSidebarSort(item.items);
        }
    }
    return sidebar;
}
/**
 * Takes a flat list of pages and groups them into categories based on there tags.
 */
function groupByTags(items, options) {
    const intros = items
        .filter((m) => isInfoItem(m) || isMdxItem(m))
        .map((item) => {
        var _a, _b;
        const fileName = path_1.default.basename(item.source, path_1.default.extname(item.source));
        const label = !item.title ? fileName : item.title;
        return {
            type: "link",
            label: label,
            href: item.permalink,
            docId: item.id,
            position: isMdxItem(item)
                ? (_b = (_a = item.frontMatter) === null || _a === void 0 ? void 0 : _a.sidebar_position) !== null && _b !== void 0 ? _b : BottomSidebarPosition
                : BottomSidebarPosition,
        };
    });
    const apiItems = items.filter(isApiItem);
    const tags = (0, lodash_1.uniq)(apiItems
        .flatMap((item) => item.api.tags)
        .filter((item) => !!item));
    function createLink(item) {
        return {
            type: "link",
            label: item.title,
            href: item.permalink,
            docId: item.id,
            className: (0, clsx_1.default)({
                "menu__list-item--deprecated": item.api.deprecated,
                "api-method": !!item.api.method,
            }, item.api.method),
            position: BottomSidebarPosition,
        };
    }
    const tagged = tags
        .map((tag) => {
        return {
            type: "category",
            label: tag,
            collapsible: options.sidebarCollapsible,
            collapsed: options.sidebarCollapsed,
            items: apiItems
                .filter((item) => { var _a; return !!((_a = item.api.tags) === null || _a === void 0 ? void 0 : _a.includes(tag)); })
                .map(createLink),
            position: BottomSidebarPosition,
        };
    })
        .filter((item) => item.items.length > 0); // Filter out any categories with no items.
    let untagged = [
        {
            type: "category",
            label: "API",
            collapsible: options.sidebarCollapsible,
            collapsed: options.sidebarCollapsed,
            items: apiItems
                .filter(({ api }) => api.tags === undefined || api.tags.length === 0)
                .map(createLink),
            position: BottomSidebarPosition,
        },
    ];
    if (untagged[0].items.length === 0) {
        untagged = [];
    }
    return [...intros, ...tagged, ...untagged];
}
/**
 * Taken from: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/sidebars/generator.ts
 */
async function readCategoryMetadataFile(categoryDirPath) {
    async function tryReadFile(filePath) {
        const contentString = await fs_extra_1.default.readFile(filePath, { encoding: "utf8" });
        const unsafeContent = js_yaml_1.default.load(contentString);
        try {
            return unsafeContent; // validateCategoryMetadataFile(unsafeContent);
        }
        catch (e) {
            console.error(chalk_1.default.red(`The docs sidebar category metadata file path=${filePath} looks invalid!`));
            throw e;
        }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const ext of [".json", ".yml", ".yaml"]) {
        // Simpler to use only posix paths for mocking file metadata in tests
        const filePath = (0, utils_1.posixPath)(path_1.default.join(categoryDirPath, `${CategoryMetadataFilenameBase}${ext}`));
        if (await fs_extra_1.default.pathExists(filePath)) {
            return tryReadFile(filePath);
        }
    }
    return null;
}
