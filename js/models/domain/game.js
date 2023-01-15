"use strict";
exports.__esModule = true;
exports.Game = void 0;
var uuid_1 = require("uuid");
var chalk = require("chalk");
var Game = /** @class */ (function () {
    function Game(user_id, score) {
        this.completed = false;
        this.user_id = user_id;
        this.score = score;
    }
    Game.prototype.getId = function () {
        return this.id;
    };
    Game.prototype.setId = function (value) {
        this.id = value;
    };
    Game.prototype.generate_id = function () {
        this.id = (0, uuid_1.v4)();
        console.log(chalk.green("[Game_obj] created UUID for game: ", this.id));
    };
    Game.prototype.getUser_id = function () {
        return this.user_id;
    };
    Game.prototype.setUser_id = function (value) {
        this.user_id = value;
    };
    Game.prototype.getScore = function () {
        return this.score;
    };
    Game.prototype.setScore = function (value) {
        this.score = value;
    };
    Game.prototype.getCompleted = function () {
        return this.completed;
    };
    Game.prototype.setCompleted = function (value) {
        this.completed = value;
    };
    return Game;
}());
exports.Game = Game;
