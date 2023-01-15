"use strict";
exports.__esModule = true;
var userAction_1 = require("./js/actions/userAction");
var userStore_1 = require("./js/stores/userStore");
var a = 0;
function testLogin() {
    console.log("login");
    console.log("Token: " + userStore_1["default"].getToken());
    console.log(userStore_1["default"].getUser());
    console.log("Error: " + userStore_1["default"].getError());
}
function testLogout() {
    console.log("logout");
    console.log("Token: " + userStore_1["default"].getToken());
    console.log(userStore_1["default"].getUser());
    console.log("Error: " + userStore_1["default"].getError());
    (0, userAction_1.login)("A", "222");
}
function testUserInfo() {
    console.log("user_info");
    console.log("Token: " + userStore_1["default"].getToken());
    console.log(userStore_1["default"].getUser());
    console.log("Error: " + userStore_1["default"].getError());
    if (a == 0) {
        var old = userStore_1["default"].getUser();
        if (old.isTruePassword("111")) {
            old.changePassword("111", "222");
        }
        else {
            old.changePassword("222", "111");
        }
        (0, userAction_1.updateUserInfo)(old, userStore_1["default"].getToken());
        a = 1;
    }
    else {
        (0, userAction_1.logout)(userStore_1["default"].getToken());
        a = 0;
    }
}
function testError() {
    console.log("error");
    console.log("Token: " + userStore_1["default"].getToken());
    console.log(userStore_1["default"].getUser());
    console.log("Error: " + userStore_1["default"].getError());
}
userStore_1["default"].addLoginListener(testLogin);
userStore_1["default"].addLogoutListener(testLogout);
userStore_1["default"].addUserInfoListener(testUserInfo);
userStore_1["default"].addErrorListener(testError);
(0, userAction_1.login)("A", "111");
