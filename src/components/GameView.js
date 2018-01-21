import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Puzzle from './Puzzle';
import GameUi from './GameUi';
import {getRandom} from "../libs/utils";

class GameView extends Component {


    constructor() {

        super();

        this.state = {
            puzzleSrc:null,
            puzzleWidth:null,
            puzzleHeight:null,
            puzzleSize:4
        };

        this.solving = false;
        this.imageRef = null;
    }

    startUp = (start) => {
        if(start) this.setNewPuzzle()
    };

    setImageRef = (img) => {

        this.imageRef = img;

    };

    imageReady = () => {

        //get image size
        let w = this.imageRef.naturalWidth;
        let h = this.imageRef.naturalHeight;

        this.setState((state,props) => {
            return {
                imgWidth:w,
                imgHeight:h,
            }
        })

    };

    setNewPuzzle = () => {
        let nextSrc = this.props.puzzleImages[getRandom(0,this.props.puzzleImages.length - 1)];

        this.setState((prevState,props) => ({
            puzzleSrc:nextSrc,
            newPuzzle:true,
            width:null,
            height:null,
        }))
    };

    handleHintBtn = () => {
        if(this.state.solving) return;
        this.setState((prevState,props) => ({
            nextMove:true
        }))

    };

    handleSolveBtn = () => {
        //solving
        this.setState((prevState,props) => ({
            solving:true
        }))

    };


    handleNewBtn = () => {
        if(this.state.solving) return;
        this.setNewPuzzle();

    };

    handleSizeBtn = () => {
        if(this.state.solving) return;
        //current size 3/4
        let newSize = (this.state.puzzleSize === 3) ? 4 : 3;
        this.setState((prevState,props) => ({
            puzzleSize:newSize,
            newPuzzle:true
        }))

    };

    puzzleUpdateComplete= () => {
        this.setState((prevState,props) => ({
            newPuzzle:false,
            nextMove:false,
            solving:false
        }))
    };


    render() {
        const toggleSize = (this.state.puzzleSize === 3) ? 4 : 3;
        const {puzzleSize, puzzleSrc, newPuzzle, nextMove, solving, imgWidth, imgHeight} = this.state;
        let {viewWidth, viewHeight } = this.props;
        if(!puzzleSrc){
            return (
                <div
                    ref={this.startUp}
                >

                </div>
            )

        }else if(!imgWidth){//if current image is not yet loaded?
           //set width on image load
           return (
               <img
                   src={puzzleSrc}
                   ref={this.setImageRef}
                   onLoad={this.imageReady}
               />

           )

       }else{
            //fit to view smaller side
            const orientation = (Math.min(viewWidth, viewHeight) === viewHeight) ? "landscape" : "portrait";
            if(viewWidth > 1024) viewWidth = 1024;
            let puzzleScale = 1;
            let gameAreaWidth = viewWidth;
            let gameAreaHeight = (orientation === "landscape" && this.state.imgHeight < viewHeight)  ? this.state.imgHeight : viewHeight;
            let puzzleAreaWidth = (orientation === "landscape") ? gameAreaWidth - (gameAreaWidth * 0.15) :  gameAreaWidth;
            let puzzleAreaHeight = (orientation === "landscape") ? gameAreaHeight : gameAreaHeight - (gameAreaHeight * 0.2);

            if(orientation === "landscape"){

                const scaleForHeight = puzzleAreaHeight/this.state.imgHeight;
                puzzleScale = scaleForHeight;
                if(this.state.imgWidth * scaleForHeight > puzzleAreaWidth){
                    puzzleScale = puzzleScale * puzzleAreaWidth/(this.state.imgWidth * scaleForHeight);
                }

            }else {
                const scaleForWidth = puzzleAreaWidth/this.state.imgWidth;
                puzzleScale = scaleForWidth;
                if(this.state.imgHeight * scaleForWidth > puzzleAreaHeight){
                    puzzleScale = puzzleScale * puzzleAreaHeight/(this.state.imgHeight * scaleForWidth);
                }
            }



            const leftpos = (puzzleAreaWidth - (imgWidth * puzzleScale))/2;
            const leftpercent = (leftpos/puzzleAreaWidth) * 100;
            const toppos = (puzzleAreaHeight - (imgHeight * puzzleScale))/2;
            const toppercent = (toppos/puzzleAreaHeight) * 100;

            const gridStyle = {


                transform:`scale(${puzzleScale})`,
                left:`${leftpercent}%`,
                top:`${toppercent}%`


            };

            const gamecontainerstyle = {


                width:`${gameAreaWidth}px`,
                height:`${gameAreaHeight}px`

            };


            const containerstyle = {

                width:`${puzzleAreaWidth}px`,
                height:`${puzzleAreaHeight}px`

            };


            const uiwidth = (orientation === "landscape") ? gameAreaWidth - puzzleAreaWidth :  puzzleAreaWidth;
            const uiheight = (orientation === "landscape") ?  puzzleAreaHeight: gameAreaHeight - puzzleAreaHeight;


            const uistyle = {
                width:`${uiwidth}px`,
                height:`${uiheight}px`,
            };

            const btnwidth = (orientation === "landscape") ? uiwidth : uiwidth * 0.25;
            const btnheight = (orientation === "landscape") ? uiheight * 0.25 : uiheight;
            const buttonstyle = {
                width:`${btnwidth}px`,
                height:`${btnheight}px`
            };




           return (
               //pass move counter function
               <div className="game-area"  >
                   <div className="game-container" ref="container" style={gamecontainerstyle}>
                       <Puzzle rowsize={puzzleSize} src={puzzleSrc} width={imgWidth} height={imgHeight} new={newPuzzle} forceMove={nextMove} isSolving={solving} afterUpdate={this.puzzleUpdateComplete} puzzlescale={puzzleScale} gridStyle={gridStyle} containerStyle={containerstyle} containerRef={this.refs.container}/>
                       <GameUi hintClick={this.handleHintBtn} solveClick={this.handleSolveBtn} newClick={this.handleNewBtn} sizeClick={this.handleSizeBtn} otherSize={toggleSize} navStyle={uistyle} buttonStyle={buttonstyle}/>
                   </div>
               </div>

           );
       }

    }

}


GameView.propTypes = {
    puzzleImages:PropTypes.array.isRequired
};

export default GameView;