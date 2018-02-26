import { shuffleArray } from "./utils";
import { getMisplaced } from './Solver';
import Worker from './Solver.worker.js';
class GridModel {

    grabTile = (position) => {
        let grabposition = null;
        const nearBlankPosition = checkValidMove(position, this.tiles);
        if(nearBlankPosition != null) {
            grabposition = position;
            this.draggedIndex =  grabposition;

        }

        return grabposition;

    };

    moveTile = (position) => {

        const blankPosition = this.tiles.indexOf(this.tiles.length);
        const temp = this.tiles[ blankPosition ];
        this.tiles[ blankPosition ] = this.tiles[ position ];
        this.tiles[ position ] = temp;

        return this.tiles
    };

    getTiles = () => {

        return this.tiles.slice(0);
    };

    buildNew = (size) => {
        let tiles = getInitTiles(size);
        while(getMisplaced(tiles) === 0 || !this.isSolvable(tiles)){

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
        this.tiles = tiles;
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

            return ( (inversions % 2 === 1 && fromBottom % 2 === 0) || (inversions % 2 === 0 && fromBottom % 2 === 1) );
        }




    };

    countInversions = (arr) => {
        let invArray = arr.map(function(num, i) {
            let inversions = 0;
            for (let j = i + 1; j < arr.length; j++) {
                if ( num !== arr.length && arr[j] !== arr.length && arr[j] < num ) {
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



    getSolution = (cb) => {


        let worker = new Worker();
        let sequence = this.getTiles();
        let self = this;

        worker.addEventListener("message", (e) => {
            self.solution = e.data['solution'];
            cb(self.solution);
        });
        worker.postMessage({ 'cmd':'solve', 'sequence':sequence });

    }

}

export default GridModel;



const getInitTiles = (size) => {
    let tiles = [];
    let len = Math.pow(size,2);
    while(tiles.length < len) {

        tiles.push(tiles.length + 1);
    }

    return tiles;
};

const checkValidMove = (position,tiles) => {

    let blank = tiles.indexOf(tiles.length);
    let rowLength = Math.sqrt(tiles.length);
    if(Math.floor(blank/rowLength) === Math.floor(position/rowLength)) {//same row

        if(blank === position - 1 || blank === position + 1) return blank;
    } else {

        if(blank === position - rowLength || blank === position + rowLength) return blank;
    }

    return null;

};





