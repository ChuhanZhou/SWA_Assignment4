"use strict";
exports.__esModule = true;
exports.updateUserInfo = exports.getUserInfo = exports.logout = exports.login = exports.register = void 0;
var dispatcher_1 = require("../dispatcher");
var actionTypes_1 = require("./actionTypes");
var user_1 = require("../models/user");
var host = 'http://localhost:9090/';
var XMLHttpRequest = require('xhr2');
function register(username, password) {
    var xhr = new XMLHttpRequest();
    var url = host + 'users';
    var send_data = JSON.stringify(new user_1.User(username, password));
    console.log("[POST] url: " + url + " data: " + send_data);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 201) {
                var info = JSON.parse(xhr.responseText);
                var new_user = new user_1.User(info.username, info.password, info.id, info.admin, info.profile, info.high_scores);
                console.log(new_user);
                login(username, password);
            }
            else {
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].ERROR,
                    info: "the username already exists"
                });
            }
        }
    };
    xhr.send(send_data);
}
exports.register = register;
function login(username, password) {
    var xhr = new XMLHttpRequest();
    var url = host + 'login';
    var send_data = JSON.stringify(new user_1.User(username, password));
    console.log("[POST] url: " + url + " data: " + send_data);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var info = JSON.parse(xhr.responseText);
                var token = info.token;
                var userId = info.userId;
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].LOGIN,
                    token: token,
                    id: userId
                });
                getUserInfo(userId, token);
            }
            else {
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].ERROR,
                    info: "wrong username or password"
                });
            }
        }
    };
    xhr.send(send_data);
}
exports.login = login;
function logout(token) {
    var xhr = new XMLHttpRequest();
    var url = host + 'logout?token=' + token;
    console.log("[POST] url: " + url);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].LOGOUT
                });
            }
            else {
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].ERROR,
                    info: "wrong token"
                });
            }
        }
    };
    xhr.send();
}
exports.logout = logout;
function getUserInfo(id, token) {
    var xhr = new XMLHttpRequest();
    var url = host + 'users/' + id + "?token=" + token;
    console.log("[GET] url: " + url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var info = JSON.parse(xhr.responseText);
                var user = new user_1.User(info.username, info.password, info.id, info.admin, info.profile, info.high_scores);
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].USER_INFO,
                    user: user
                });
            }
            else {
                console.log("wrong id");
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].ERROR,
                    info: "wrong id or token"
                });
            }
        }
    };
    xhr.send();
}
exports.getUserInfo = getUserInfo;
function updateUserInfo(user, token) {
    var xhr = new XMLHttpRequest();
    var url = host + 'users/' + user.id + "?token=" + token;
    var send_data = JSON.stringify(user);
    console.log("[PATCH] url: " + url + " data: " + send_data);
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                getUserInfo(user.id, token);
            }
            else {
                dispatcher_1["default"].dispatch({
                    actionTypes: actionTypes_1["default"].ERROR,
                    info: "wrong token"
                });
            }
        }
    };
    xhr.send(send_data);
}
exports.updateUserInfo = updateUserInfo;
