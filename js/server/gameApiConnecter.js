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
exports.postGameData = exports.getGameApi = exports.getAllGameApi = void 0;
var node_fetch_1 = require("node-fetch");
var chalk = require("chalk");
var host = 'http://localhost:9090/';
var game_1 = require("../models/domain/game");
function getAllGameApi(id, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, info, info_size, length_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = host + 'games' + "?token=" + token;
                    console.log(chalk.blue("Requesting: ", url));
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response.status == 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    info = _a.sent();
                    info_size = JSON.parse(info);
                    length_1 = info_size.length;
                    console.log(chalk.green("Size: ", length_1, " | API_response:", info));
                    return [2 /*return*/, {
                            ok: true,
                            info: info,
                            info_array: info_size
                        }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        info: "wrong id or token"
                    }];
            }
        });
    });
}
exports.getAllGameApi = getAllGameApi;
function getGameApi(game_id, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, info_r, info, game;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = host + 'games/' + game_id + "?token=" + token;
                    console.log(chalk.blue("Requesting: ", url));
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response.status == 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    info_r = _a.sent();
                    info = JSON.parse(info_r);
                    game = new game_1.Game(info.user, info.score);
                    game.setId(info.id);
                    game.setCompleted(info.completed);
                    //const length = info_size.length;
                    console.log(chalk.green("API_response: gameid: ", game_id, " | ", info_r));
                    return [2 /*return*/, {
                            ok: true,
                            game: game
                        }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        info: response.status
                    }];
            }
        });
    });
}
exports.getGameApi = getGameApi;
function postGameData(rule, user_id, token) {
    return __awaiter(this, void 0, void 0, function () {
        var game_id, score, _game, s_url, is_paused, is_ended, payload, response, info, _a, _b, data, url, response_s, info_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    score = rule.getPoints();
                    _game = new game_1.Game(user_id, score);
                    s_url = host + 'games/' + "?token=" + token;
                    is_paused = rule.getPausingStatus();
                    is_ended = rule.getEndingStatus();
                    if (is_paused) {
                        console.log(chalk.red("This game is Paused, ES: ", is_ended, " PS: ", is_paused, "Score: ", _game.getScore()));
                        _game.setScore(0);
                        _game.setCompleted(false);
                    }
                    else {
                        _game.setCompleted(true);
                    }
                    payload = JSON.stringify(_game);
                    return [4 /*yield*/, (0, node_fetch_1["default"])(s_url, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: null
                        })];
                case 1:
                    response = _c.sent();
                    if (!(response.status == 200 || response.status == 201)) return [3 /*break*/, 7];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, response.text()];
                case 2:
                    info = _b.apply(_a, [_c.sent()]);
                    data = info;
                    game_id = data.id;
                    console.log(chalk.green("Generation Compelete: ", " Game ID: ", game_id));
                    url = host + 'games/' + game_id + "?token=" + token;
                    console.log(chalk.blue("Posting: ", url, "\nPayload: ", payload));
                    return [4 /*yield*/, (0, node_fetch_1["default"])(url, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: payload
                        })];
                case 3:
                    response_s = _c.sent();
                    if (!(response_s.status == 200)) return [3 /*break*/, 5];
                    return [4 /*yield*/, response_s.text()];
                case 4:
                    info_1 = _c.sent();
                    console.log(chalk.green("Info: ", info_1));
                    return [2 /*return*/, {
                            ok: true,
                            info: info_1
                        }];
                case 5:
                    console.log(chalk.bgRed(response_s.status, " Wrong id/token"));
                    return [2 /*return*/, {
                            ok: false,
                            info: response.status
                        }];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, {
                        ok: false,
                        info: response.status
                    }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.postGameData = postGameData;
