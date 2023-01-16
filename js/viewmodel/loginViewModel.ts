import system_model from '../models/systemModel';
import {BindData} from "../models/domain/bindData"

export class LoginViewModel{
    username = new BindData("")
    password = new BindData("")
    error = new BindData("")

    constructor(){}

    async register(){
        let result = await system_model.register(this.username.getValue(),this.password.getValue())
        if (!result.ok){
            this.error.changeValue(result.info)
        }else{
            this.password.changeValue("")
        }
        return result.ok
    }

    async login(){
        let result = await system_model.login(this.username.getValue(),this.password.getValue())
        if (!result.ok){
            this.error.changeValue(result.info)
        }else{
            this.password.changeValue("")
        }
        return result.ok
    }
}

const login_viewmodel = new LoginViewModel();
export default login_viewmodel;