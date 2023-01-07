import { Position } from './js/models/domain/board';
import { Game } from './js/models/domain/game';
import system_model from './js/models/systemModel';
let game_array = new Array<Game>


let type_list = ["A", "B", "C"]
let size = [6, 6]
// let game = new Rules(5, type_list, size)





system_model.login("B", "111").then(async () => {
    let user = system_model.getUserInfo()
    let token = system_model.getToken()
    system_model.getAllGameInfo(user.id, token)
    system_model.getGameInfoFromID(4, token)

    system_model.initGame(5, type_list, size)
    let game = system_model.getBoard()
    game.play(new Position(1, 0), new Position(1, 1))
    game.play(new Position(0, 1), new Position(1, 1))
    game.play(new Position(1, 1), new Position(1, 2))
    game.play(new Position(2, 4), new Position(2, 5))
    game.play(new Position(2, 2), new Position(3, 2))
    
    system_model.postGameData_sys(game,user.id,token)

})