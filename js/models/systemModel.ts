import { registerApi,loginApi,logoutApi,getUserInfoApi,updateUserInfoApi } from '../server/userApiConnecter';
import { User } from '../models/domain/user';
import { getAllGameApi, getGameApi, postGameData } from '../server/gameApiConnecter';
import { Game } from './domain/game';
import { Rules } from './domain/rules';

 class SystemModel{
    private user:User
    private token:string
    private game: Game
    private board:Rules
    constructor(){
        this.user = new User("","");
        this.token = "";
    }

    async register(username:string,password:string) {
        let api_result = await registerApi(username,password)
        if(api_result.ok){
            return this.login(username,password)
        }
        return api_result
    }

    async login(username:string,password:string) {
        let api_result = await loginApi(username,password)
        if(api_result.ok){
            this.token = api_result.token
            let info_api_result = await getUserInfoApi(api_result.id,this.token)
            if (info_api_result.ok){
                this.user = info_api_result.user.copy()
            }
            return info_api_result
        }
        return api_result
    }
    
    async logout(){
        let api_result = await logoutApi(this.token)
        if(api_result.ok){
            this.token = "";
            this.user = new User("","");
        }
        return api_result
    }
    
    async updateUserInfo(new_user:User){
        let api_result = await updateUserInfoApi(new_user,this.token)
        if(api_result.ok){
            let info_api_result = await getUserInfoApi(this.user.id,this.token)
            if (info_api_result.ok){
                this.user = info_api_result.user.copy()
            }
            return info_api_result
        }
        return api_result
    }
    
    async getAllGameInfo(id?: number, token: string = this.token){
        let api_result = await getAllGameApi(id,token)
        let game_array = new Array<Game>
        if(api_result.ok){
            api_result.info_array.forEach(response => {
                let s_game = new Game(response.user,response.score)
                s_game.setId(response.id)
                s_game.setCompleted(response.completed)
                game_array.push(s_game)
            });
            game_array.sort((a, b) => b.getScore() - a.getScore())
            game_array = game_array.slice(0, 10)
            return game_array
        }
        else {
        return game_array
        }
    }

    async getGameInfoFromID(game_id: number, token: string = this.token){
        let api_result = await getGameApi(game_id,token)
        if(api_result.ok){
            this.game = api_result.game
            this.game.toString()
            return this.game
        }
        return api_result
    }

    async postGameData_sys(rule: Rules, user_id: number, token: string = this.token){
        let api_result = await postGameData(rule,user_id,token)
        return api_result
    }

    initGame(out_steps: number, type_list: Array<string>, size: Array<number>) {
        this.board = new Rules(out_steps, type_list, size)
        this.board.initBoard()
    }

    getBoard(): Rules {
        return this.board;
    }

    getUserInfo(){
        return this.user.copy()
    }

    getToken(){
        return this.token
    }

    getGame(){
        return this.game
    }
 }

const system_model = new SystemModel();
export default system_model;
