export class Score{
    user_name:string
    user_id:number
    score:number
    create_time:number

    constructor(user_name:string,user_id:number,score:number,create_time:number = Date.now()){
        this.user_name = user_name
        this.user_id = user_id
        this.score = score
        this.create_time = create_time
    }

    getCreateTime():Date{
        return new Date(this.create_time)
    }

    copy():Score{
        let copy = new Score(this.user_name,this.user_id,this.score,this.create_time)
        return copy
    }
}