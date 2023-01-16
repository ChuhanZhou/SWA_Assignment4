import * as React from 'react'

import { User } from '../models/domain/user';
import { render } from 'react-dom'
import {Link,useLocation} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Score } from '../models/domain/score';
import View from "./login";
import Gameboard from "./game";
import * as ReactDOM from 'react-dom'
import home_viewmodel from '../viewmodel/homeViewModel'


var OldPassword = undefined;
var NewPassword = undefined;
var error = undefined;
var textarea = undefined;

export class ShowHome extends React.Component<{},{username:string,password:string,profile:string,scores:Score[],Profiledispaly:string, passdispaly:string}> {
  constructor(props){
    super(props)
    this.state = {
      username:"",
      password:"",
      profile :"",
      scores:[],
      Profiledispaly: 'none',
      passdispaly: 'none'
    }
  }

  componentDidMount(){
    OldPassword = document.getElementById('oldP') as HTMLInputElement;
    NewPassword = document.getElementById('newP') as HTMLInputElement;
    error = document.getElementById('errorP') as HTMLLabelElement;
    textarea = document.getElementById('textarea') as HTMLTextAreaElement;
    home_viewmodel.oldPassword.bind(OldPassword,"value")
    home_viewmodel.newPassword.bind(NewPassword,"value")
    home_viewmodel.error.bind(error,"textContent")
    home_viewmodel.textarea.bind(textarea,"textContent")
    home_viewmodel.username.bind(this.state,"username",(v:string)=>{this.setState({username:v})})
    home_viewmodel.password.bind(this.state,"password",(v:string)=>{this.setState({password:v})})
    home_viewmodel.profile.bind(this.state,"profile",(v:string)=>{this.setState({profile:v})})
    home_viewmodel.score.bind(this.state,"scores",(v:Score[])=>{this.setState({scores:v})})
  }

  startGame(){
    ReactDOM.render(<Gameboard/>, document.getElementById('root'));
  }

  toChangePro(){
    this.setState({
      Profiledispaly : 'block'
    })
  }

  toChangePa(){
    this.setState({
      passdispaly : 'block'
    })
  }

  async changeP(){
    if(await home_viewmodel.changePassword()){
      this.setState({
        passdispaly : 'none'
      })
    }  
  }

  async changePro(){
    if(await home_viewmodel.updateProfile()){
      this.setState({
        Profiledispaly : 'none'
      })
    }
  }

  getScores=home_viewmodel.getUser().getHighScores().map((value:Score,index:number)=>{
    return (<tr>
      <td>{value.score}</td>
      <td>{value.create_time}</td>
  </tr>)
  })
    

  render() {return (
  <div className='userIn'>
    <div>Hi! {this.state.username}</div>
    <div>Description : {this.state.profile}</div>

    <textarea id='textarea' style={{display:this.state.Profiledispaly}} onChange={e => {home_viewmodel.textarea.bindChange(e.target.value)}}></textarea>
    <button type='button' style={{display:this.state.Profiledispaly}} onClick={()=>this.changePro()}>save</button>

    <div>Scores : </div>
    <div><table>
      <thead>
        <tr><th>Scrore</th><th>Datetime</th></tr>
      </thead>
            <tbody>
                {this.state.scores.map((value:Score,index:number)=>{
      return (<tr key={index}>
        <td>{value.score}</td>
        <td>{value.getCreateTime().toLocaleDateString()}</td>
        <td>{value.getCreateTime().toLocaleTimeString()}</td>
    </tr>)
    })}
            </tbody>
        </table></div>
    <button type='button' onClick={()=>this.toChangePro()}>EditDescription</button>
    <button type='button' onClick={()=>this.toChangePa()}>Change password</button>

    <div style={{display:this.state.passdispaly}}>Old password : </div><input id='oldP' style={{display:this.state.passdispaly}} onChange={e => {home_viewmodel.oldPassword.bindChange(e.target.value)}}></input>
    <div style={{display:this.state.passdispaly}}>New password : </div><input id='newP' style={{display:this.state.passdispaly}} onChange={e => {home_viewmodel.newPassword.bindChange(e.target.value)}}></input>
    <label id='errorP' style={{color:'red'}}></label>    
    <button type='button' style={{display:this.state.passdispaly}} onClick={()=>this.changeP()}>save</button>

    <button type='button' onClick={()=>logout()}>Logout</button>
    <br/>
    <button type='button' onClick={()=>this.startGame()}>Start Game</button>
  </div>)
  }
    
    
}

async function logout()
{
  if(await home_viewmodel.logout()){
    ReactDOM.render(<View/>, document.getElementById('root'));
  }
}

function Home() {
  return (<ShowHome/>)
}
  
export default Home;


