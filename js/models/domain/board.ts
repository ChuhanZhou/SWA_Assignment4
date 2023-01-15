//const chalk = require("chalk");

export class Board<T>{
    piece_list: Array<Array<Piece<T>>>
    type_list: Array<T>
    type_num_map: Map<T, number>
    size: [number, number]//[height,width]
    listener_list: Array<BoardListener<T>>

    constructor(size: [number, number], type_list: Array<T>) {
        let row_size = size[0]//number of row
        let col_size = size[1]//number of column
        this.size = [row_size, col_size]
        this.piece_list = []
        this.type_list = type_list
        this.type_num_map = new Map<T, number>()
        this.listener_list = []
        for (var i = 0; i < type_list.length; i++) {
            this.type_num_map.set(type_list[i], 0)
        }

        for (var row_i = 0; row_i < row_size; row_i++) {
            this.piece_list.push([])
            for (var col_i = 0; col_i < col_size; col_i++) {
                let position = new Position(row_i, col_i)
                let type = this.chooseType(position)
                this.type_num_map.set(type, (this.type_num_map.get(type) ?? 0) + 1)
                let piece = new Piece(type, position)
                this.piece_list[row_i].push(piece)
            }
        }
    }

    private chooseType(position: Position): T {
        let neighbour_type_list = new Map<T | null, number>()
        let position_list = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        for (var i = 0; i < position_list.length; i++) {
            let neighbour_position = new Position(position.getRow() + position_list[i][0], position.getCol() + position_list[i][1])
            let neighbour = this.getPiece(neighbour_position)
            if (neighbour != undefined) {
                neighbour_type_list.set(neighbour.getType(), 1 + (neighbour_type_list.get(neighbour.getType()) ?? 0))
            }
        }

        //let type_map_sort = Array.from(this.type_num_map).sort(function () { return 0.5 - Math.random() }).sort((a, b) => { return a[1] - b[1] })
        let type_map_sort = Array.from(this.type_num_map).sort((a, b) => { return a[1] - b[1] })
        let out_type = type_map_sort[0][0]
        let type_num = type_map_sort[0][1]
        for (var i = 0; i < type_map_sort.length; i++) {
            let type = type_map_sort[i][0]
            let num = type_map_sort[i][1]
            if (!neighbour_type_list.has(type)) {
                out_type = type
                break
            }
        }
        return out_type
    }
    
    getPiece(position: Position): Piece<T> | undefined {
        if (this.piece_list.length > position.getRow() && position.getRow() >= 0) {
            if (this.piece_list[position.getRow()].length > position.getCol() && position.getCol() >= 0) {
                return this.piece_list[position.getRow()][position.getCol()]
            }
        }
        return undefined
    }

    setPiece(piece: Piece<T>) {
        let target_piece = this.getPiece(piece.getPosition())
        if (target_piece != undefined) {
            target_piece.setType(piece.getType())
        }
    }

    remove(position: Position) {
        //console.log(chalk.red("Removing Position of: ",position," Content: ",this.getPiece(position).getType()))
        let target = this.getPiece(position)
        if (target != undefined) {
            target.setType(null)
        }
    }

    canMove(first: Position, second: Position): boolean {
        let first_piece = this.getPiece(first)
        let second_piece = this.getPiece(second)
        if (first_piece != undefined && second_piece != undefined) {
            if (first_piece.isNeighbour(second_piece)) {
                return true
            }
        }
        return false
    }

    move(first: Position, second: Position) {
        if (this.canMove(first, second)) {
            let first_piece = this.getPiece(first)
            let second_piece = this.getPiece(second)
            let first_copy = first_piece?.copy()
            first_piece?.setType(second_piece?.getType() ?? first_piece.getType())
            second_piece?.setType(first_copy?.getType() ?? second_piece.getType())
            for (var i = 0; i < this.listener_list.length; i++) {
                this.listener_list[i].isMoved(first, second)
            }
        }
    }

