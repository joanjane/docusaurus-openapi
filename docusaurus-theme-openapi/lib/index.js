"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = docusaurusThemeOpenAPI;

var _path = _interopRequireDefault(require("path"));

var _webpack = require("webpack");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
function docusaurusThemeOpenAPI() {
  return {
    name: "docusaurus-theme-openapi",

    getThemePath() {
      return _path.default.join(__dirname, "..", "lib-next", "theme");
    },

    getTypeScriptThemePath() {
      return _path.default.resolve(__dirname, "..", "src", "theme");
    },

    configureWebpack() {
      return {
        plugins: [new _webpack.ProvidePlugin({
          Buffer: [require.resolve("buffer/"), "Buffer"],
          process: require.resolve("process/browser")
        })],
        resolve: {
          fallback: {
            buffer: require.resolve("buffer/"),
            process: require.resolve("process/browser")
          }
        }
      };
    }

  };
}