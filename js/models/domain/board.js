"use strict";
//const chalk = require("chalk");
exports.__esModule = true;
exports.Position = exports.Piece = exports.Board = void 0;
var Board = /** @class */ (function () {
    function Board(size, type_list) {
        var _a;
        var row_size = size[0]; //number of row
        var col_size = size[1]; //number of column
        this.size = [row_size, col_size];
        this.piece_list = [];
        this.type_list = type_list;
        this.type_num_map = new Map();
        this.listener_list = [];
        for (var i = 0; i < type_list.length; i++) {
            this.type_num_map.set(type_list[i], 0);
        }
        for (var row_i = 0; row_i < row_size; row_i++) {
            this.piece_list.push([]);
            for (var col_i = 0; col_i < col_size; col_i++) {
                var position = new Position(row_i, col_i);
                var type = this.chooseType(position);
                this.type_num_map.set(type, ((_a = this.type_num_map.get(type)) !== null && _a !== void 0 ? _a : 0) + 1);
                var piece = new Piece(type, position);
                this.piece_list[row_i].push(piece);
            }
        }
    }
    Board.prototype.chooseType = function (position) {
        var _a;
        var neighbour_type_list = new Map();
        var position_list = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (var i = 0; i < position_list.length; i++) {
            var neighbour_position = new Position(position.getRow() + position_list[i][0], position.getCol() + position_list[i][1]);
            var neighbour = this.getPiece(neighbour_position);
            if (neighbour != undefined) {
                neighbour_type_list.set(neighbour.getType(), 1 + ((_a = neighbour_type_list.get(neighbour.getType())) !== null && _a !== void 0 ? _a : 0));
            }
        }
        //let type_map_sort = Array.from(this.type_num_map).sort(function () { return 0.5 - Math.random() }).sort((a, b) => { return a[1] - b[1] })
        var type_map_sort = Array.from(this.type_num_map).sort(function (a, b) { return a[1] - b[1]; });
        var out_type = type_map_sort[0][0];
        var type_num = type_map_sort[0][1];
        for (var i = 0; i < type_map_sort.length; i++) {
            var type = type_map_sort[i][0];
            var num = type_map_sort[i][1];
            if (!neighbour_type_list.has(type)) {
                out_type = type;
                break;
            }
        }
        return out_type;
    };
    Board.prototype.getPiece = function (position) {
        if (this.piece_list.length > position.getRow() && position.getRow() >= 0) {
            if (this.piece_list[position.getRow()].length > position.getCol() && position.getCol() >= 0) {
                return this.piece_list[position.getRow()][position.getCol()];
            }
        }
        return undefined;
    };
    Board.prototype.setPiece = function (piece) {
        var target_piece = this.getPiece(piece.getPosition());
        if (target_piece != undefined) {
            target_piece.setType(piece.getType());
        }
    };
    Board.prototype.remove = function (position) {
        //console.log(chalk.red("Removing Position of: ",position," Content: ",this.getPiece(position).getType()))
        var target = this.getPiece(position);
        if (target != undefined) {
            target.setType(null);
        }
    };
    Board.prototype.canMove = function (first, second) {
        var first_piece = this.getPiece(first);
        var second_piece = this.getPiece(second);
        if (first_piece != undefined && second_piece != undefined) {
            if (first_piece.isNeighbour(second_piece)) {
                return true;
            }
        }
        return false;
    };
    Board.prototype.move = function (first, second) {
        var _a, _b;
        if (this.canMove(first, second)) {
            var first_piece = this.getPiece(first);
            var second_piece = this.getPiece(second);
            var first_copy = first_piece === null || first_piece === void 0 ? void 0 : first_piece.copy();
            first_piece === null || first_piece === void 0 ? void 0 : first_piece.setType((_a = second_piece === null || second_piece === void 0 ? void 0 : second_piece.getType()) !== null && _a !== void 0 ? _a : first_piece.getType());
            second_piece === null || second_piece === void 0 ? void 0 : second_piece.setType((_b = first_copy === null || first_copy === void 0 ? void 0 : first_copy.getType()) !== null && _b !== void 0 ? _b : second_piece.getType());
            for (var i = 0; i < this.listener_list.length; i++) {
                this.listener_list[i].isMoved(first, second);
            }
        }
    };
    Board.prototype.moveInRule = function (first, second) {
        //console.log(chalk.green("<Board> Moving:",first,second))
        var remove_num = 0;
        if (this.canMove(first, second)) {
            this.move(first, second);
            if (this.row_decution([first, second])) {
                remove_num += this.pieceDropDown();
                while (this.row_decution(null)) {
                    remove_num += this.pieceDropDown();
                }
                return remove_num;
            }
            else {
                this.move(first, second);
            }
        }
        return remove_num;
    };
    Board.prototype.addListener = function (listener) {
        this.listener_list.push(listener);
    };
    Board.prototype.toString = function () {
        var _a;
        var out_str = "";
        for (var row_i = 0; row_i < this.size[0]; row_i++) {
            var str = "[ ";
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                var position = new Position(row_i, col_i);
                var type = (_a = this.getPiece(position)) === null || _a === void 0 ? void 0 : _a.getType();
                if (type != null) {
                    str += type + " ";
                }
                else {
                    str += "# ";
                }
            }
            str += "]\n";
            out_str += str;
        }
        return out_str;
    };
    Board.prototype.pieceDropDown = function () {
        var _this = this;
        var need_type_list = [];
        for (var col_i = 0; col_i < this.size[1]; col_i++) {
            var drop_type_list = [];
            var drop = false;
            var drop_position = new Position(-1, col_i);
            for (var row_i = this.size[0] - 1; row_i >= 0; row_i--) {
                var position = new Position(row_i, col_i);
                var piece = this.getPiece(position);
                var type = piece === null || piece === void 0 ? void 0 : piece.getType();
                if (type == null && !drop) {
                    drop = true;
                    drop_position = position;
                }
                else if (type != null && drop) {
                    drop_type_list.push(type);
                    piece === null || piece === void 0 ? void 0 : piece.setType(null);
                }
            }
            var n = 0;
            for (var row_i = drop_position.getRow(); row_i >= 0; row_i--) {
                var position = new Position(row_i, col_i);
                var piece = this.getPiece(position);
                if (n < drop_type_list.length) {
                    piece === null || piece === void 0 ? void 0 : piece.setType(drop_type_list[n]);
                    n++;
                }
                else if (piece != undefined) {
                    need_type_list.push(piece);
                }
            }
        }
        need_type_list.forEach(function (piece) {
            piece.setType(_this.chooseType(piece.getPosition()));
        });
        return need_type_list.length;
    };
    Board.prototype.row_decution = function (l_position) {
        var _this = this;
        var _a, _b;
        var first_row = [];
        var first_col = [];
        var opt = false;
        if (l_position == null) {
            for (var row_i = 0; row_i < this.size[0]; row_i++) {
                var s_position = new Position(row_i, 0);
                var cpt = (this.hoi_check(s_position));
                if (cpt) {
                    opt = true;
                }
                var type = (_a = this.getPiece(s_position)) === null || _a === void 0 ? void 0 : _a.getType();
                first_row.push(type);
            }
            // console.log(first_row)
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                var s_position = new Position(0, col_i);
                var cpt = (this.vet_check(s_position));
                if (cpt) {
                    opt = true;
                }
                var type = (_b = this.getPiece(s_position)) === null || _b === void 0 ? void 0 : _b.getType();
                first_col.push(type);
            }
        }
        else {
            l_position.forEach(function (pos) {
                //console.log(chalk.bgGreen("Start checking vet single position", pos.row, pos.col))
                var cpt = (_this.vet_check(pos));
                if (cpt) {
                    opt = true;
                }
                //console.log(chalk.bgBlue("Start checking hoi single position", pos.row, pos.col))
                var kpt = (_this.hoi_check(pos));
                if (kpt) {
                    opt = true;
                }
            });
        }
        return opt;
    };
    Board.prototype.vet_check = function (position) {
        var _this = this;
        var _a, _b;
        var removed = false;
        var x = 0;
        var position_array = [];
        var col = position.col;
        var row = position.row;
        var start_point = new Position(x, col);
        //console.log(chalk.yellow("Starting VET check at ", start_point.row, start_point.col));
        position_array.push(start_point);
        for (var i = 1; i < this.size[1]; i++) {
            //console.log(chalk.bgRed("SEQ",x));
            var check_point = new Position(i, col);
            //console.log(chalk.cyan("Checking", check_point.row, check_point.col, "|", this.getPiece(check_point)?.getType()));
            if (((_a = this.getPiece(start_point)) === null || _a === void 0 ? void 0 : _a.getType()) == ((_b = this.getPiece(check_point)) === null || _b === void 0 ? void 0 : _b.getType())) {
                position_array.push(check_point);
                //console.log(chalk.bgRed(check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3));
                if (check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    var removed_type = this.getPiece(position_array[0]).getType();
                    position_array.forEach(function (po) {
                        _this.remove(po);
                    });
                    removed = true;
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array,"Element Value: ",removed_type))
                    position_array = [];
                    x += 1;
                    start_point = new Position(x, col);
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array.length, " pushed content:", this.getPiece(check_point)?.getType(), "Array: ", position_array))
                    x += 1;
                    start_point = new Position(x, col);
                }
            }
            else {
                if (position_array.length >= 3) {
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    var removed_type = this.getPiece(position_array[0]).getType();
                    position_array.forEach(function (po) {
                        _this.remove(po);
                    });
                    removed = true;
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array,"Element Value: ",removed_type))
                    position_array = [];
                    x += 1;
                    start_point = new Position(x, col);
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point)?.getType(), "Not Match with ", this.getPiece(start_point)?.getType()))
                position_array = [];
                position_array.push(check_point);
                //console.log(chalk.cyan("EXM", check_point.row, check_point.col, this.getPiece(check_point)?.getType(), "|", start_point.row, start_point.col, this.getPiece(start_point)?.getType()))
                x += 1;
                start_point = new Position(x, col);
            }
        }
        return removed;
        //console.log(chalk.red("Array checking compelete"))
    };
    Board.prototype.hoi_check = function (position) {
        var _this = this;
        var _a, _b;
        var removed = false;
        var x = 0;
        var position_array_h = [];
        var col = position.col;
        var row = position.row;
        var start_point_h = new Position(row, x);
        //console.log(chalk.yellow("Starting HOI check at ", start_point_h.row, start_point_h.col, this.getPiece(start_point_h)?.getType()));
        position_array_h.push(start_point_h);
        // console.log(position_array);
        for (var i = 1; i < this.size[0]; i++) {
            var check_point_h = new Position(row, i);
            if (((_a = this.getPiece(start_point_h)) === null || _a === void 0 ? void 0 : _a.getType()) == ((_b = this.getPiece(check_point_h)) === null || _b === void 0 ? void 0 : _b.getType())) {
                position_array_h.push(check_point_h);
                if (check_point_h.col + 1 >= this.size[1] && position_array_h.length >= 3 || check_point_h.col - 1 <= 0 && position_array_h.length >= 3 || check_point_h.row + 1 >= this.size[0] && position_array_h.length >= 3 || check_point_h.row - 1 <= 0 && position_array_h.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    var removed_type = this.getPiece(position_array_h[0]).getType();
                    position_array_h.forEach(function (po) {
                        _this.remove(po);
                    });
                    removed = true;
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h,"Element Value: ",removed_type))
                    position_array_h = [];
                    x += 1;
                    start_point_h = new Position(row, x);
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array_h.length, " pushed content:", this.getPiece(check_point_h)?.getType(), "Array: ", position_array_h))
                    x += 1;
                    start_point_h = new Position(row, x);
                }
            }
            else {
                if (position_array_h.length >= 3) {
                    var removed_type = this.getPiece(position_array_h[0]).getType();
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    position_array_h.forEach(function (po) {
                        _this.remove(po);
                    });
                    removed = true;
                    x += 1;
                    start_point_h = new Position(row, x);
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h,"Element Value: ",removed_type))
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point_h)?.getType(), "Not Match with ", this.getPiece(start_point_h)?.getType()))
                position_array_h = [];
                position_array_h.push(check_point_h);
                x += 1;
                start_point_h = new Position(row, x);
            }
        }
        return removed;
    };
    return Board;
}());
exports.Board = Board;
var Piece = /** @class */ (function () {
    function Piece(type, position) {
        this.type = type;
        this.position = position;
    }
    Piece.prototype.getType = function () {
        return this.type;
    };
    Piece.prototype.getPosition = function () {
        return this.position;
    };
    Piece.prototype.setType = function (type) {
        this.type = type;
    };
    Piece.prototype.setPosition = function (position) {
        this.position = position;
    };
    Piece.prototype.isNeighbour = function (other) {
        var other_position = other.getPosition();
        var length = Math.sqrt(Math.pow(this.position.getCol() - other_position.getCol(), 2) + Math.pow(this.position.getRow() - other_position.getRow(), 2));
        return length == 1;
    };
    Piece.prototype.copy = function () {
        return new Piece(this.type, this.position.copy());
    };
    return Piece;
}());
exports.Piece = Piece;
var Position = /** @class */ (function () {
    function Position(row, col) {
        this.row = row;
        this.col = col;
    }
    Position.prototype.getRow = function () {
        return this.row;
    };
    Position.prototype.getCol = function () {
        return this.col;
    };
    Position.prototype.set = function (row, col) {
        this.row = row;
        this.col = col;
    };
    Position.prototype.copy = function () {
        return new Position(this.row, this.col);
    };
    Position.prototype.toString = function () {
        return "[" + this.row + "," + this.col + "]";
    };
    return Position;
}());
exports.Position = Position;
