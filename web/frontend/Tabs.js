"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
var app_bridge_react_1 = require("@shopify/app-bridge-react");
var polaris_1 = require("@shopify/polaris");
var react_1 = require("react");
exports["default"] = (function (_a) {
    var children = _a.children;
    var navigate = (0, app_bridge_react_1.useNavigate)();
    var _b = (0, react_1.useState)(null), selected = _b[0], setSelected = _b[1];
    var tabs = [
        {
            id: "bookings",
            content: "Bookings",
            panelID: "bookings"
        },
        {
            id: "collections",
            content: "Collections",
            panelID: "collections"
        },
        {
            id: "staff",
            content: "Staff",
            panelID: "staff"
        },
        {
            id: "setting",
            content: "Settings",
            panelID: "settings"
        },
    ];
    var handleTabChange = (0, react_1.useCallback)(function (selectedTabIndex) {
        setSelected(selectedTabIndex);
        navigate("/".concat(tabs[selectedTabIndex].content));
    }, []);
    (0, react_1.useEffect)(function () {
        handleTabChange(2);
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ style: { backgroundColor: "#fff" } }, { children: (0, jsx_runtime_1.jsx)(polaris_1.Tabs, { tabs: tabs, selected: selected, onSelect: handleTabChange }) })), children] }));
});
