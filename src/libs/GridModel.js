import {shuffleArray} from "./eldUtils";
import Solver from "./Solver";
import {getMisplaced} from './Solver';

class GridModel {

    constructor(gridsize){

        this.tiles = this.buildNew(gridsize);
        this.draggedIndex = null;

    }

    grabTile = (position) => {
        let grabposition = null;
        const nearBlankPosition = checkValidMove(position,this.tiles);
        if(nearBlankPosition != null){
            grabposition = position;
            this.draggedIndex =  grabposition;

        }

        return grabposition;

    };

    moveTile = (position) => {
        //check if blank is next to position, swap tile (number) from position (index) and blank
        const moveToPosition = checkValidMove(position,this.tiles);
        console.log("move to?" + moveToPosition);
        if(moveToPosition != null){
            let temp = this.tiles[moveToPosition];
            this.tiles[moveToPosition] = this.tiles[position];
            this.tiles[position] = temp;
        }
        // return, is valid
        return moveToPosition;
    };

    getTiles = () => {

        console.log("getting tiles:" + this.tiles);
        return this.tiles;
    };

    buildNew = (size) => {
        let tiles = getInitTiles(size);
        while(getMisplaced(tiles) === 0 || !this.isSolvable(tiles)){
            console.log("shuffle once");
            shuffleArray(tiles);
        }

        console.log("shuffled? " + tiles);
        return tiles;
    };

    isSolvable = (set) => {

        //count inversions
        /*let inversions = 0;
        for(let i = 0; i< set.length; i++){
            let num = set[i];
            for(let j = i + 1; j < set.length; j++){
                if(set[j] && set[j] < num) inversions += 1;
            }
        }*/
        let inversions = this.countInversions(set);


        //if size is odd it is solvable if inversion are even
        let size = Math.sqrt(set.length);
        if(size % 2 === 1){
            return inversions % 2 === 0;
        }else{
            //if size is even, solvable if inversions and row with blank space from bottom is opposition odd/even
            //find row of blank
            let blank = set.indexOf(set.length);
            let row = Math.floor(blank/size);
            let fromBottom = size - row;

            return ((inversions % 2 === 1 && fromBottom % 2 === 0) || (inversions % 2 === 0 && fromBottom % 2 === 1));
        }




    };

    countInversions = (arr) => {
        let invArray = arr.map(function(num, i) {
            let inversions = 0;
            for (let j = i + 1; j < arr.length; j++) {
                if (num !== arr.length && arr[j] !== arr.length && arr[j] < num) {
                    inversions += 1;
                }
            }
            return inversions;

        });
        // return sum of inversions array
        return invArray.reduce(function(a, b) {
            return a + b;
        });

    };



    getSolution = () => {

        console.log("get solution");
        //start astar
        let solver = new Solver();
        //return array of moves
        //this.solution = solver.solvePuzzleAStar(this.getTiles());
        this.solution = solver.solvePuzzleFringe(this.getTiles());

        console.log("and the solution is..." + this.solution);

    }

}

export default GridModel;



const getInitTiles = (size) => {
    let tiles = [];
    let len = Math.pow(size,2);
    while(tiles.length < len){
        tiles.push(tiles.length + 1);
    }

    return tiles;
};

const checkValidMove = (position,tiles) => {

    //console.log("check valid from position? " + position);
    //console.dir(position);
    let blank = tiles.indexOf(tiles.length);
    let rowLength = Math.sqrt(tiles.length);
    if(Math.floor(blank/rowLength) === Math.floor(position/rowLength)){//same row
        if(blank === position - 1 || blank === position + 1) return blank;
    }else{
        if(blank === position - rowLength || blank === position + rowLength) return blank;
    }

    return null;

};





