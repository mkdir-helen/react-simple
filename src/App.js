import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Status from './components/Status';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      board: Array(9).fill(null),
      player: null,
      winner: null,
      winArray: [],
      tie: false,
      turn: true,
      human: null,
      computer: null
    }
  }

  checkWinner(){
    let winLines = 
    [
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7","8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", '8'],
      ['0', '4','8'],
      ['2', '4', '6']
    ]
    let winner = this.checkMatch(winLines);
    this.setState({
      winner
    })
    this.checkTie();
    
  }
  checkMatch(winLines){
    let winner = '';
    for(let index = 0; index<winLines.length; index++){
      const[a, b, c] = winLines[index];
      let board = this.state.board;
      if(board[a] && board[a] === board[b] && board[a] === board[c]){
        let Array = [a, b, c];
        let winArray = Array.map((x) => {return parseInt(x)});
        console.log(winArray);
        winner = this.state.player;
        this.setState({
          winArray: [...winArray]
        })
      }
    }
    return winner;    
  }

  checkTie(){
    if(this.state.winner === null && !this.state.board.includes(null)){
      this.setState({
        tie: true
      })
    }
  }
  
  handleClick(index){
    if(this.state.player && !this.state.winner && this.state.turn === true ){
      let newBoard = this.state.board;
      if(this.state.board[index] === null ){
        newBoard[index] = this.state.player;
        this.setState({
          board: newBoard,
          player: this.state.player === "X" ? "O" : "X",
          turn: false
        })
        this.checkWinner();
        this.checkTie();
        
        setTimeout(()=>this.computerTurn(), 1000);
        
      }
    }
  }

  getEmptySpots(){
    let array = [];
    for(let i=0; i<this.state.board.length; i++){
      if(this.state.board[i] === null){
        array.push(i);
      }
    }
    return array;
  }

  randomize(array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
    }
    return rand;
}

  computerTurn(){
    let newBoard = this.state.board;
    let randomIndex = this.getEmptySpots()[this.randomize(this.getEmptySpots())];
    console.log(randomIndex);
    let newIndex = this.getEmptySpots()[0];
    if(!this.state.winner && this.state.turn === false){
      newBoard[randomIndex] = this.state.player;
      this.setState({
        board: newBoard
      })
      this.checkWinner();
      this.checkTie();
    }  
    this.setState({
      player: this.state.player === "O" ? "X" : "O",
      turn: true
    })
  }

  minmax(newBoard, player){
    let availIndexArray = this.getEmptySpots();


  }
 

  setPlayer(player){
    this.setState({
      player,
      human:player,
      computer: player === "O" ? "X" : "O"
    })
  }

  reset(){
    this.setState({
      player: null,
      winner: null,
      board: Array(9).fill(null),
      winArray: [],
      tie: false,
      turn: true,
      computer: null,
      human: null
    })
  }
  renderBoxes(){
    return this.state.board.map(
      (box, index) => 
      <div className="box" key={index} 
        onClick={() => this.handleClick(index)}>
        {box}
      </div>
      )
  }

  
  render() {
    
    return (
      <div className="container">
        <h1>Tic Tac Toe App</h1>
        <Status player={this.state.player} 
        setPlayer={(e)=>(this.setPlayer(e))}
        winner={this.state.winner}
        tie={this.state.tie}
        />
        <div className="board">
          {this.renderBoxes()}
        </div>
        <button disabled={!this.state.winner && this.state.tie === false} 
        onClick={()=> this.reset()}
        className="reset">Reset</button>
      </div>
    );
  }
}

export default App;
