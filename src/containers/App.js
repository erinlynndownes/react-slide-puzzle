import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../App.css';
import GameView from '../components/GameView'

import { resizeGame, addImages, setDefaultImage } from '../actionCreators'

class App extends Component {

    constructor(props){
        super(props);

        this.images = importAll(require.context('../images/puzzles', false, /\.(png|jpe?g|svg)$/));

        //add images to store

        //set puzzlearea to new image area??

        this.sizeGame = this.sizeGame.bind(this);
        this.resizeThrottle = this.resizeThrottle.bind(this);
        this.throttled = false;
        this.timeout = false;

    }

    sizeGame() {

        const { dispatch } = this.props;
        dispatch( resizeGame({ w:window.innerWidth, h:window.innerHeight }) )

    }

    resizeThrottle() {

        if(!this.throttled) this.sizeGame();
        this.throttled = true;
        const ref = this;
        setTimeout(() => {
            ref.throttled = false;
        },300);

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.sizeGame, 300);

    }

    componentDidMount() {

        const { dispatch } = this.props;
        dispatch( addImages(this.images) );
        //images[ images['allKeys'][index] ]
        dispatch( setDefaultImage(this.images[ this.images['allKeys'][0] ]));

        this.sizeGame();

        window.addEventListener("resize", this.resizeThrottle.bind(this));
        window.addEventListener("gesturestart", prevent);
        window.addEventListener("touchmove", prevent);

    }

    componentWillUnmount() {
        window.removeEventListener("gesturestart", prevent);
        window.removeEventListener("touchmove", prevent);
        window.removeEventListener("resize", this.resizeThrottle.bind(this));
    }

    render() {
        const {viewArea, puzzleArea, isSolving} = this.props;
        return (
            <GameView viewArea={ viewArea } puzzleArea={ puzzleArea } isSolving={ isSolving }/>
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

const mapStateToProps = (state) => {

    return {
        isSolving: state.isSolving,
        viewArea: state.viewArea,
        puzzleArea: state.puzzleArea

    }
};



export default connect(mapStateToProps)(App);