    moveInRule(first: Position, second: Position){
        //console.log(chalk.green("<Board> Moving:",first,second))
        let remove_num = 0
        if (this.canMove(first, second)) {
            this.move(first,second)
            if (this.row_decution([first,second])){
                remove_num += this.pieceDropDown()
                while (this.row_decution(null))
                {
                    remove_num += this.pieceDropDown()
                }
                return remove_num
            }else{
                this.move(first,second)
            }
        }
        return remove_num
    }

    addListener(listener: BoardListener<T>) {
        this.listener_list.push(listener)
    }

    toString(): string {
        let out_str = ""
        for (var row_i = 0; row_i < this.size[0]; row_i++) {
            let str = "[ "
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                let position = new Position(row_i, col_i)
                let type = this.getPiece(position)?.getType()
                if (type != null) {
                    str += type + " "
                } else {
                    str += "# "
                }

            }
            str += "]\n"
            out_str += str
        }
        return out_str
    }

    pieceDropDown():number{
        let need_type_list: Array<Piece<T>> = []
        for (var col_i = 0; col_i < this.size[1]; col_i++) {
            let drop_type_list:Array<T> = []
            let drop = false
            let drop_position = new Position(-1,col_i)
            for (var row_i = this.size[0]-1; row_i >= 0; row_i--) {
                let position = new Position(row_i, col_i)
                let piece = this.getPiece(position)
                let type = piece?.getType()
                if (type == null && !drop){
                    drop = true
                    drop_position = position
                }else if (type != null && drop){
                    drop_type_list.push(type)
                    piece?.setType(null)
                }
            }
            let n = 0
            for (var row_i = drop_position.getRow(); row_i >= 0; row_i--) {
                let position = new Position(row_i, col_i)
                let piece = this.getPiece(position)
                if (n<drop_type_list.length){
                    piece?.setType(drop_type_list[n])
                    n++
                }else if (piece!=undefined){
                    need_type_list.push(piece)
                }
            }
        }

        need_type_list.forEach(piece=>{
            piece.setType(this.chooseType(piece.getPosition()))
        })
        return need_type_list.length
    }

    row_decution(l_position: Position[] | null) {
        let first_row: T[] = []
        let first_col: T[] = []
        let opt = false
        if (l_position == null) {
            for (var row_i = 0; row_i < this.size[0]; row_i++) {
                let s_position = new Position(row_i, 0)
                let cpt = (this.hoi_check(s_position))
                if (cpt){
                    opt = true
                }
                let type = this.getPiece(s_position)?.getType()
                first_row.push(<T>type)
            }
            // console.log(first_row)
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                let s_position = new Position(0, col_i)
                let cpt = (this.vet_check(s_position))
                if (cpt){
                    opt = true
                }
                let type = this.getPiece(s_position)?.getType()
                first_col.push(<T>type)
            }
        }
        else {
            l_position.forEach(pos => {
                //console.log(chalk.bgGreen("Start checking vet single position", pos.row, pos.col))
                let cpt = (this.vet_check(pos))
                if (cpt){
                    opt = true
                }
                //console.log(chalk.bgBlue("Start checking hoi single position", pos.row, pos.col))
                let kpt = (this.hoi_check(pos))
                if (kpt){
                    opt = true
                }
            })

        }
        return opt
    }
    
    vet_check(position: Position) {
        let removed = false
        let x = 0
        let position_array: Position[] = []
        let col = position.col
        let row = position.row
        let start_point = new Position(x, col)
        //console.log(chalk.yellow("Starting VET check at ", start_point.row, start_point.col));
        position_array.push(start_point)
        for (var i = 1; i < this.size[1]; i++) {
             //console.log(chalk.bgRed("SEQ",x));
            let check_point = new Position(i, col)
             //console.log(chalk.cyan("Checking", check_point.row, check_point.col, "|", this.getPiece(check_point)?.getType()));
            if (this.getPiece(start_point)?.getType() == this.getPiece(check_point)?.getType()) {
                position_array.push(check_point)
                //console.log(chalk.bgRed(check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3));
                if (check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    let removed_type = this.getPiece(position_array[0]).getType()
                    position_array.forEach(po => {
                        this.remove(po)
                    })
                    removed = true
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array,"Element Value: ",removed_type))
                    position_array = []
                    x += 1
                    start_point = new Position(x, col)
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array.length, " pushed content:", this.getPiece(check_point)?.getType(), "Array: ", position_array))
                    x += 1
                    start_point = new Position(x, col)
                }
            }
            else {
                if (position_array.length >= 3) {
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    let removed_type = this.getPiece(position_array[0]).getType()
                    position_array.forEach(po => {
                        this.remove(po)
                    })
                    removed = true
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array,"Element Value: ",removed_type))
                    position_array = []
                    x += 1
                    start_point = new Position(x, col)
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point)?.getType(), "Not Match with ", this.getPiece(start_point)?.getType()))
                position_array = []
                position_array.push(check_point)
                //console.log(chalk.cyan("EXM", check_point.row, check_point.col, this.getPiece(check_point)?.getType(), "|", start_point.row, start_point.col, this.getPiece(start_point)?.getType()))
                x += 1
                start_point = new Position(x, col)
            }
        }
        return removed
        //console.log(chalk.red("Array checking compelete"))
    }

    hoi_check(position: Position) {
        let removed = false
        let x = 0
        let position_array_h: Position[] = []
        let col = position.col
        let row = position.row
        let start_point_h = new Position(row, x)
        //console.log(chalk.yellow("Starting HOI check at ", start_point_h.row, start_point_h.col, this.getPiece(start_point_h)?.getType()));
        position_array_h.push(start_point_h)
        // console.log(position_array);
        for (var i = 1; i < this.size[0]; i++) {
            let check_point_h = new Position(row, i)
            if (this.getPiece(start_point_h)?.getType() == this.getPiece(check_point_h)?.getType()) {
                position_array_h.push(check_point_h)
                if (check_point_h.col + 1 >= this.size[1] && position_array_h.length >= 3 || check_point_h.col - 1 <= 0 && position_array_h.length >= 3 || check_point_h.row + 1 >= this.size[0] && position_array_h.length >= 3 || check_point_h.row - 1 <= 0 && position_array_h.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    let removed_type = this.getPiece(position_array_h[0]).getType()
                    position_array_h.forEach(po => {
                        this.remove(po)
                    })
                    removed = true
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h,"Element Value: ",removed_type))
                    position_array_h = []
                    x += 1
                    start_point_h = new Position(row, x)
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array_h.length, " pushed content:", this.getPiece(check_point_h)?.getType(), "Array: ", position_array_h))
                    x += 1
                    start_point_h = new Position(row, x)
                }

            }
            else {
                if (position_array_h.length >= 3) {
                    let removed_type = this.getPiece(position_array_h[0]).getType()
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    position_array_h.forEach(po => {
                        this.remove(po)
                    })
                    removed = true
                    x += 1
                    start_point_h = new Position(row, x)
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h,"Element Value: ",removed_type))
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point_h)?.getType(), "Not Match with ", this.getPiece(start_point_h)?.getType()))
                position_array_h = []
                position_array_h.push(check_point_h)
                x += 1
                start_point_h = new Position(row, x)
            }
        }
        return removed
    }
}


export type BoardListener<T> = {
    isMoved(first: Position, second: Position):any
}

export class Piece<T>{
    type: T | null;
    position: Position;

    constructor(type: T, position: Position) {
        this.type = type
        this.position = position
    }

    getType(): T | null {
        return this.type
    }

    getPosition(): Position {
        return this.position
    }

    setType(type: T | null) {
        this.type = type
    }

    setPosition(position: Position) {
        this.position = position
    }

    isNeighbour(other: Piece<T>): boolean {
        let other_position = other.getPosition()
        let length = Math.sqrt(Math.pow(this.position.getCol() - other_position.getCol(), 2) + Math.pow(this.position.getRow() - other_position.getRow(), 2))
        return length == 1
    }

    copy(): Piece<T | null> {
        return new Piece(this.type, this.position.copy())
    }

}

export class Position {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row
        this.col = col
    }

    getRow(): number {
        return this.row
    }

    getCol(): number {
        return this.col
    }

    set(row: number, col: number): void {
        this.row = row
        this.col = col
    }

    copy(): Position {
        return new Position(this.row, this.col)
    }

    toString(): string {
        return "[" + this.row + "," + this.col + "]"
    }
}