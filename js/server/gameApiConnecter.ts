import fetch from 'node-fetch' 
const chalk = require("chalk");
var host = 'http://localhost:9090/'
import { Game } from'../models/domain/game';
import { Rules } from '../models/domain/rules';

export async function getAllGameApi(id: number, token: string){
    let url = host + 'games' + "?token=" + token;
    console.log(chalk.blue("Requesting: ", url));

    let response = await fetch(url,{
        method:"GET",
        headers:{
            'Content-Type': 'application/json'
        },
    })

	if (response.status==200){
        let info = await response.text();
        let info_size = JSON.parse(info);
        // let game = new Game(info.user,info.score)
        // game.setId(info.id)
        // game.setCompleted(info.completed)
        const length = info_size.length;
        console.log(chalk.green("Size: ",length," | API_response:", info,))
        return {
            ok:true,
            info:info,
            info_array:info_size
        }
    }else{
        return {
            ok:false,
            info: "wrong id or token",
        }
    }
}

export async function getGameApi(game_id: number, token: string){
    let url = host + 'games/' + game_id + "?token=" + token;
    console.log(chalk.blue("Requesting: ", url));

    let response = await fetch(url,{
        method:"GET",
        headers:{
            'Content-Type': 'application/json'
        },
    })

	if (response.status==200){
        let info_r = await response.text();
        let info = JSON.parse(info_r);
        let game = new Game(info.user,info.score)
        game.setId(info.id)
        game.setCompleted(info.completed)
        //const length = info_size.length;
        console.log(chalk.green("API_response: gameid: ",game_id," | ", info_r))
        return {
            ok:true,
            game:game,
        }
    }else{
        return {
            ok:false,
            info: response.status,
        }
    }
}

export async function postGameData(rule: Rules, user_id: number, token: string){
    let game_id
    let score = rule.getPoints()
    let _game = new Game(user_id, score)
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

    let response = await fetch(s_url,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: null
    })
    if (response.status==200||response.status==201){
        let info = JSON.parse(await response.text());
        const data = info;
        game_id = data.id;
        console.log(chalk.green("Generation Compelete: ", " Game ID: ", game_id))
        let url = host + 'games/' + game_id + "?token=" + token;
        console.log(chalk.blue("Posting: ", url, "\nPayload: ", payload));


        //ST
        let response_s = await fetch(url,{
            method:"PATCH",
            headers:{
                'Content-Type': 'application/json'
            },
            body: payload
        })
        if (response_s.status==200){
            let info = await response_s.text();
            console.log(chalk.green("Info: ", info))
            return {
                ok:true,
                token: token,
                info:info
            }
        }else{
            console.log(chalk.bgRed(response_s.status, " Wrong id/token"))
            return {
                ok:false,
                info: "wrong username or password",
            }
        }
        //END

        return {
            ok:true,
        }
    }else{
        return {
            ok:false,
            info: "wrong username or password",
        }
    }
}