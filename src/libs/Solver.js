import {shuffleArray} from "./utils"
class Solver {

    solvePuzzlePattern(startSequence){
        let allMoves = [];
        let moves = null;
        let curArrayState = startSequence.slice(0);
        //first 7
        //console.log("cur array: " + curArrayState);
        moves = this.solvePuzzleFringe(curArrayState,[1,2,"x","x","x","x","x","x","x","x","x","x","x","x","x","x"]);
        allMoves = allMoves.concat(moves);
        //console.log("moves a: " + moves);
        //reconstruct from move
        const a = this.reconstructFromMoves(moves,startSequence);
        const aArr = a.slice(0);
        //console.log("reconstructed a: " + aArr);
        moves = this.solvePuzzleFringe(aArr,[1,2,3,4,"x","x","x","x","x","x","x","x","x","x","x","x"]);
        allMoves = allMoves.concat(moves);
        //console.log("moves b: " + moves);
        const b = this.reconstructFromMoves(moves,a);
        const bArr = b.slice(0);
        //console.log("reconstructed b: " + bArr);
        moves = this.solvePuzzleFringe(bArr,[1,2,3,4,5,"x","x","x",9,"x","x","x",13,"x","x","x"]);
        allMoves = allMoves.concat(moves);
        //console.log("moves c: " + moves);
        const c = this.reconstructFromMoves(moves,b);
        const cArr = c.slice(0);
        //console.log("reconstructed c: " + cArr);
        moves = this.solvePuzzleFringe(cArr,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,"x"]);
        allMoves = allMoves.concat(moves);
        //console.log("moves d: " + moves);
        //const d = this.reconstructFromMoves(moves,c);
        //const dArr = d.slice(0);


        return allMoves;
    }

    solvePuzzleFringe(startSequence,pattern){

        //if there's a pattern, replace not used index in array with "x"
        if(pattern){
            let i = 0;
            while(i < pattern.length - 1){
                if(pattern[i] === "x") startSequence[startSequence.indexOf(i + 1)] = "x";
                if(pattern[i] === "o") startSequence[startSequence.indexOf(i + 1)] = "o";
                i++;
            }
        }


        let start = startSequence.toString();

        const fringe = [start];
        const listCache = {};


        let found = false;
        const size = (Math.sqrt(startSequence.length));
        const cost = 1;
        let flimit = getHeuristics(startSequence,size);
        listCache[start] = [0,null];
        const moves = [];
        //let foundSequence = null;

        while(fringe.length > 0 && !found){

            let fmin = Infinity;

            for(let i = 0; i< fringe.length; i++){

                const fringeNode = fringe[i];
                const g = listCache[fringeNode][0];
                const parent = listCache[fringeNode][1];
                const fringeArr = convertToNumArray(fringeNode);
                const f = g + getHeuristics(fringeArr,size);

                if(f > flimit){
                    fmin = Math.min(f,fmin);
                    continue;
                }

                if(getMisplaced(fringeArr) === 0){
                    //console.log("found!!" + fringeArr);
                    //construct path back with lookup of parents stored in cache

                    let nextStep = fringeNode;
                    while(nextStep){

                        //move is number switched with blank (last num) between current and parent sequence
                        const nextArr = convertToNumArray(nextStep);
                        const move = nextArr.indexOf(nextArr.length);
                        nextStep = listCache[nextStep][1];
                        if(nextStep)moves.unshift(move);

                    }

                    //foundSequence = fringeArr;
                    found = true;
                    break;

                }

                const childNodes = expandNode(fringeNode,parent,size,pattern);

                //console.log("children: " + childNodes);
                childNodes.forEach((child)=> {
                    const childG = g + cost;
                    if(listCache[child]){
                        let cachedG = listCache[child][0];
                        if(cachedG <= childG) return;
                    }

                    const index = fringe.indexOf(child);
                    if(index !== -1){
                        fringe.splice(index,1);
                        if(index <= i) i--;
                    }

                    fringe.splice(i + 1,0,child);
                    listCache[child] = [childG,fringeNode];
                });

                fringe.splice(i,1);
                i--;

            }

            flimit = fmin;

            if(fringe.length === 0) console.log("not found");
        }

        return moves;

    }

    reconstructFromMoves(moves,sequence){
        let constructed = sequence;
        let i = 0;
        while(i < moves.length){

            //swap move index with blank (last)
            const moveIndex = moves[i];
            const blankIndex = constructed.indexOf(constructed.length);
            const tempA = constructed[moveIndex];
            constructed[moveIndex] = constructed.length;
            constructed[blankIndex] = tempA;


            i++;
        }


        return constructed;
    };

}


