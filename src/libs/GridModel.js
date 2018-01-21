import {shuffleArray} from "./utils";
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
            const temp = this.tiles[moveToPosition];
            this.tiles[moveToPosition] = this.tiles[position];
            this.tiles[position] = temp;
        }
        // return, is valid
        return moveToPosition;
    };

    getTiles = () => {

        console.log("getting tiles:" + this.tiles);
        return this.tiles.slice(0);
    };

    buildNew = (size) => {
        let tiles = getInitTiles(size);
        while(getMisplaced(tiles) === 0 || !this.isSolvable(tiles)){
            console.log("shuffle once");
            shuffleArray(tiles);
        }

        //console.log("shuffled? " + tiles);
        //worst case tests
        //tiles = [16,12,10,13,15,11,14,9,3,7,6,2,4,8,5,1];
        //tiles = [16,12,9,13,15,11,10,14,3,7,2,5,4,8,6,1];
        //tiles = [14,2,9,8,16,1,12,13,6,10,15,3,7,11,5,4];
        //tiles = [11,5,10,9,14,4,8,13,2,6,1,16,12,7,15,3];
        //tiles = [1,5,9,13,2,6,10,14,3,7,11,15,4,8,12,16];
        //tiles = [3,2,9,13,7,12,4,14,1,11,16,6,8,15,10,5];
        //tiles = [4,2,14,9,10,8,7,6,3,1,15,12,11,16,13,5];
        return tiles;
    };

    isSolvable = (set) => {

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
        if(this.tiles.length === 9){
            this.solution = solver.solvePuzzleFringe(this.getTiles());
        }else{
            this.solution = solver.solvePuzzlePattern(this.getTiles());
        }


        console.log("and the solution is..." + this.solution);
        console.log("number of moves" + this.solution.length);

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

    let blank = tiles.indexOf(tiles.length);
    let rowLength = Math.sqrt(tiles.length);
    if(Math.floor(blank/rowLength) === Math.floor(position/rowLength)){//same row
        if(blank === position - 1 || blank === position + 1) return blank;
    }else{
        if(blank === position - rowLength || blank === position + rowLength) return blank;
    }

    return null;

};





