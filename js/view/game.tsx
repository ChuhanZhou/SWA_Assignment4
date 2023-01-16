import * as React from 'react'


import { Position, BoardListener,Piece,Board } from '../models/domain/board';
import {Game} from '../models/domain/game'
import Home from "./home";
import * as ReactDOM from 'react-dom'
import game_viewmodel from '../viewmodel/gameViewModel'

var itemsSelected: Array<Position>;
export class GameBoard extends React.Component<{},{pieceList:Piece<string>[][],steps:number,points:number,rank:Array<Game>,showgame:string,showrank:string}> {
    constructor(props) {
      super(props)
        game_viewmodel.initGame()
        itemsSelected =[]

       this.state = {
         pieceList: game_viewmodel.getPieceList(),
         steps: game_viewmodel.getOutsteps(),
         points: game_viewmodel.getPoint(),
         rank : [],
         showgame: 'block',
         showrank: 'none'
       };

}    

componentDidMount(){
    game_viewmodel.resultScore.bind(this.state,"resultScores",(v:number)=>{this.setState({points:v})})
    game_viewmodel.rank.bind(this.state,"rank",(v:Game[])=>{this.setState({rank:v})})
  }

  async clickItem(position:Position){
            if(this.state.steps<=0)
            {
                game_viewmodel.getGameArray()
                this.setState({
                    showgame: 'none',
                    showrank:'block',
                })
                await game_viewmodel.postGameData()
                await game_viewmodel.updateUser()
            }
        else{
            if(itemsSelected.length==1)
                {
                    game_viewmodel.getBoard().play(itemsSelected[0],position)
                    itemsSelected =[]
                    this.setState({
                        pieceList: game_viewmodel.getBoard().getGameBoard().piece_list,
                        points : game_viewmodel.getBoard().getPoints(),
                        steps : game_viewmodel.getBoard().getOut_steps(),
                        
                    })
        
                }
            else{
                itemsSelected.push(position)
                this.setState({
                    points : game_viewmodel.getBoard().getPoints(),
                    steps : game_viewmodel.getBoard().getOut_steps()
                })
          }

        }
    }
        
        back(){
            ReactDOM.render(<Home/>, document.getElementById('root'));
        }

      render() {
        return (
            <div>
                <div className='game' style={{display:this.state.showgame}}>
            <div>Steps left:  {this.state.steps}</div>
            <div>Total Score: {this.state.points}</div>
          <div className='board' style={{width:'550px',height:'550px', position:'absolute',backgroundColor: 'antiquewhite',marginLeft:'400px',marginTop:'100px'}}>
          {this.state.pieceList.map((pieces,index) => {
                return pieces.map((piece,j)=>{
                    var idt = 'borad-item'+piece.getPosition().getRow()+piece.getPosition().getCol()
                    return (<button style={{float: 'left',
                        width:'100px',
                        height:'100px',
                        backgroundColor:'rgb(229, 229, 229)',
                        textAlign:'center',
                        lineHeight:'100px',
                        border:'1px solid #fff'}} key={j} className='board-item' id={idt} onClick={()=>this.clickItem(piece.getPosition())}>{piece.type}</button>)
        })       
        })}
          </div>
          
          </div>
          <div className='rank' style={{display:this.state.showrank}}>
            <div>Congratulations! your score is {this.state.points}</div>
            <br/>
            <div>Top 10 RANK</div>
          <table>
          <thead>
        <tr><th>Id</th><th>Score</th></tr>
      </thead>
            <tbody> 
            {this.state.rank.map((games,index) => {
                return (<tr key={index}>
                    <td>{games.getId()}</td>
                    <td>{games.getScore()}</td>
                </tr>)      
        })}</tbody>
        </table>
        <button onClick={()=>this.back()}>BACK</button>
        </div>
          </div>
        )
    } 
}


function Gameboard() {
    return (<GameBoard/>)
  }
  
  export default Gameboard;