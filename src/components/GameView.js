import React, { Component } from 'react';
import Puzzle from './Puzzle';
import GameUi from './GameUi';
import {getRandom} from "../libs/utils";
import Sidebar from './Sidebar';

class GameView extends Component {


    constructor() {

        super();

        this.state = {
            puzzleSrc:null,
            puzzleWidth:null,
            puzzleHeight:null,
            puzzleSize:4,
            puzzleType:'numbers',
            numMoves: 0
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
        let nextSrc = this.props.puzzleImages[this.props.puzzleImages['allKeys'][getRandom(0,this.props.puzzleImages['allKeys'].length - 1)]];

        this.setState((prevState,props) => ({
            puzzleSrc:nextSrc,
            newPuzzle:true,
            width:null,
            height:null,
            imgWidth:768,
            imgHeight:768,
            numMoves:0
        }))
    };

    handleSolveBtn = () => {
        //solving
        this.setState((prevState,props) => ({
            solving:true
        }))

    };

    handleSolveComplete = () => {
        this.setState((prevState,props) => ({
            solving:false
        }))

    }

    handleImageBtn = () => {

        if(this.state.solving) return;
        let newType = (this.state.puzzleType === 'image') ? 'numbers' : 'image';
        this.setState((prevState,props) => ({
            puzzleType:newType,
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
        const toggleImage = (this.state.puzzleType === "image") ? "Numbers" : "Image";
        const {puzzleSize, puzzleSrc, puzzleType, newPuzzle, nextMove, solving, imgWidth, imgHeight} = this.state;

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
               <img className="placeholder" alt="guideimage"
                   src={puzzleSrc}
                   ref={this.setImageRef}
                   onLoad={this.imageReady}
               />

           )

       }else{
            //fit to view smaller side
            const orientation = (Math.min(viewWidth, viewHeight) === viewHeight) ? "landscape" : "portrait";
            let puzzleScale = 1;
            let gameAreaWidth = viewWidth;
            let gameAreaHeight = (orientation === "landscape" && this.state.imgHeight < viewHeight)  ? this.state.imgHeight : viewHeight;
            if(gameAreaWidth > 1024) {

                gameAreaWidth = 700;
                gameAreaHeight = 600;
            }


            let puzzleAreaWidth = gameAreaWidth;
            let puzzleAreaHeight = gameAreaHeight;

            if(orientation === "landscape"){

                const scaleForHeight = gameAreaHeight/this.state.imgHeight;
                puzzleScale = scaleForHeight;
                if((this.state.imgWidth) * scaleForHeight > gameAreaWidth - 310){
                    puzzleScale = puzzleScale * (gameAreaWidth - 310)/(this.state.imgWidth * scaleForHeight);
                }

                puzzleAreaWidth = (this.state.imgWidth * puzzleScale);
                gameAreaWidth = Math.min(puzzleAreaWidth + 330, viewWidth);
            }else {

                gameAreaHeight = viewHeight;
                //puzzleAreaHeight = gameAreaHeight;
                const scaleForWidth = (puzzleAreaWidth)/(this.state.imgWidth + 30);
                puzzleScale = scaleForWidth;
                if(this.state.imgHeight * scaleForWidth > gameAreaHeight - 260){
                    puzzleScale = puzzleScale * (gameAreaHeight - 260)/(this.state.imgHeight * scaleForWidth);
                }

                puzzleAreaHeight = (this.state.imgHeight * puzzleScale);
                gameAreaHeight = Math.min(puzzleAreaHeight + 330, viewHeight);
            }

            const leftpos = (orientation === "landscape") ? (puzzleAreaWidth - (imgWidth * puzzleScale))/2: (puzzleAreaWidth - (imgWidth * puzzleScale))/2 - 15;//2 for border width
            const leftpercent = (leftpos/puzzleAreaWidth) * 100;
            const toppos = (orientation === "landscape") ? (puzzleAreaHeight - (imgHeight * puzzleScale))/2 - 15: (puzzleAreaHeight - (imgHeight * puzzleScale))/2;
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

            const uiwidth = (orientation === "landscape") ? 100:  puzzleAreaWidth;
            const uiheight = (orientation === "landscape") ?  puzzleAreaHeight: 100;

            const uistyle = {
                width:`${uiwidth}px`,
                height:`${uiheight}px`,
            };

            const btnwidth = (orientation === "landscape") ? uiwidth : uiwidth * 0.25;
            const btnheight = (orientation === "landscape") ? uiheight * 0.25 : uiheight;
            const buttonstyle = {
                width:`${btnwidth}px`,
                height:`${btnheight}px`,
                textAlign:`center`
            };

            if(viewWidth > 1024){

                return (
                    //pass move counter function
                    <div className="wholepage">
                        <h1 className="pagetitle"> React 15-puzzle </h1>
                        <div className="game-area"  >
                            <div className="game-container" ref="container" style={gamecontainerstyle}>
                                <GameUi imageClick={this.handleImageBtn} solveClick={this.handleSolveBtn} newClick={this.handleNewBtn} sizeClick={this.handleSizeBtn} otherSize={toggleSize} otherType={toggleImage} navStyle={uistyle} buttonStyle={buttonstyle}/>
                                <Puzzle displayType={puzzleType} rowsize={puzzleSize} src={puzzleSrc} width={imgWidth} height={imgHeight} new={newPuzzle} forceMove={nextMove} isSolving={solving} afterUpdate={this.puzzleUpdateComplete} puzzleScale={puzzleScale} gridStyle={gridStyle} containerStyle={containerstyle} containerRef={this.refs.container} solveComplete={this.handleSolveComplete}/>
                                <Sidebar solving={this.state.solving}/>
                            </div>
                        </div>
                        <div className="writeup">
                            <p className="pagedescription">A classic 8 or 15 puzzle that I built with React that has interactive sliding tiles. The ai solver uses the <a href="https://en.wikipedia.org/wiki/Fringe_search">fringe search </a>algorithm and manhattan distance heuristic, which is sufficient for the 8 piece puzzle. For the 15 piece a non-optimal but short solution is found by breaking up the problem and stringing together those solutions, an idea based on <a href="https://pdfs.semanticscholar.org/21be/9f73ab7afb7991b8cfbdaf96e4124a0bec89.pdf">this</a> paper by Ian Parberry.</p>
                            <p className="pagedescription">While most configurations of the 15 puzzle are solved within a few seconds, the hardest can take up from 30 to 50 seconds. For this reason the solution is carried out in a web worker so the browser doesn't lock up. This puzzle works great on mobile devices due to the responsive design of the layout and memory efficient ai.</p>

                        </div>
                    </div>
                );
            }else{
                return (
                    //pass move counter function
                    <div className="game-area"  >
                        <div className="game-container" ref="container" style={gamecontainerstyle}>
                            <GameUi imageClick={this.handleImageBtn} solveClick={this.handleSolveBtn} newClick={this.handleNewBtn} sizeClick={this.handleSizeBtn} otherSize={toggleSize} otherType={toggleImage} navStyle={uistyle} buttonStyle={buttonstyle}/>
                            <Puzzle displayType={puzzleType} rowsize={puzzleSize} src={puzzleSrc} width={imgWidth} height={imgHeight} new={newPuzzle} forceMove={nextMove} isSolving={solving} afterUpdate={this.puzzleUpdateComplete} puzzleScale={puzzleScale} gridStyle={gridStyle} containerStyle={containerstyle} containerRef={this.refs.container} solveComplete={this.handleSolveComplete}/>
                            <Sidebar solving={this.state.solving}/>
                        </div>
                    </div>

                );

            }


       }
    }
}


export default GameView;