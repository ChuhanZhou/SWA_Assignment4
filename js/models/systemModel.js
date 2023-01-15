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
var userApiConnecter_1 = require("../server/userApiConnecter");
var user_1 = require("../models/domain/user");
var gameApiConnecter_1 = require("../server/gameApiConnecter");
var game_1 = require("./domain/game");
var rules_1 = require("./domain/rules");
var chalk = require("chalk");
var SystemModel = /** @class */ (function () {
    function SystemModel() {
        this.user = new user_1.User("", "");
        this.token = "";
    }
    SystemModel.prototype.register = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, userApiConnecter_1.registerApi)(username, password)];
                    case 1:
                        api_result = _a.sent();
                        if (api_result.ok) {
                            return [2 /*return*/, this.login(username, password)];
                        }
                        return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var api_result, info_api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, userApiConnecter_1.loginApi)(username, password)];
                    case 1:
                        api_result = _a.sent();
                        if (!api_result.ok) return [3 /*break*/, 3];
                        this.token = api_result.token;
                        return [4 /*yield*/, (0, userApiConnecter_1.getUserInfoApi)(api_result.id, this.token)];
                    case 2:
                        info_api_result = _a.sent();
                        if (info_api_result.ok) {
                            this.user = info_api_result.user.copy();
                        }
                        return [2 /*return*/, info_api_result];
                    case 3: return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, userApiConnecter_1.logoutApi)(this.token)];
                    case 1:
                        api_result = _a.sent();
                        if (api_result.ok) {
                            this.token = "";
                            this.user = new user_1.User("", "");
                        }
                        return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.updateUserInfo = function (new_user) {
        return __awaiter(this, void 0, void 0, function () {
            var api_result, info_api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, userApiConnecter_1.updateUserInfoApi)(new_user, this.token)];
                    case 1:
                        api_result = _a.sent();
                        if (!api_result.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, userApiConnecter_1.getUserInfoApi)(this.user.id, this.token)];
                    case 2:
                        info_api_result = _a.sent();
                        if (info_api_result.ok) {
                            this.user = info_api_result.user.copy();
                        }
                        return [2 /*return*/, info_api_result];
                    case 3: return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.getAllGameInfo = function (id, token) {
        if (token === void 0) { token = this.token; }
        return __awaiter(this, void 0, void 0, function () {
            var api_result, game_array;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, gameApiConnecter_1.getAllGameApi)(id, token)];
                    case 1:
                        api_result = _a.sent();
                        game_array = new Array;
                        if (api_result.ok) {
                            api_result.info_array.forEach(function (response) {
                                var s_game = new game_1.Game(response.user, response.score);
                                s_game.setId(response.id);
                                s_game.setCompleted(response.completed);
                                game_array.push(s_game);
                            });
                            return [2 /*return*/, game_array];
                        }
                        else {
                            console.log(chalk.red("All Game: Error", api_result.info));
                            return [2 /*return*/, game_array];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SystemModel.prototype.getGameInfoFromID = function (game_id, token) {
        if (token === void 0) { token = this.token; }
        return __awaiter(this, void 0, void 0, function () {
            var api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, gameApiConnecter_1.getGameApi)(game_id, token)];
                    case 1:
                        api_result = _a.sent();
                        if (api_result.ok) {
                            this.game = api_result.game;
                            this.game.toString();
                        }
                        else
                            console.log(chalk.red("Single Game: Error", api_result.info));
                        return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.postGameData_sys = function (rule, user_id, token) {
        if (token === void 0) { token = this.token; }
        return __awaiter(this, void 0, void 0, function () {
            var api_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, gameApiConnecter_1.postGameData)(rule, user_id, token)];
                    case 1:
                        api_result = _a.sent();
                        if (api_result.ok) {
                            console.log(chalk.green("Game Created", api_result.info));
                        }
                        else
                            console.log(chalk.red("Single Game: Error", api_result.info));
                        return [2 /*return*/, api_result];
                }
            });
        });
    };
    SystemModel.prototype.initGame = function (out_steps, type_list, size) {
        this.board = new rules_1.Rules(out_steps, type_list, size);
        this.board.initBoard();
    };
    SystemModel.prototype.getBoard = function () {
        return this.board;
    };
    SystemModel.prototype.getUserInfo = function () {
        return this.user.copy();
    };
    SystemModel.prototype.getToken = function () {
        return this.token;
    };
    SystemModel.prototype.getGame = function () {
        return this.game;
    };
    return SystemModel;
}());
var system_model = new SystemModel();
exports["default"] = system_model;
