import React, { Component } from 'react';
import './App.css';
import GameView from './components/GameView';

import testImage from './images/huxley.jpg';

class App extends Component {

    constructor(){
        super();

        this.state = {
            touch:false,
            width:window.innerWidth,
            height:window.innerHeight
        }

    }

    sizeGame(){

        this.setState({
            width:window.innerWidth,
            height:window.innerHeight
        })

    }


    componentDidMount() {
        this.sizeGame();
        window.addEventListener("resize", this.sizeGame.bind(this));
        window.addEventListener("gesturestart", prevent);
        window.addEventListener("touchmove", prevent);

    }

    componentWillUnmount() {
        window.removeEventListener("gesturestart", prevent);
        window.removeEventListener("touchmove", prevent);
        window.removeEventListener("resize", this.sizeGame.bind(this));
    }



    render() {
        const {width, height} = this.state;
        return (
            <GameView puzzleImages={puzzleImages} viewWidth={width} viewHeight={height} touchEnabled={this.state.touch}/>
        );
  }
}

function prevent(e){
    e.preventDefault();
    e.stopPropagation();
}

const puzzleImages = [
    testImage
];



export default App;
