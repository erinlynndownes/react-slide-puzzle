import React, { Component } from 'react';
import './App.css';
import GameView from './components/GameView';

//import testImage from './images/huxley.jpg';

class App extends Component {

    constructor(){
        super();

        const images = importAll(require.context('./images/puzzles', false, /\.(png|jpe?g|svg)$/));
        console.log('images? ' + images);
        console.dir(images);
        this.state = {
            images: images,
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
        const {width, height, images} = this.state;
        return (
            <GameView puzzleImages={images} viewWidth={width} viewHeight={height} touchEnabled={this.state.touch}/>
        );
  }
}

const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const importAll = (r) => {
    let images = {};
    images['allKeys'] = [];
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item);
                                    images['allKeys'].push(item.replace('./', '')
                                    );

                                    return true;
    });
    return images;
};



export default App;
