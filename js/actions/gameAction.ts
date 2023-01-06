const chalk = require("chalk");
import dispatcher from "../dispatcher";
import { Game } from "../models/game";
import { Rules } from "../models/rules";
import actionTypes from "./actionTypes";

var host = 'http://localhost:9090/'
var XMLHttpRequest = require('xhr2');

export function getAllGameData(id: number, token: string) {
    var xhr = new XMLHttpRequest();
    let url = host + 'games' + "?token=" + token;
    console.log(chalk.blue("Requesting: ", url));

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let info = JSON.parse(xhr.responseText);
                console.log(chalk.green("Info: ", info))
                dispatcher.dispatch({
                    actionTypes: actionTypes.GAME_INFO,
                    info: info,
                });
            } else {
                console.log(chalk.bgRed("Wrong id/token"))
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong id or token",
                });
            }
        }
    }
    xhr.send();
}

export function getGameData(id: number, token: string) {
    var xhr = new XMLHttpRequest();
    let url = host + 'games/' + id + "?token=" + token;
    console.log(chalk.blue("Requesting: ", url));

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let info = JSON.parse(xhr.responseText);
                console.log(chalk.green("Info: ", info))
                dispatcher.dispatch({
                    actionTypes: actionTypes.GAME_INFO,
                    info: info,
                });
            } else {
                console.log(chalk.bgRed("Wrong id/token"))
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong id or token",
                });
            }
        }
    }
    xhr.send();
}

export function postGameData(rule: Rules, user_id: number, token: string) {
    let game_id
    let score = rule.getPoints()
    let _game = new Game(user_id, score)
    var xhr = new XMLHttpRequest();
    var s_xhr = new XMLHttpRequest();
    let s_url = host + 'games/' + "?token=" + token;

    let is_paused = rule.getPausingStatus()
    let is_ended = rule.getEndingStatus()


    if (is_paused) {
        console.log(chalk.red("This game is Paused, ES: ", is_ended, " PS: ", is_paused, "Score: ", _game.getScore()))
        _game.setScore(0)
        _game.setCompleted(false)
    }
    else {
        _game.setCompleted(true)
    }

    // console.log(chalk.blue("Posting: ", url, "ES: ", is_ended, " PS: ", is_paused, " ID: ", _game.id, "Score: ",_game.score));
    let payload = JSON.stringify(_game)

    console.log(chalk.blue("Posting sxhr: ", s_url));

    s_xhr.open("POST", s_url, true);
    s_xhr.setRequestHeader("Content-Type", "application/json");

    s_xhr.onreadystatechange = function () {
        if (s_xhr.readyState == 4) {
            if (s_xhr.status == 200 || s_xhr.status == 201) {
                let info = s_xhr.responseText;
                const data = JSON.parse(info);
                game_id = data.id;
                console.log(chalk.green("Generation Compelete: ", " Game ID: ", game_id))
                dispatcher.dispatch({
                    actionTypes: actionTypes.GAME_POST,
                    info: info,
                });
                let url = host + 'games/' + game_id + "?token=" + token;
                console.log(chalk.blue("Posting: ", url, "\nPayload: ", payload));
                xhr.open("PATCH", url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            let info = xhr.responseText;
                            console.log(chalk.green("Info: ", info))
                            dispatcher.dispatch({
                                actionTypes: actionTypes.GAME_POST,
                                info: info,
                            });
                        } else {
                            console.log(chalk.bgRed(xhr.status, " Wrong id/token"))
                            dispatcher.dispatch({
                                actionTypes: actionTypes.ERROR,
                                info: "Wrong id or token",
                            });
                        }
                    }
                }
                xhr.send(payload);

            } else {
                console.log(chalk.bgRed(s_xhr.status, " Wrong id/token"))
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "Wrong id or token",
                });
            }
        }
    }



    s_xhr.send();

}