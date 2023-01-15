import { Board, Position, BoardListener } from './board';
//const chalk = require("chalk");

export class Rules {
    id:string=""
    points: number = 0
    out_steps: number
    type_list: Array<string>
    size: Array<number>
    game_board: Board<string>
    x: number = 0
    init_status: boolean = false
    is_ended: boolean = false
    is_paused: boolean = false
    constructor(out_steps: number, type_list: Array<string>, size: Array<number>) {
        this.out_steps = out_steps
        this.type_list = type_list
        this.size = size
    }
    // Getter/setter 

    getId(): string {
        return this.id
    }

    setId(id: string) {
        this.id = id
    }

    getPoints(): number {
        return this.points
    }

    setPoints(points: number) {
        this.points = points
    }

    getOut_steps(): number {
        return this.out_steps
    }

    setOut_steps(out_steps: number) {
        this.out_steps = out_steps
    }

    getType_list(): Array<string> {
        return this.type_list
    }

    setType_list(type_list: Array<string>) {
        this.type_list = type_list
    }

    getSize(): Array<number> {
        return this.size
    }

    setSize(size: Array<number>) {
        this.size = size
    }

    getGameBoard(): Board<string> {
        return this.game_board
    }

    getEndingStatus(): boolean{
        return this.is_ended
    }

    getPausingStatus(): boolean{
        return this.is_paused
    }

    differ(str1: String, str2: String) {
        let output1 = '';
        let output2 = '';
        for (let i = 0; i < str1.length; i++) {
            if (str1[i] !== str2[i]) {
                output1 += str1[i];
                output2 += str2[i];
            } else {
                output1 += str1[i];
                output2 += str2[i];
            }
        }
        console.log(output1);
        console.log(output2);
    }

    initBoard() {
        this.game_board = new Board([this.size[0], this.size[1]], this.type_list);
        this.init_status = true
        return this.game_board;
    }


    play(f_position: Position, s_position: Position) {
        if (!this.init_status) {
            console.log("This board is not initated yet!")
        }
        else if (this.is_paused) {
            console.log("This Game is paused!")
        }
        else {
            this.out_steps -= 1
            let str_g_f = this.game_board.toString()
            let str_g_m = ""
            let single_point = this.game_board.moveInRule(f_position, s_position);
            str_g_m = this.game_board.toString()
            this.differ(str_g_f, str_g_m)
            str_g_f = str_g_m
            this.points += single_point;
            console.log("Current points", this.points, "| Steps Remaining", this.out_steps)
            this.x += 1
            if (this.out_steps <= 0) {
                this.is_ended = true
                console.log("Game Over")
                console.log("You get", this.points, "Points in", this.x, "steps.")
                return this.points
            }
        }
    }

    pause() {
        if (!this.init_status) {
            console.log("This board is not initated yet!")
        }
        console.log("Game Over")
        console.log("You get", this.points, "Points in", this.x, "steps.")
        this.is_ended = false
        this.is_paused = true
        return this.points
    }
}
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

