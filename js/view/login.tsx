import * as React from 'react'
import login_viewmodel from '../viewmodel/loginViewModel'
import * as ReactDOM from 'react-dom'
import Home from "./home";

var username = undefined;
var password = undefined;
var error = undefined;

class UserLoginAndRegister extends React.Component{
  constructor(props:any){
    super(props)
  }

  componentDidMount(){
    username = document.getElementById('username') as HTMLInputElement;
    password = document.getElementById('password') as HTMLInputElement;
    error = document.getElementById('errorRL') as HTMLLabelElement;
    login_viewmodel.username.bind(username,"value")
    login_viewmodel.password.bind(password,"value")
    login_viewmodel.error.bind(error,"textContent")
  }

  render() {
    return (
    <form className='loginForm'>
      <div>Username : </div><input id='username' onChange={e => {login_viewmodel.username.bindChange(e.target.value)}}></input>
      <div>Password : </div><input id='password' onChange={e => {login_viewmodel.password.bindChange(e.target.value)}}></input>
      <label id='errorRL' style={{color:'red'}}></label>    
      <button type='button' id='btnL' onClick={()=>loginUser()}>Login</button>
      <button type='button' id='btnR' onClick={()=>registerUser()}>Register</button>
    </form>
  )}  
}

async function loginUser(){
  if(await login_viewmodel.login()){
    ReactDOM.render(<Home/>, document.getElementById('root'));
  }
}

async function registerUser(){
  if(await login_viewmodel.register()){
    ReactDOM.render(<Home/>, document.getElementById('root'));
  }
}

function LoginView() {
  return <UserLoginAndRegister/>
}

export default LoginView;