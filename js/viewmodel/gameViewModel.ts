import system_model from '../models/systemModel';
import {BindData} from "../models/domain/bindData"
import { User } from '../models/domain/user';
import { Rules } from '../models/domain/rules';
import { getPathContributingMatches } from '@remix-run/router/dist/utils';

export class GameViewModel{;
    resultScore = new BindData("");
    rank = new BindData([])

    initGame(){
        let type_list = ["A", "B", "C"]
        let size = [5, 5]
        system_model.initGame(10, type_list, size)
    }

    getBoard()
    {
        return system_model.getBoard()
    }
    
    getPieceList(){
        return system_model.getBoard().getGameBoard().piece_list
    }

    getOutsteps(){
        return system_model.getBoard().getOut_steps()
    }
    
    getPoint(){
        return system_model.getBoard().getPoints()
    }

    async postGameData(){
        let user = system_model.getUserInfo()
        let token = system_model.getToken()
        let getboard = system_model.getBoard()
        return await system_model.postGameData_sys(getboard,user.id,token)
    }

    async getGameArray(){
        this.rank.changeValue(await system_model.getAllGameInfo())
    }

    async updateUser(){
        let user = system_model.getUserInfo()
        user.addNewScore(this.getPoint())
        return await system_model.updateUserInfo(user)
    }


}



const game_viewmodel = new GameViewModel();
export default game_viewmodel;