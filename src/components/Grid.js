import React, { Component } from 'react';
import Tile from "./Tile";

class Grid extends Component {

    render() {

        const { onGrab, imgSrc, defaultImg, puzzleArea, gridSize, gridStyle, dragIndex, dropIndex, dragOffset, displayType} = this.props;
        const tileSize = getTileSize(puzzleArea.w, puzzleArea.h, gridSize);
        let tiles = this.props.tiles;

        tiles = tiles.map((item, i, arr) => {


            const dragged = (dragIndex === i);
            const dropped = (dropIndex === i);


            const imgPos = getPosition(tileSize.width, tileSize.height, item - 1, gridSize);
            let tilePos = getPosition(tileSize.width, tileSize.height, i , gridSize);

            const matched = (item - 1 === i);

            //constrain drag to blank position space
            let adjustedOffset = {x:0,y:0};

            if(dragOffset != null && (dragged || dropped)){

                //swap index for dropped state since grid has been reordered but motion simulated from last state
                const blankIndex = (dropped) ? dropIndex : arr.indexOf(arr.length);
                const dragIndex = (dropped) ? arr.indexOf(arr.length) : i;

                const dragCoor = getGridCoordinates(dragIndex, gridSize);
                const blankCoor = getGridCoordinates(blankIndex, gridSize);

                //drag left
                 if(blankCoor.x - dragCoor.x === 1 && dragOffset.x > 0) {
                    adjustedOffset.x = dragOffset.x;
                    if(adjustedOffset.x > tileSize.width) {
                        adjustedOffset.x = tileSize.width;
                    }
                }

                //drag right
                if(blankCoor.x - dragCoor.x === -1 && dragOffset.x < 0) {
                    adjustedOffset.x = dragOffset.x;
                    if(adjustedOffset.x < -tileSize.width) {
                        adjustedOffset.x = -tileSize.width;
                    }
                }

                //drag down
                if(blankCoor.y - dragCoor.y === 1 && dragOffset.y > 0) {
                    adjustedOffset.y = dragOffset.y;
                    if(adjustedOffset.y > tileSize.height) {
                        adjustedOffset.y = tileSize.height;
                    }
                }

                //drag up
                if(blankCoor.y - dragCoor.y === -1 && dragOffset.y < 0) {
                    adjustedOffset.y = dragOffset.y;
                    if(adjustedOffset.y < -tileSize.height) {
                        adjustedOffset.y = -tileSize.height;
                    }
                }
            }


            if(dragged){
                tilePos.x += adjustedOffset.x;
                tilePos.y += adjustedOffset.y;
            }

            //if dropped move to blank position (or dragged position?) before transition
            if(dropped){
                let d = dragIndex;
                if(d === null) d = arr.indexOf(arr.length);
                tilePos = getPosition(tileSize.width, tileSize.height, d, gridSize);
                tilePos.x += adjustedOffset.x;
                tilePos.y += adjustedOffset.y;

            }

            const visible = (item === arr.length) ? "hidden" : "visible";

            return (

                <Tile key={i} imgSrc={ imgSrc } width={ tileSize.width } height={ tileSize.height } index={ i } id={ item } onGrab={ onGrab } curPos={ tilePos } indexPos={ imgPos } visible={ visible } dragged={dragged} dropped={ dropped } displayType={ displayType } matched={ matched }/>

            )
        });

        return (

            <div className="Grid" style={ gridStyle }>
                <img alt="background" className="bg-image"
                         src={ defaultImg }
                />

                <div>
                    {tiles}
                </div>
            </div>

        );

    }

}

export default Grid;

const getTileSize = (width,height,gridsize) => {

    return { width: width/gridsize, height: height/gridsize }
};

const getPosition = (tileWidth,tileHeight,gridIndex,gridSize) => {

    const imgCoor = getGridCoordinates(gridIndex,gridSize);
    const x = tileWidth * imgCoor.x;
    const y = tileHeight * imgCoor.y;

    return { x:x, y:y };

};

const getGridCoordinates = (index,size) => {

    const y = Math.floor( index/size );
    const x = index - ( y * size );

    return { x:x, y:y };

};

