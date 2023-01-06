import dispatcher from "../dispatcher";
import actionTypes from "./actionTypes";
import { User } from '../models/user';

var host = 'http://localhost:9090/'
var XMLHttpRequest = require('xhr2');

export function register(username:string,password:string) {
    var xhr = new XMLHttpRequest();
    let url = host + 'users';
    let send_data = JSON.stringify(new User(username,password));
    console.log("[POST] url: "+url+" data: "+send_data);

	xhr.open("POST", url, true);
    xhr.setRequestHeader( "Content-Type", "application/json");
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
            if (xhr.status==201){
                let info = JSON.parse(xhr.responseText);
                let new_user = new User(info.username,info.password,info.id,info.admin,info.profile,info.high_scores)
			    console.log(new_user)
                login(username,password)
            }else{
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "the username already exists",
                });
            }
    	}
	}
    xhr.send(send_data);
}

export function login(username:string,password:string) {
    var xhr = new XMLHttpRequest();
    let url = host + 'login';
    let send_data = JSON.stringify(new User(username,password));
    console.log("[POST] url: "+url+" data: "+send_data);

	xhr.open("POST", url, true);
    xhr.setRequestHeader( "Content-Type", "application/json");
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
            if (xhr.status==200){
                let info = JSON.parse(xhr.responseText);
                let token = info.token
                let userId = info.userId
                dispatcher.dispatch({
                    actionTypes: actionTypes.LOGIN,
                    token: token,
                    id:userId
                });
                getUserInfo(userId,token)
            }else{
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong username or password",
                });
            }
    	}
	}
    xhr.send(send_data);
}

export function logout(token:string) {
    var xhr = new XMLHttpRequest();
    let url = host + 'logout?token='+token;
    console.log("[POST] url: "+url);

	xhr.open("POST", url, true);
    xhr.setRequestHeader( "Content-Type", "application/json");
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
            if (xhr.status==200){
                dispatcher.dispatch({
                    actionTypes: actionTypes.LOGOUT,
                });
            }else{
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong token",
                });
            }
    	}
	}
    xhr.send();
}

export function getUserInfo(id:number,token:string){
    var xhr = new XMLHttpRequest();
    let url = host + 'users/'+id+"?token="+token;
    console.log("[GET] url: "+url);

	xhr.open("GET", url, true);
    xhr.setRequestHeader( "Content-Type", "application/json");
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
            if (xhr.status==200){
                let info = JSON.parse(xhr.responseText);
                let user = new User(info.username,info.password,info.id,info.admin,info.profile,info.high_scores)
                dispatcher.dispatch({
                    actionTypes: actionTypes.USER_INFO,
                    user: user,
                });
            }else{
                console.log("wrong id")
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong id or token",
                });
            }
    	}
	}
    xhr.send();
}

export function updateUserInfo(user:User,token:string){
    var xhr = new XMLHttpRequest();
    let url = host + 'users/'+user.id+"?token="+token;
    let send_data = JSON.stringify(user);
    console.log("[PATCH] url: "+url+" data: "+send_data);

	xhr.open("PATCH", url, true);
    xhr.setRequestHeader( "Content-Type", "application/json");
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4) {
            if (xhr.status==200){
                getUserInfo(user.id,token)
            }else{
                dispatcher.dispatch({
                    actionTypes: actionTypes.ERROR,
                    info: "wrong token",
                });
            }
    	}
	}
    xhr.send(send_data);
}