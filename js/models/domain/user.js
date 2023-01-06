"use strict";
exports.__esModule = true;
exports.User = void 0;
var score_1 = require("./score");
var User = /** @class */ (function () {
    function User(username, password, id, admin, profile, high_scores) {
        if (id === void 0) { id = -1; }
        if (admin === void 0) { admin = false; }
        if (profile === void 0) { profile = ""; }
        if (high_scores === void 0) { high_scores = []; }
        this.username = username;
        this.password = password;
        this.id = id;
        this.admin = admin;
        this.profile = profile;
        this.high_scores = high_scores;
    }
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.setUsername = function (username) {
        this.username = username;
    };
    User.prototype.isTruePassword = function (password) {
        return this.password == password;
    };
    User.prototype.changePassword = function (old_password, new_password) {
        if (this.isTruePassword(old_password)) {
            this.password = new_password;
            return true;
        }
        return false;
    };
    User.prototype.isAdmin = function () {
        return this.admin;
    };
    User.prototype.changeAdmin = function () {
        this.admin = !this.admin;
    };
    User.prototype.getProfile = function () {
        return this.profile;
    };
    User.prototype.setProfile = function (profile) {
        this.profile = profile;
    };
    User.prototype.addNewScore = function (score) {
        var new_score = new score_1.Score(this.username, this.id, score);
        this.high_scores.push(new_score);
        this.high_scores.sort(function (s1, s2) { return s2.score - s1.score; });
        if (this.high_scores.length > 3) {
            this.high_scores.pop();
        }
        return new_score.copy();
    };
    User.prototype.getHighScores = function () {
        var out = [];
        for (var i = 0; i < this.high_scores.length; i++) {
            out.push(this.high_scores[i].copy());
        }
        return out;
    };
    User.prototype.copy = function () {
        var copy = new User(this.username, this.password, this.id, this.admin, this.profile, this.getHighScores());
        return copy;
    };
    return User;
}());
exports.User = User;
