"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _FloatingButton = _interopRequireDefault(require("../FloatingButton"));

var _hooks = require("../hooks");

var _FormItem = _interopRequireDefault(require("./../FormItem"));

var _FormSelect = _interopRequireDefault(require("./../FormSelect"));

var _FormTextInput = _interopRequireDefault(require("./../FormTextInput"));

var _slice = require("./slice");

var _stylesModule = _interopRequireDefault(require("./styles.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */
function Server() {
  const [isEditing, setIsEditing] = (0, _react.useState)(false);
  const value = (0, _hooks.useTypedSelector)(state => state.server.value);
  const options = (0, _hooks.useTypedSelector)(state => state.server.options);
  const dispatch = (0, _hooks.useTypedDispatch)();

  if (options.length <= 0) {
    return null;
  }

  if (options.length <= 1 && (value === null || value === void 0 ? void 0 : value.variables) === undefined) {
    return null;
  }

  if (!isEditing) {
    let url = "";

    if (value) {
      url = value.url.replace(/\/$/, "");

      if (value.variables) {
        Object.keys(value.variables).forEach(variable => {
          var _value$variables$vari, _value$variables;

          url = url.replace(`{${variable}}`, (_value$variables$vari = (_value$variables = value.variables) === null || _value$variables === void 0 ? void 0 : _value$variables[variable].storedValue) !== null && _value$variables$vari !== void 0 ? _value$variables$vari : "");
        });
      }
    }

    return <_FloatingButton.default onClick={() => setIsEditing(true)} label="Edit">
        <pre style={{
        background: "var(--openapi-card-background-color)",
        paddingRight: "60px"
      }}>
          <code>{url}</code>
        </pre>
      </_FloatingButton.default>;
  }

  return <div className={_stylesModule.default.optionsPanel}>
      <button className={_stylesModule.default.showMoreButton} onClick={() => setIsEditing(false)}>
        Hide
      </button>
      <_FormItem.default label="Endpoint">
        <_FormSelect.default options={options.map(s => s.url)} onChange={e => dispatch((0, _slice.setServer)(e.target.value))} />
      </_FormItem.default>
      {(value === null || value === void 0 ? void 0 : value.variables) && Object.keys(value.variables).map(key => {
      var _value$variables2, _value$variables4, _value$variables5;

      if (((_value$variables2 = value.variables) === null || _value$variables2 === void 0 ? void 0 : _value$variables2[key].enum) !== undefined) {
        var _value$variables3;

        return <_FormItem.default label={key}>
                <_FormSelect.default options={value.variables[key].enum} value={(_value$variables3 = value.variables) === null || _value$variables3 === void 0 ? void 0 : _value$variables3[key].storedValue} onChange={e => {
            dispatch((0, _slice.setServerVariable)({
              key,
              value: e.target.value
            }));
          }} />
              </_FormItem.default>;
      }

      return <_FormItem.default label={key}>
              <_FormTextInput.default placeholder={(_value$variables4 = value.variables) === null || _value$variables4 === void 0 ? void 0 : _value$variables4[key].default} value={(_value$variables5 = value.variables) === null || _value$variables5 === void 0 ? void 0 : _value$variables5[key].storedValue} onChange={e => {
          dispatch((0, _slice.setServerVariable)({
            key,
            value: e.target.value
          }));
        }} />
            </_FormItem.default>;
    })}
    </div>;
}

var _default = Server;
exports.default = _default;