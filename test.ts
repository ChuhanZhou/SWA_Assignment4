import system_model from './js/models/systemModel';
console.log(system_model.getUserInfo())
console.log(system_model.getToken())
system_model.login("AAA","111").then(async ()=>{
        console.log(system_model.getUserInfo())
        console.log(system_model.getToken())
        let user = system_model.getUserInfo()
        user.setProfile("test profile 1")
        console.log(await system_model.updateUserInfo(user))
        console.log(system_model.getUserInfo())
        console.log(await system_model.logout())
        console.log(system_model.getUserInfo())
    })
