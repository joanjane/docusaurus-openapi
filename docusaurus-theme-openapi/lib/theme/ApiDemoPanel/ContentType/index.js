"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _hooks = require("../hooks");

var _FormItem = _interopRequireDefault(require("./../FormItem"));

var _FormSelect = _interopRequireDefault(require("./../FormSelect"));

var _slice = require("./slice");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
function ContentType() {
  const value = (0, _hooks.useTypedSelector)(state => state.contentType.value);
  const options = (0, _hooks.useTypedSelector)(state => state.contentType.options);
  const dispatch = (0, _hooks.useTypedDispatch)();

  if (options.length <= 1) {
    return null;
  }

  return <_FormItem.default label="Content-Type">
      <_FormSelect.default value={value} options={options} onChange={e => dispatch((0, _slice.setContentType)(e.target.value))} />
    </_FormItem.default>;
}

var _default = ContentType;
exports.default = _default;