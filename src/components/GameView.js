import React, { Component } from 'react'
import UI from '../containers/UI'
import Sidebar from './Sidebar'
import Puzzle from '../containers/Puzzle'

const GameView = ({ viewArea, puzzleArea, isSolving  }) => {

    const orientation = (Math.min(viewArea.w, viewArea.h) === viewArea.h) ? "landscape" : "portrait";
    console.log(" puzzle area? " + puzzleArea.w);

    let puzzleScale = 1;

    let availableGameWidth = viewArea.w;
    let availableGameHeight = (orientation === "landscape" && puzzleArea.h < viewArea.h)  ? puzzleArea.h : viewArea.h;
    if(availableGameWidth > 1024) {

        availableGameWidth = 700;
        availableGameHeight = 600;
    }

    let availablePuzzleWidth = availableGameWidth;
    let availablePuzzleHeight = availableGameHeight;
    if(orientation === "landscape") {

        const scaleForHeight = availableGameHeight/puzzleArea.h;
        puzzleScale = scaleForHeight;
        if(( puzzleArea.w ) * scaleForHeight > availableGameWidth - 310) {

            puzzleScale = puzzleScale * ( availableGameWidth - 310 )/( puzzleArea.w * scaleForHeight );
        }

        availablePuzzleWidth = ( puzzleArea.w * puzzleScale );
        availableGameWidth = Math.min( availablePuzzleWidth + 330, viewArea.w );

    } else {

        availableGameHeight = viewArea.h;
        const scaleForWidth = availablePuzzleWidth/( puzzleArea.w + 30 );
        puzzleScale = scaleForWidth;
        if(puzzleArea.h * scaleForWidth > availableGameHeight - 260) {

            puzzleScale = puzzleScale * ( availableGameHeight - 260 )/( puzzleArea.h * scaleForWidth );
        }

        availablePuzzleHeight = ( puzzleArea.h * puzzleScale );
        availableGameHeight = Math.min( availablePuzzleHeight + 330, viewArea.h );
    }

    const leftpos = (orientation === "landscape") ? ( availablePuzzleWidth - ( puzzleArea.w * puzzleScale ) )/2: ( availablePuzzleWidth - (puzzleArea.w * puzzleScale) )/2 - 15;//2 for border width
    const leftpercent = (leftpos/availableGameWidth) * 100;

    console.log(" left percent? " + leftpercent + ", left pos: " + leftpos + ", available puzzle width: " + availablePuzzleWidth + ", available game width: " + availableGameWidth);
    const toppos = (orientation === "landscape") ? ( availablePuzzleHeight - ( puzzleArea.h * puzzleScale ) )/2 - 15: ( availablePuzzleHeight - (puzzleArea.h * puzzleScale) )/2;
    const toppercent = (toppos/availableGameHeight) * 100;
    const uiwidth = (orientation === "landscape") ? 100:  availablePuzzleWidth;
    const uiheight = (orientation === "landscape") ?  availablePuzzleHeight: 100;
    const btnwidth = (orientation === "landscape") ? uiwidth : uiwidth * 0.25;
    const btnheight = (orientation === "landscape") ? uiheight * 0.25 : uiheight;

    const gridStyle = {
        transform:`scale(${ puzzleScale })`,
        left:`${ leftpercent }%`,
        top:`${ toppercent }%`
    };

    const gamecontainerstyle = {
        width:`${ availableGameWidth }px`,
        height:`${ availableGameHeight }px`
    };

    const containerstyle = {
        width:`${ availablePuzzleWidth }px`,
        height:`${ availablePuzzleHeight }px`
    };

    const uistyle = {
        width:`${ uiwidth }px`,
        height:`${ uiheight }px`,
    };

    const buttonstyle = {
        width:`${ btnwidth }px`,
        height:`${ btnheight }px`,
        textAlign:`center`
    };


    if(viewArea.w > 1024) {

        return (
            <div className="wholepage">
                <h1 className="pagetitle"> React 15-puzzle </h1>
                <div className="game-area"  >
                    <div className="game-container"  style={ gamecontainerstyle }>
                        <UI navStyle={ uistyle } buttonStyle={ buttonstyle }/>
                        <Puzzle gridStyle={ gridStyle } containerStyle={ containerstyle } puzzleScale={ puzzleScale }/>
                        <Sidebar solving={ isSolving }/>
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
            <div className="game-area"  >
                <div className="game-container"  style={ gamecontainerstyle }>
                    <UI navStyle={ uistyle } buttonStyle={ buttonstyle }/>
                    <Puzzle gridStyle={ gridStyle } containerStyle={ containerstyle } puzzleScale={ puzzleScale }/>
                    <Sidebar solving={ isSolving }/>
                </div>
            </div>
        );
    }
}


export default GameView;