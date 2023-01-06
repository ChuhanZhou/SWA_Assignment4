import { registerApi,loginApi,logoutApi,getUserInfoApi,updateUserInfoApi } from '../server/userApiConnecter';
import { User } from '../models/domain/user';

 class SystemModel{
    private user:User
    private token:string

    constructor(){
        this.user = new User("","");
        this.token = "";
    }

    async register(username:string,password:string) {
        let api_result = await registerApi(username,password)
        if(api_result.ok){
            return this.login(username,password)
        }
        return api_result
    }

    async login(username:string,password:string) {
        let api_result = await loginApi(username,password)
        if(api_result.ok){
            this.token = api_result.token
            let info_api_result = await getUserInfoApi(api_result.id,this.token)
            if (info_api_result.ok){
                this.user = info_api_result.user.copy()
            }
            return info_api_result
        }
        return api_result
    }
    
    async logout(){
        let api_result = await logoutApi(this.token)
        if(api_result.ok){
            this.token = "";
            this.user = new User("","");
        }
        return api_result
    }
    
    async updateUserInfo(new_user:User){
        let api_result = await updateUserInfoApi(new_user,this.token)
        if(api_result.ok){
            let info_api_result = await getUserInfoApi(this.user.id,this.token)
            if (info_api_result.ok){
                this.user = info_api_result.user.copy()
            }
            return info_api_result
        }
        return api_result
    }
 
    getUserInfo(){
        return this.user.copy()
    }

    getToken(){
        return this.token
    }
 }

const system_model = new SystemModel();
export default system_model;
