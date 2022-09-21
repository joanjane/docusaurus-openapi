"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _renderRoutes = _interopRequireDefault(require("@docusaurus/renderRoutes"));

var _router = require("@docusaurus/router");

var _Translate = require("@docusaurus/Translate");

var _react2 = require("@mdx-js/react");

var _BackToTopButton = _interopRequireDefault(require("@theme/BackToTopButton"));

var _DocSidebar = _interopRequireDefault(require("@theme/DocSidebar"));

var _Arrow = _interopRequireDefault(require("@theme/Icon/Arrow"));

var _Layout = _interopRequireDefault(require("@theme/Layout"));

var _MDXComponents = _interopRequireDefault(require("@theme/MDXComponents"));

var _NotFound = _interopRequireDefault(require("@theme/NotFound"));

var _clsx = _interopRequireDefault(require("clsx"));

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
function getSidebar({
  currentApiRoute,
  apiMetadata
}) {
  const sidebarName = currentApiRoute.sidebar;
  const sidebar = sidebarName ? apiMetadata.apiSidebars[sidebarName] : undefined;
  return sidebar;
}

function getLinks(sidebar) {
  let links = [];

  for (let item of sidebar) {
    switch (item.type) {
      case "link":
        links.push(item.href);
        break;

      case "category":
        links.push(...getLinks(item.items));
        break;
    }
  }

  return links;
}

function getSidebarPaths({
  currentApiRoute,
  apiMetadata
}) {
  const sidebar = getSidebar({
    currentApiRoute,
    apiMetadata
  });

  if (!sidebar) {
    return [];
  }

  return getLinks(sidebar);
}

function ApiPageContent({
  currentApiRoute,
  apiMetadata,
  children
}) {
  const sidebar = getSidebar({
    currentApiRoute,
    apiMetadata
  });
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = (0, _react.useState)(false);
  const [hiddenSidebar, setHiddenSidebar] = (0, _react.useState)(false);
  const toggleSidebar = (0, _react.useCallback)(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }

    setHiddenSidebarContainer(value => !value);
  }, [hiddenSidebar]);
  return <_Layout.default wrapperClassName="api-wrapper">
      <div className={_stylesModule.default.apiPage}>
        <_BackToTopButton.default />

        {sidebar && <aside className={(0, _clsx.default)(_stylesModule.default.apiSidebarContainer, {
        [_stylesModule.default.apiSidebarContainerHidden]: hiddenSidebarContainer
      })} onTransitionEnd={e => {
        if (!e.currentTarget.classList.contains(_stylesModule.default.apiSidebarContainer)) {
          return;
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
            <_DocSidebar.default key={// Reset sidebar state on sidebar changes
        // See https://github.com/facebook/docusaurus/issues/3414
        currentApiRoute.sidebar} sidebar={sidebar} path={currentApiRoute.path} onCollapse={toggleSidebar} isHidden={hiddenSidebar} />

            {hiddenSidebar && <div className={_stylesModule.default.collapsedApiSidebar} title={(0, _Translate.translate)({
          id: "theme.docs.sidebar.expandButtonTitle",
          message: "Expand sidebar",
          description: "The ARIA label and title attribute for expand button of doc sidebar"
        })} aria-label={(0, _Translate.translate)({
          id: "theme.docs.sidebar.expandButtonAriaLabel",
          message: "Expand sidebar",
          description: "The ARIA label and title attribute for expand button of doc sidebar"
        })} tabIndex={0} role="button" onKeyDown={toggleSidebar} onClick={toggleSidebar}>
                <_Arrow.default className={_stylesModule.default.expandSidebarButtonIcon} />
              </div>}
          </aside>}
        <main className={(0, _clsx.default)(_stylesModule.default.apiMainContainer, {
        [_stylesModule.default.apiMainContainerEnhanced]: hiddenSidebarContainer || !sidebar
      })}>
          <div className={(0, _clsx.default)("container padding-top--md padding-bottom--lg", {
          [_stylesModule.default.apiItemWrapperEnhanced]: hiddenSidebarContainer
        })}>
            <_react2.MDXProvider components={_MDXComponents.default}>{children}</_react2.MDXProvider>
          </div>
        </main>
      </div>
    </_Layout.default>;
}

function ApiPage(props) {
  const {
    route: {
      routes: apiRoutes
    },
    apiMetadata,
    location
  } = props;
  let currentApiRoute = apiRoutes.find(apiRoute => (0, _router.matchPath)(location.pathname, apiRoute));

  if (!currentApiRoute) {
    return <_NotFound.default />;
  } // Override the current route path to the first page if it can't be found on the sidebar.


  const paths = getSidebarPaths({
    currentApiRoute,
    apiMetadata
  });

  if (!paths.find(path => (0, _router.matchPath)(location.pathname, path))) {
    currentApiRoute = { ...currentApiRoute,
      path: paths[0]
    };
  }

  return <>
      <ApiPageContent currentApiRoute={currentApiRoute} apiMetadata={apiMetadata}>
        {(0, _renderRoutes.default)(apiRoutes)}
      </ApiPageContent>
    </>;
}

var _default = ApiPage;
exports.default = _default;