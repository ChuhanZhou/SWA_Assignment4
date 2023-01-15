"use strict";
exports.__esModule = true;
exports.Rules = void 0;
var board_1 = require("./board");
//const chalk = require("chalk");
var Rules = /** @class */ (function () {
    function Rules(out_steps, type_list, size) {
        this.id = "";
        this.points = 0;
        this.x = 0;
        this.init_status = false;
        this.is_ended = false;
        this.is_paused = false;
        this.out_steps = out_steps;
        this.type_list = type_list;
        this.size = size;
    }
    // Getter/setter 
    Rules.prototype.getId = function () {
        return this.id;
    };
    Rules.prototype.setId = function (id) {
        this.id = id;
    };
    Rules.prototype.getPoints = function () {
        return this.points;
    };
    Rules.prototype.setPoints = function (points) {
        this.points = points;
    };
    Rules.prototype.getOut_steps = function () {
        return this.out_steps;
    };
    Rules.prototype.setOut_steps = function (out_steps) {
        this.out_steps = out_steps;
    };
    Rules.prototype.getType_list = function () {
        return this.type_list;
    };
    Rules.prototype.setType_list = function (type_list) {
        this.type_list = type_list;
    };
    Rules.prototype.getSize = function () {
        return this.size;
    };
    Rules.prototype.setSize = function (size) {
        this.size = size;
    };
    Rules.prototype.getGameBoard = function () {
        return this.game_board;
    };
    Rules.prototype.getEndingStatus = function () {
        return this.is_ended;
    };
    Rules.prototype.getPausingStatus = function () {
        return this.is_paused;
    };
    Rules.prototype.differ = function (str1, str2) {
        var output1 = '';
        var output2 = '';
        for (var i = 0; i < str1.length; i++) {
            if (str1[i] !== str2[i]) {
                output1 += str1[i];
                output2 += str2[i];
            }
            else {
                output1 += str1[i];
                output2 += str2[i];
            }
        }
        console.log(output1);
        console.log(output2);
    };
    Rules.prototype.initBoard = function () {
        this.game_board = new board_1.Board([this.size[0], this.size[1]], this.type_list);
        this.init_status = true;
        return this.game_board;
    };
    Rules.prototype.play = function (f_position, s_position) {
        if (!this.init_status) {
            console.log("This board is not initated yet!");
        }
        else if (this.is_paused) {
            console.log("This Game is paused!");
        }
        else {
            this.out_steps -= 1;
            var str_g_f = this.game_board.toString();
            var str_g_m = "";
            var single_point = this.game_board.moveInRule(f_position, s_position);
            str_g_m = this.game_board.toString();
            this.differ(str_g_f, str_g_m);
            str_g_f = str_g_m;
            this.points += single_point;
            console.log("Current points", this.points, "| Steps Remaining", this.out_steps);
            this.x += 1;
            if (this.out_steps <= 0) {
                this.is_ended = true;
                console.log("Game Over");
                console.log("You get", this.points, "Points in", this.x, "steps.");
                return this.points;
            }
        }
    };
    Rules.prototype.pause = function () {
        if (!this.init_status) {
            console.log("This board is not initated yet!");
        }
        console.log("Game Over");
        console.log("You get", this.points, "Points in", this.x, "steps.");
        this.is_ended = false;
        this.is_paused = true;
        return this.points;
    };
    return Rules;
}());
exports.Rules = Rules;
// Testing
// let f_list = [new Position(1, 0), new Position(0, 1), new Position(1, 1)]
// let s_list = [new Position(1, 1), new Position(1, 1), new Position(1, 2)]
//let listener: BoardListener<string> = {
//    isMoved(first: Position, second: Position) {
//        console.log(first.toString() + "<==>" + second.toString())
//    }
//}
//game_board.addListener(listener)
//let points = 0
//let out_steps = 5
//let i = 0
//let type_list = ["A", "B", "C"]
//let game_board = new Board([6, 6], type_list)
//let str_g_0 = game_board.toString()
//play(new Position(1, 0), new Position(1, 1))
//play(new Position(0, 1), new Position(1, 1))
//play(new Position(1, 1), new Position(1, 2))
//play(new Position(2, 4), new Position(2, 5))
//play(new Position(2, 2), new Position(3, 2))
//console.log(chalk.blue("Points: ", game_board.moveInRule(new Position(1, 0), new Position(1, 1))));
//let str_g_1 = game_board.toString();
//differ(str_g_0, str_g_1);
//console.log(chalk.blue("Points: ", game_board.moveInRule(new Position(0, 1), new Position(1, 1))));
//let str_g_2 = game_board.toString();
//differ(str_g_1, str_g_2);
//console.log(chalk.blue("Points: ", game_board.moveInRule(new Position(1, 1), new Position(1, 2))));
//let str_g_3 = game_board.toString();
//differ(str_g_2, str_g_3);
