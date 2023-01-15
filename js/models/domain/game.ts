import { v4 as uuidv4 } from 'uuid';
//const chalk = require("chalk");

export class Game {

  private id: string;
  private user_id: number;
  private score: number;
  private completed: boolean = false;

  constructor(user_id: number, score: number) {
    this.user_id = user_id;
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
    console.log("[Game_obj] created UUID for game: ", this.id)
  }

  getUser_id(): number {
    return this.user_id
  }

  setUser_id(value: number) {
    this.user_id = value;
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
}
