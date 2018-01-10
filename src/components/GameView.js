import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Puzzle from './Puzzle';
import GameUi from './GameUi';
import {getRandom} from "../libs/eldUtils";

class GameView extends Component {

    //puzzle
    //ui - btns (new puzzle, 3/4), solve, hint?
    //moves counter, clear with new puzzle

    constructor() {

        super();

        this.state = {
            puzzleSrc:null,
            puzzleWidth:null,
            puzzleHeight:null,
            puzzleSize:3
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
        //crop?
        //resize?

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
            let puzzleAreaWidth = (orientation === "landscape") ? viewWidth - (viewWidth * 0.15) : viewWidth;
            let puzzleAreaHeight = (orientation === "landscape") ? viewHeight : viewHeight - (viewHeight * 0.2);
            const maxHeight = (puzzleAreaHeight > this.state.imgHeight) ? this.state.imgHeight : puzzleAreaHeight;
            const maxWidth = (puzzleAreaWidth > this.state.imgWidth) ? this.state.imgWidth : puzzleAreaWidth;



            if(orientation === "landscape"){

                const scaleForHeight = maxHeight/this.state.imgHeight;
                puzzleScale = scaleForHeight;
                if(this.state.imgWidth * scaleForHeight > puzzleAreaWidth){
                    console.log('no room landscape');
                    puzzleScale = puzzleScale * puzzleAreaWidth/(this.state.imgWidth * scaleForHeight);
                }

            }else {
                const scaleForWidth = maxWidth/this.state.imgWidth;
                puzzleScale = scaleForWidth;
                if(this.state.imgHeight * scaleForWidth > puzzleAreaHeight){
                    console.log("no room portrait");
                    puzzleScale = puzzleScale * puzzleAreaHeight/(this.state.imgHeight * scaleForWidth);
                }
            }



            console.log('puzzle scale: ' + puzzleScale);


            const containerstyle = {

                width:`${puzzleAreaWidth}px`,
                height:`${puzzleAreaHeight}px`

            };


            const uiwidth = (orientation === "landscape") ? viewWidth - puzzleAreaWidth : viewWidth;
            const uiheight = (orientation === "landscape") ? viewHeight : viewHeight - puzzleAreaHeight;
            const color = "#000";

            const uistyle = {
                width:`${uiwidth}px`,
                height:`${uiheight}px`
            };

            const btnwidth = (orientation === "landscape") ? uiwidth : viewWidth * 0.25;
            const btnheight = (orientation === "landscape") ? viewHeight * 0.25 : uiheight;
            const buttonstyle = {
                width:`${btnwidth}px`,
                height:`${btnheight}px`
            }


           return (
               //pass move counter function
               <div className="game-area"  >
                   <div className="game-container" ref="container">
                       <Puzzle rowsize={puzzleSize} src={puzzleSrc} width={imgWidth} height={imgHeight} new={newPuzzle} forceMove={nextMove} isSolving={solving} afterUpdate={this.puzzleUpdateComplete} puzzlescale={puzzleScale} puzzleAreaWidth={puzzleAreaWidth} puzzleAreaHeight={puzzleAreaHeight} containerStyle={containerstyle} containerRef={this.refs.container} touchEnabled={this.props.touchEnabled}/>
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