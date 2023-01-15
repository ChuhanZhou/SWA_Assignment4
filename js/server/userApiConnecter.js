"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateUserInfoApi = exports.getUserInfoApi = exports.logoutApi = exports.loginApi = exports.registerApi = void 0;
var user_1 = require("../models/domain/user");
var host = 'http://localhost:9090/';
var node_fetch_1 = require("node-fetch");
// npm install node-fetch@2
function registerApi(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var url, send_data, response, info, _a, _b, new_user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = host + 'users';
                    send_data = JSON.stringify(new user_1.User(username, password));
                    console.log("[POST] url: " + url + " data: " + send_data);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: send_data
                        })];
                case 1:
                    response = _c.sent();
                    if (!(response.status == 201)) return [3 /*break*/, 3];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, response.text()];
                case 2:
                    info = _b.apply(_a, [_c.sent()]);
                    new_user = new user_1.User(info.username, info.password, info.id, info.admin, info.profile, info.high_scores);
                    console.log(new_user);
                    return [2 /*return*/, { ok: true }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        info: "the username already exists"
                    }];
            }
        });
    });
}
exports.registerApi = registerApi;
function loginApi(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var url, send_data, response, info, _a, _b, token, userId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = host + 'login';
                    send_data = JSON.stringify(new user_1.User(username, password));
                    console.log("[POST] url: " + url + " data: " + send_data);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: send_data
                        })];
                case 1:
                    response = _c.sent();
                    if (!(response.status == 200)) return [3 /*break*/, 3];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, response.text()];
                case 2:
                    info = _b.apply(_a, [_c.sent()]);
                    token = info.token;
                    userId = info.userId;
                    return [2 /*return*/, {
                            ok: true,
                            token: token,
                            id: userId
                        }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        info: "wrong username or password"
                    }];
            }
        });
    });
}
exports.loginApi = loginApi;
function logoutApi(token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = host + 'logout?token=' + token;
                    console.log("[POST] url: " + url);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status == 200) {
                        return [2 /*return*/, { ok: true }];
                    }
                    else {
                        return [2 /*return*/, {
                                ok: false,
                                info: "wrong token"
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.logoutApi = logoutApi;
function getUserInfoApi(id, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, info, _a, _b, user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    url = host + 'users/' + id + "?token=" + token;
                    console.log("[GET] url: " + url);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _c.sent();
                    if (!(response.status == 200)) return [3 /*break*/, 3];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, response.text()];
                case 2:
                    info = _b.apply(_a, [_c.sent()]);
                    user = new user_1.User(info.username, info.password, info.id, info.admin, info.profile, info.high_scores);
                    return [2 /*return*/, {
                            ok: true,
                            user: user
                        }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        info: "wrong id or token"
                    }];
            }
        });
    });
}
exports.getUserInfoApi = getUserInfoApi;
function updateUserInfoApi(user, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, send_data, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = host + 'users/' + user.id + "?token=" + token;
                    send_data = JSON.stringify(user);
                    console.log("[PATCH] url: " + url + " data: " + send_data);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: send_data
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status == 200) {
                        return [2 /*return*/, { ok: true }];
                    }
                    else {
                        return [2 /*return*/, {
                                ok: false,
                                info: "wrong token"
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateUserInfoApi = updateUserInfoApi;
