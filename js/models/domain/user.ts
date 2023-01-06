import { Score } from './score';

export class User{
    username: string
    password: string
    id: number
    admin: boolean
    profile: string
    high_scores: Array<Score>

    constructor(username: string,password: string,id: number = -1,admin: boolean = false,profile = "",high_scores: Score[] = []) {
        this.username = username
        this.password = password
        this.id = id
        this.admin = admin
        this.profile = profile
        this.high_scores = high_scores
    }

    getUsername():string{
        return this.username
    }

    setUsername(username: string){
        this.username = username
    }

    isTruePassword(password: string){
        return this.password == password
    }
    
    changePassword(old_password:string,new_password:string): boolean{
        if (this.isTruePassword(old_password)){
            this.password = new_password
            return true
        }
        return false
    }

    isAdmin():boolean{
        return this.admin
    }
    
    changeAdmin(){
        this.admin = !this.admin
    }

    getProfile():string{
        return this.profile
    }

    setProfile(profile:string){
        this.profile = profile
    }

    addNewScore(score:number):Score{
        let new_score = new Score(this.username,this.id,score)
        this.high_scores.push(new_score)
        this.high_scores.sort(function(s1, s2){return s2.score - s1.score})
        if (this.high_scores.length>3){
            this.high_scores.pop()
        }
        return new_score.copy()
    }

    getHighScores():Array<Score>{
        let out = []
        for (var i = 0; i < this.high_scores.length; i++) {
            out.push(this.high_scores[i].copy())
        }
        return out
    }

    copy(): User{
        let copy = new User(this.username,this.password,this.id,this.admin,this.profile,this.getHighScores())
        return copy
    }
}

