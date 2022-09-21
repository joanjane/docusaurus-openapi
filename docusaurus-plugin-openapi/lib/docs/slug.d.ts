/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Taken and adapted from:
 * https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/slug.ts
 */
import type { NumberPrefixParser, DocMetadataBase } from "@docusaurus/plugin-content-docs";
export default function getSlug({ baseID, frontMatterSlug, source, sourceDirName, stripDirNumberPrefixes, numberPrefixParser, }: {
    baseID: string;
    frontMatterSlug?: string;
    source: DocMetadataBase["source"];
    sourceDirName: DocMetadataBase["sourceDirName"];
    stripDirNumberPrefixes?: boolean;
    numberPrefixParser?: NumberPrefixParser;
}): string;
