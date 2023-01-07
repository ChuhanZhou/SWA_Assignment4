import { User } from '../models/domain/user';
var host = 'http://localhost:9090/'
import fetch from 'node-fetch' 
// npm install node-fetch@2

export async function registerApi(username:string,password:string) {
    let url = host + 'users';
    let send_data = JSON.stringify(new User(username,password));
    console.log("[POST] url: "+url+" data: "+send_data);

    let response = await fetch(url,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: send_data
    })
    if (response.status==201){
        let info = JSON.parse(await response.text());
        let new_user = new User(info.username,info.password,info.id,info.admin,info.profile,info.high_scores)
        console.log(new_user)
        return {ok:true}
    }else{
        return {
            ok:false,
            info: "the username already exists"
        }
    }
}

export async function loginApi(username:string,password:string) {
    let url = host + 'login';
    let send_data = JSON.stringify(new User(username,password));
    console.log("[POST] url: "+url+" data: "+send_data);

    let response = await fetch(url,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: send_data
    })
    if (response.status==200){
        let info = JSON.parse(await response.text());
        let token = info.token
        let userId = info.userId
        return {
            ok:true,
            token: token,
            id:userId
        }
    }else{
        return {
            ok:false,
            info: "wrong username or password",
        }
    }
}

export async function logoutApi(token:string) {
    let url = host + 'logout?token='+token;
    console.log("[POST] url: "+url);

    let response = await fetch(url,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
    })
    if (response.status==200){
        return {ok:true}
    }else{
        return {
            ok:false,
            info: "wrong token",
        }
    }
}

export async function getUserInfoApi(id:number,token:string){
    let url = host + 'users/'+id+"?token="+token;
    console.log("[GET] url: "+url);

    let response = await fetch(url,{
        method:"GET",
        headers:{
            'Content-Type': 'application/json'
        },
    })
	if (response.status==200){
        let info = JSON.parse(await response.text());
        let user = new User(info.username,info.password,info.id,info.admin,info.profile,info.high_scores)
        return {
            ok:true,
            user: user,
        }
    }else{
        return {
            ok:false,
            info: "wrong id or token",
        }
    }
}

export async function updateUserInfoApi(user:User,token:string){
    let url = host + 'users/'+user.id+"?token="+token;
    let send_data = JSON.stringify(user);
    console.log("[PATCH] url: "+url+" data: "+send_data);

    let response = await fetch(url,{
        method:"PATCH",
        headers:{
            'Content-Type': 'application/json'
        },
        body: send_data
    })
    if (response.status==200){
        return {ok:true}
    }else{
        return {
            ok:false,
            info: "wrong token",
        }
    }
}