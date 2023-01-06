import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import actionTypes from "../actions/actionTypes";
import { User } from '../models/user';

const event_type = {
    ERROR:"ERROR",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    USER_INFO: "USER_INFO",
};
let user = new User("","");
let token = "";
let error_info = "";

class UserStore extends EventEmitter {
    addLoginListener(callback:any) {
        this.on(event_type.LOGIN, callback);
    }

    removeLoginListener(callback:any) {
        this.removeListener(event_type.LOGIN, callback);
    }

    addLogoutListener(callback:any) {
        this.on(event_type.LOGOUT, callback);
    }

    removeLogoutListener(callback:any) {
        this.removeListener(event_type.LOGOUT, callback);
    }

    addUserInfoListener(callback:any) {
        this.on(event_type.USER_INFO, callback);
    }

    removeUserInfoListener(callback:any) {
        this.removeListener(event_type.USER_INFO, callback);
    }

    addErrorListener(callback:any) {
        this.on(event_type.ERROR, callback);
    }

    removeErrorListener(callback:any) {
        this.removeListener(event_type.ERROR, callback);
    }

    emitChange(type:string) {
        this.emit(type);
    }

    getUser():User {
        return user.copy();
    }

    getToken():string {
        return token;
    }

    getError():string {
        return error_info;
    }
}

const user_store = new UserStore();

dispatcher.register((action:any) => {
    switch (action.actionTypes) {
        case actionTypes.LOGIN:
            token = action.token;
            user.id = action.id;
            user_store.emitChange(event_type.LOGIN);
            break;
        case actionTypes.LOGOUT:
            token = "";
            user = new User("","");
            user_store.emitChange(event_type.LOGOUT);
            break;
        case actionTypes.USER_INFO:
            user = action.user;
            user_store.emitChange(event_type.USER_INFO);
            break;
        case actionTypes.ERROR:
            error_info = action.info;
            user_store.emitChange(event_type.ERROR);
            break;
        default:
            break;
    }
});

export default user_store;