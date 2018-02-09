import React, { Component } from 'react';
import Tile from "./Tile";

class Grid extends Component {

    render() {

        const {sequence, onGrab, onDrop, onComplete, src, width, height, gridsize, gridStyle, draggedIndex, droppedIndex, dragOffset, displayType} = this.props;
        const tileSize = getTileSize(width,height,gridsize);


        const tiles = sequence.map((item, i, arr) => {


            const dragged = (draggedIndex === i);
            const dropped = (droppedIndex === i);

            const imgPos = getPosition(tileSize.width, tileSize.height, item - 1,gridsize);
            let tilePos = getPosition(tileSize.width,tileSize.height, i ,gridsize);

            const matched = (item - 1 === i);

            //constrain drag to blank position space

            let adjustedOffset = {x:0,y:0};

            if(dragOffset != null && (dragged || dropped)){

                //swap index for dropped state since grid has been reordered but motion simulated from last state
                const blankIndex = (dropped) ? droppedIndex : arr.indexOf(arr.length);
                const dragIndex = (dropped) ? arr.indexOf(arr.length) : i;

                const dragCoor = getGridCoordinates(dragIndex,gridsize);
                const blankCoor = getGridCoordinates(blankIndex,gridsize);

                //drag left
                 if(blankCoor.x - dragCoor.x === 1 && dragOffset.x > 0){
                    adjustedOffset.x = dragOffset.x;
                    if(adjustedOffset.x > tileSize.width){
                        adjustedOffset.x = tileSize.width;
                    }
                }

                //drag right
                if(blankCoor.x - dragCoor.x === -1 && dragOffset.x < 0){
                    adjustedOffset.x = dragOffset.x;
                    if(adjustedOffset.x < -tileSize.width){
                        adjustedOffset.x = -tileSize.width;
                    }
                }

                //drag down
                if(blankCoor.y - dragCoor.y === 1 && dragOffset.y > 0){
                    adjustedOffset.y = dragOffset.y;
                    if(adjustedOffset.y > tileSize.height){
                        adjustedOffset.y = tileSize.height;
                    }
                }

                //drag up
                if(blankCoor.y - dragCoor.y === -1 && dragOffset.y < 0){
                    adjustedOffset.y = dragOffset.y;
                    if(adjustedOffset.y < -tileSize.height){
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
                let d = draggedIndex;
                if(d === null) d = arr.indexOf(arr.length);
                tilePos = getPosition(tileSize.width,tileSize.height, d, gridsize);
                tilePos.x += adjustedOffset.x;
                tilePos.y += adjustedOffset.y;
                console.log("adjusted x : " + d);

            }

            const visible = (item === arr.length) ? "hidden" : "visible";

            return (

                <Tile key={i} imgSrc={src} width={tileSize.width} height={tileSize.height} index={i} id={item} onGrab={onGrab} onDrop={onDrop} curPos={tilePos} indexPos={imgPos} visible={visible} moveCompleteHandler={onComplete} dragged={dragged} dropped={dropped} display={displayType} matched={matched}/>

            )
        });

        return (

            <div className="Grid" style={gridStyle}>
                <img alt="background" className="bg-image"
                     src={src}
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

    return {width:width/gridsize,height:height/gridsize}
};

const getPosition = (tileWidth,tileHeight,gridIndex,gridSize) => {

    const imgCoor = getGridCoordinates(gridIndex,gridSize);
    const x = tileWidth * imgCoor.x;
    const y = tileHeight * imgCoor.y;

    return {x:x,y:y};

};

const getGridCoordinates = (index,size) => {

    const y = Math.floor(index/size);
    const x = index - (y * size);

    return {x:x,y:y};

};

