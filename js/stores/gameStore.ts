import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import actionTypes from "../actions/actionTypes";
import { Rules } from "../models/rules";

const event_type = {
    ERROR: "ERROR",
    GAME_INFO: "GAME_INFO",
    GAME_POST: "GAME_POST"
};
let board;
let error_info = "";
let game_info;
let game_post;
class GameStore extends EventEmitter {
    addGameInfoListener(callback: any) {
        this.on(event_type.GAME_INFO, callback);
    }
    removeGameInfoListener(callback: any) {
        this.removeListener(event_type.GAME_INFO, callback);
    }

    addGamePostListener(callback: any) {
        this.on(event_type.GAME_POST, callback);
    }
    removeGamePostListener(callback: any) {
        this.removeListener(event_type.GAME_POST, callback);
    }
    addErrorListener(callback: any) {
        this.on(event_type.ERROR, callback);
    }

    removeErrorListener(callback: any) {
        this.removeListener(event_type.ERROR, callback);
    }

    emitChange(type: string) {
        this.emit(type);
    }

    initGame(out_steps: number, type_list: Array<string>, size: Array<number>) {
        board = new Rules(out_steps, type_list, size)
        board.initBoard()
    }

    getBoard(): Rules {
        return board;
    }
}

let gamestore = new GameStore()
dispatcher.register((action: any) => {
    switch (action.actionTypes) {
        case actionTypes.ERROR:
            error_info = action.info;
            gamestore.emitChange(event_type.ERROR);
            break;
        case actionTypes.GAME_INFO:
            game_info = action.GAME_INFO;
            gamestore.emitChange(event_type.GAME_INFO);
            break;
        case actionTypes.GAME_POST:
            game_post = action.GAME_POST;
            gamestore.emitChange(event_type.GAME_POST);
            break;
        default:
            break;
    }
})

export default gamestore;