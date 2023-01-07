import { v4 as uuidv4 } from 'uuid';
const chalk = require("chalk");

export class Game {

  private id: string;
  private user: number;
  private score: number;
  private completed: boolean = false;

  constructor(user_id: number, score: number) {
    this.user = user_id;
    this.score = score;
  }

  getId(): string {
    return this.id;
  }

  setId(value: string) {
    this.id = value;
  }

  generate_id() {
    this.id = uuidv4()
    console.log(chalk.green("[Game_obj] created UUID for game: ", this.id))
  }

  get user_id(): number {
    return this.user;
  }

  set user_id(value: number) {
    this.user = value;
  }

  getScore(): number {
    return this.score;
  }

  setScore(value: number) {
    this.score = value;
  }

  getCompleted(): boolean {
    return this.completed;
  }

  setCompleted(value: boolean) {
    this.completed = value;
  }

  toString(){
    console.log(chalk.green("LOG:  Game | ID:",this.id,"User ID:",this.user_id,"Score:",this.score,"Completed:",this.completed))
  }
}
