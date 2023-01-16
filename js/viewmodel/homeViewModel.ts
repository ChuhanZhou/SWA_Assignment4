import system_model from '../models/systemModel';
import {BindData} from "../models/domain/bindData"
import { User } from '../models/domain/user';

export class HomeViewModel{
    username = new BindData("");
    password = new BindData("");
    score = new BindData([]);

    oldPassword = new BindData("");
    newPassword = new BindData("");
    error = new BindData("");
    profile = new BindData("");
    textarea = new BindData("");

    constructor(){
    }

    getUser(){
        let user = system_model.getUserInfo()
        this.username.changeValue(user.getUsername())
        this.password.changeValue(user.password)
        this.profile.changeValue(user.getProfile())
        this.textarea.changeValue(user.getProfile())
        this.score.changeValue(user.getHighScores())
        return user
    }

    async updateProfile(){
        let new_user = system_model.getUserInfo()
        new_user.setProfile(this.textarea.getValue())
        console.log(new_user)
        return await this.updateUserInfo(new_user)
    }

    async changePassword(){
        let new_user = system_model.getUserInfo()
        if(new_user.changePassword(this.oldPassword.getValue(),this.newPassword.getValue())){
            let result = await this.updateUserInfo(new_user)
            if (result){
                this.oldPassword.changeValue("")
                this.newPassword.changeValue("") 
            }
            return result
        }
        this.error.changeValue("wrong password")    
        return false
    }

    async updateUserInfo(new_user:User=this.getUser()){
        let result = await system_model.updateUserInfo(new_user)
        if (result.ok){
            this.getUser()
            this.error.changeValue("")
        }else{
            this.error.changeValue(result.info)
        }
        return result.ok
    }

    async logout(){
        let result =  await system_model.logout()
        if (!result.ok){
            this.error.changeValue(result.info)
        }
        return result.ok
    }
}

const home_viewmodel = new HomeViewModel();
export default home_viewmodel;