export default Solver

const expandNode = (node, parent, size, pattern) => {

    const nodeArr = convertToNumArray(node);
    const parentArr = (parent) ? convertToNumArray(parent) : null;//start node has no parent
    const possibleMoves = getAllMoves(nodeArr, size);
    const blankParentIndex = (!parent || !parentArr) ? null :parentArr.indexOf(parentArr.length);

    let childStrings = [];
    const blankIndex = nodeArr.indexOf(nodeArr.length);

    possibleMoves.forEach((move,index,arr) => {

        //const moveIndex = possibleMoves[i];

        if(move !== blankParentIndex){
            const newSequence = nodeArr.slice(0);
            const temp = newSequence[blankIndex];
            const temp2 = (nodeArr[move] === "x") ? nodeArr[move] : Number(nodeArr[move]);
            newSequence[blankIndex] = temp2;
            newSequence[move] = temp;
            const s = newSequence.toString();
            childStrings.unshift(s);
        }



    });


    childStrings = shuffleArray(childStrings);
    return childStrings;
};

const getHeuristics = (sequence, size) => {
    return manhattan(sequence,size);

};

const getGridCoordinates = (index,size) => {

    const y = Math.floor(index/size);
    const x = index - (y * size);

    return {x:x,y:y};

};

const getIndexByCoordinates = (x,y,size) => {
    return (y * size) + x;

};

const getAllMoves = (sequence, size) => {

    let moves = [];

    //find index of blank
    const blank = sequence.indexOf(sequence.length);
    //get grid position of blank
    const blankCoord = getGridCoordinates(blank,size);
    //add existing surrounding numbers to moves

    if(blankCoord.x > 0) {
        const left = getIndexByCoordinates(blankCoord.x - 1, blankCoord.y, size);
        moves.push(left);
    }

    if(blankCoord.x < size - 1){
        const right = getIndexByCoordinates(blankCoord.x + 1,blankCoord.y, size);
        moves.push(right);
    }

    if(blankCoord.y > 0){
        const t = getIndexByCoordinates(blankCoord.x,blankCoord.y - 1, size);
        moves.push(t);
    }

    if(blankCoord.y < size - 1){
        const b = getIndexByCoordinates(blankCoord.x,blankCoord.y + 1, size);
        moves.push(b);
    }

    //moves = shuffleArray(moves);
    return moves;
};

export const getMisplaced = (set) => {
    let misplaced = 0;
    let i = 0;
    while(i < set.length){
        if(set[i] !== "x" && set[i] !== (i + 1) && set[i] !== set.length) misplaced++;
        i++;
    }

    return misplaced;

};

const manhattan = (set, size) => {
    let cost = 0;

    set.forEach((item, index, arr) => {
        //get grid position of current index
        if(item === arr.length){
            //don't factor in last number used for blank
        }else{
            if(item === "x"){

            }else{
                let indexCoor = getGridCoordinates(index, size);
                //get grid position of target (number content of array - 1)

                let targetCoor = getGridCoordinates(item - 1, size);
                let xMoves = Math.abs(indexCoor.x - targetCoor.x);
                let yMoves = Math.abs(indexCoor.y - targetCoor.y);

                cost += (xMoves + yMoves)
            }

        }

    });

    return cost;

};


//to convert split string into array of numbers, (instead of strings as str.split('') does)
const convertToNumArray = (str) => {
    const arr = str.split(",");
    let i = 0;
    while(i < arr.length){

        if(arr[i] !== "x") arr[i] = Number(arr[i]);
        i++;
    }

    return arr;
};