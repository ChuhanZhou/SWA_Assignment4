"use strict";
exports.__esModule = true;
exports.Score = void 0;
var Score = /** @class */ (function () {
    function Score(user_name, user_id, score) {
        this.user_name = user_name;
        this.user_id = user_id;
        this.score = score;
        this.create_time = Date.now();
    }
    Score.prototype.getCreateTime = function () {
        return new Date(this.create_time);
    };
    Score.prototype.copy = function () {
        var copy = new Score(this.user_name, this.user_id, this.score);
        copy.create_time = this.create_time;
        return copy;
    };
    return Score;
}());
exports.Score = Score;
