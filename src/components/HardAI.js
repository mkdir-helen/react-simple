//code minmax algorithm from
// http://douglasberg.com/blog/react/tic-tac-toe/ai/minimax/algorithm/2016/08/29/react-tictactoe-part-2.html
import React, { Component } from 'react';
import '../App.css';
import Status from './Status';
import nerd from '../images/power_gamer.jpg';


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
class HardAI extends Component {
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
    let winner = this.checkMatch(winLines, this.state.board, this.state.player);
    this.setState({
      winner
    })
    this.checkTie();
    
  }
  checkMatch(winLines, newBoard, player){
    let winner = null;
    for(let index = 0; index<winLines.length; index++){
      const[a, b, c] = winLines[index];
      let board = newBoard;
      if(board[a] === player && board[b] === player && board[c] === player){
        let Array = [a, b, c];
        let winArray = Array.map((x) => {return parseInt(x)});
        winner = player;
        this.setState({
          winArray: [...winArray]
        })
      }
    } 
    // console.log(winner);
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
        }, ()=>{
          // this.checkWinner();
          // this.checkTie();
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
    let slowIndex = this.findAiMove(this.state.board); 
    let newIndex = this.getEmptySpots()[0];
    if(!this.state.winner && this.state.turn === false){
        newBoard[slowIndex] = this.state.player;
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
 



  //About to break this thing
  //new code crashing!!!!
  //////////// MINMAX ALGORITHM //////////////////

  //Test for Tie Game
  tie(board) {
    let moves = board.join('').replace(/ /g, '');
    if (moves.length === 9) {
      return true;
    }
    return false;
  }

  //Create a new version of the board to manipulate as a node on the tree
  copyBoard(board) {
    //This returns a new copy of the Board and ensures that you're only
    //manipulating the copies and not the primary board.
    return board.slice(0);
  }

  //Determine if a move is valid and return the new board state
  validMove(move, player, board) {
    let newBoard = this.copyBoard(board);
    if (newBoard[move] === null) {
      newBoard[move] = player;
      return newBoard;
    } else
      return null;
  }

  //This is the main AI function which selects the first position that
  //provides a winning result (or tie if no win possible)

  findAiMove(board) {
    let bestMoveScore = 100;
    let move = null;
    //Test Every Possible Move if the game is not already over.
    if (this.checkMatch(winLines, board, this.state.human) || this.checkMatch(winLines, board, this.state.computer || this.tie(board))) {
      return null;
    }
    for (let i = 0; i < board.length; i++) {
      let newBoard = this.validMove(i, this.state.computer, board);
      //If validMove returned a valid game board
      if (newBoard) {
        let moveScore = this.maxScore(newBoard);
        if (moveScore < bestMoveScore) {
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }

  minScore(board) {
    if (this.checkMatch(winLines, board, this.state.human)) {
      return 10;
    } else if (this.checkMatch(winLines, board, this.state.computer)) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      var bestMoveValue = 100;
      // let move = 0;
      for (let i = 0; i < board.length; i++) {
        let newBoard = this.validMove(i, this.state.computer, board);
        if (newBoard) {
          let predictedMoveValue = this.maxScore(newBoard);
          if (predictedMoveValue < bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            // move = i;
          }
        }
      }
      //console.log("Best Move Value(minScore):", bestMoveValue);
      return bestMoveValue;
    }
  }

  maxScore(board) {
    if (this.checkMatch(winLines, board, this.state.human)) {
      return 10;
    } else if (this.checkMatch(winLines, board, this.state.computer)) {
      return -10;
    } else if (this.tie(board)) {
      return 0;
    } else {
      let bestMoveValue = -100;
      // let move = 0;
      for (let i = 0; i < board.length; i++) {
        let newBoard = this.validMove(i, this.state.human, board);
        if (newBoard) {
          let predictedMoveValue = this.minScore(newBoard);
          if (predictedMoveValue > bestMoveValue) {
            bestMoveValue = predictedMoveValue;
            // move = i;
          }
        }
      }
      return bestMoveValue;
    }
  }

  ////Enough of this code//////

  setPlayer(player){
    this.setState({
      player,
      human: player,
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
        <h1>Opponent: Melvin Einstein </h1>
        <h3>"Hold on...ugh I know I got this...I need to think..."</h3>
        <Status player={this.state.player} 
        setPlayer={(e)=>(this.setPlayer(e))}
        winner={this.state.winner}
        tie={this.state.tie}
        />
        <div className="board">
          {this.renderBoxes()}
          <img className="nerd" src={nerd} alt=""/>
        </div>
        <button disabled={!this.state.winner && this.state.tie === false} 
        onClick={()=> this.reset()}
        className="reset">Reset</button>
      </div>
    );
  }
}

export default HardAI;