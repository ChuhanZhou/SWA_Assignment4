"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var dispatcher_1 = require("../dispatcher");
var actionTypes_1 = require("../actions/actionTypes");
var user_1 = require("../models/user");
var event_type = {
    ERROR: "ERROR",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    USER_INFO: "USER_INFO"
};
var user = new user_1.User("", "");
var token = "";
var error_info = "";
var UserStore = /** @class */ (function (_super) {
    __extends(UserStore, _super);
    function UserStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserStore.prototype.addLoginListener = function (callback) {
        this.on(event_type.LOGIN, callback);
    };
    UserStore.prototype.removeLoginListener = function (callback) {
        this.removeListener(event_type.LOGIN, callback);
    };
    UserStore.prototype.addLogoutListener = function (callback) {
        this.on(event_type.LOGOUT, callback);
    };
    UserStore.prototype.removeLogoutListener = function (callback) {
        this.removeListener(event_type.LOGOUT, callback);
    };
    UserStore.prototype.addUserInfoListener = function (callback) {
        this.on(event_type.USER_INFO, callback);
    };
    UserStore.prototype.removeUserInfoListener = function (callback) {
        this.removeListener(event_type.USER_INFO, callback);
    };
    UserStore.prototype.addErrorListener = function (callback) {
        this.on(event_type.ERROR, callback);
    };
    UserStore.prototype.removeErrorListener = function (callback) {
        this.removeListener(event_type.ERROR, callback);
    };
    UserStore.prototype.emitChange = function (type) {
        this.emit(type);
    };
    UserStore.prototype.getUser = function () {
        return user.copy();
    };
    UserStore.prototype.getToken = function () {
        return token;
    };
    UserStore.prototype.getError = function () {
        return error_info;
    };
    return UserStore;
}(events_1.EventEmitter));
var user_store = new UserStore();
dispatcher_1["default"].register(function (action) {
    switch (action.actionTypes) {
        case actionTypes_1["default"].LOGIN:
            token = action.token;
            user.id = action.id;
            user_store.emitChange(event_type.LOGIN);
            break;
        case actionTypes_1["default"].LOGOUT:
            token = "";
            user = new user_1.User("", "");
            user_store.emitChange(event_type.LOGOUT);
            break;
        case actionTypes_1["default"].USER_INFO:
            user = action.user;
            user_store.emitChange(event_type.USER_INFO);
            break;
        case actionTypes_1["default"].ERROR:
            error_info = action.info;
            user_store.emitChange(event_type.ERROR);
            break;
        default:
            break;
    }
});
exports["default"] = user_store;
