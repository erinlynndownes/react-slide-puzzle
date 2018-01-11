import PriorityQueue from "./PriorityQueue";
import SolveState from "./SolveState";


class Solver {

    constructor(){



    }

    solvePuzzleAStar(initial){

        console.log("start a star");
        let moves = [];
        this.gridSize = (Math.sqrt(initial.length));
        this.queue = new PriorityQueue((item)=>(item.cost),(item)=>(item.id));

        //add first node to queue
        let initialState = new SolveState(initial,moves);
        initialState.cost = initialState.moves.length + getHeuristics(initialState.sequence,this.gridSize);
        this.queue.push(initialState);



        let topNode = initialState;

        let visited = {};
        //console.log("just added to queue?" + this.queue.getQueueSize());

        while(this.queue.getQueueSize() > 0){

            topNode = this.queue.getHighestPriority();
            //get misplaced tiles heuristic and check for solution

            //if found solution, stop, complete path
            if(getMisplaced(topNode.sequence) === 0){
                //finish
                console.log("found");
                return topNode.moves;

            }

            if(topNode.moves.length > 100) break;
            expandState(topNode,this.queue,this.gridSize, visited);

        }


        console.log("queue finished");

        return topNode.moves;
    }

    solvePuzzlePattern(startArr){
        let solution = startArr;

        //first 7
        solution = this.solvePuzzleFringe(solution,[1,2,3,4])
        //last 8

    }

    solvePuzzleFringe(startArr,pattern){


        let start = startArr.toString();


        const fringe = [start];
        const listCache = {};


        let found = false;
        const size = (Math.sqrt(startArr.length));
        const cost = 1;
        let flimit = getHeuristics(startArr,size);
        listCache[start] = [0,null];
        const moves = [];

        while(fringe.length > 0 && !found){

            let fmin = Infinity;

            for(let i = 0; i< fringe.length; i++){

                //console.log("check fringe");

                const fringeNode = fringe[i];
                const g = listCache[fringeNode][0];
                const parent = listCache[fringeNode][1];
                const fringeArr = stringToNumArray(fringeNode);
                const f = g + getHeuristics(fringeArr,size,pattern);

                if(f > flimit){
                    fmin = Math.min(f,fmin);
                    continue;
                }

                if(getMisplaced(fringeArr,pattern) === 0){
                    console.log("found!!" + fringeArr);
                    //construct path back with lookup of parents stored in cache

                    let stepArr = fringeArr;
                    let nextStep = parent;
                    while(nextStep ){

                        console.log("next step: " + nextStep);
                        //move is number switched with blank (last num) between current and parent sequence
                        const parentStep = listCache[nextStep][1];
                        if(parentStep){
                            const parArr = stringToNumArray(parentStep);
                            const move = stepArr[parArr.indexOf(parArr.length)];
                            moves.unshift(move);
                            stepArr = parArr;
                        }

                        nextStep = parentStep;

                    }
                    found = true;
                    break;

                }

                let childNodes = expandNode(fringeNode,parent,size);

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

                    //console.log("add to fringe");
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

}


export default Solver

const expandNode = (node, parent, size) => {

    const nodeArr = stringToNumArray(node);
    const parentArr = (parent) ? stringToNumArray(parent) : null;
    const possibleMoves = getAllMoves(nodeArr, size);
    const blankParentIndex = (!parent || !parentArr) ? null :parentArr.indexOf(parentArr.length);

    const childStrings = [];
    for(let i = 0; i< possibleMoves.length; i++) {

        const moveIndex = nodeArr.indexOf(possibleMoves[i]);
        const blankIndex = nodeArr.indexOf(nodeArr.length);

        if(moveIndex === blankParentIndex) continue;

        let newSequence = nodeArr.slice(0);
        const temp = newSequence[blankIndex];
        const temp2 = Number(possibleMoves[i]);
        newSequence[blankIndex] = temp2;
        newSequence[moveIndex] = temp;

        const s = newSequence.toString();
        childStrings.push(s);

    }

    return childStrings;
};

const expandState = (state,queue,size,visited) =>{

    const idStr = state.id;
    visited[idStr] = state;

    const possibleMoves = getAllMoves(state.sequence, size);
    const l = possibleMoves.length;
    for(let i = 0; i< l; i++){

        if(state.moves[state.moves.length - 1] ===  possibleMoves[i]){


        }else{

            const newSequence = state.sequence.slice(0);
            //console.log("new sequence: " + newSequence);
            const len = newSequence.length;
            const moveIndex = newSequence.indexOf(possibleMoves[i]);
            const blankIndex = newSequence.indexOf(len);
            const temp = newSequence[blankIndex];
            const temp2 = Number(possibleMoves[i]);
            newSequence[blankIndex] = temp2;
            newSequence[moveIndex] = temp;

            const newMoves = state.moves.slice(0);
            newMoves.push(possibleMoves[i]);

            const newState = new SolveState(newSequence,newMoves);
            const newIdStr = newState.id;

            if(!visited[newIdStr] && newMoves.length < 32){
                newState.cost = newMoves.length + getHeuristics(newState.sequence,size);

                queue.push(newState)
            }else{

            }
        }
    }
};

const getHeuristics = (sequence, size) => {
    //return Math.max(manhattan(sequence, size),linearConflict(sequence, size));

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

    const moves = [];

    //find index of blank
    const blank = sequence.indexOf(sequence.length);
    //get grid position of blank
    const blankCoord = getGridCoordinates(blank,size);
    //add existing surrounding numbers to moves
    //add to the left

    if(blankCoord.x > 0) {
        const left = getIndexByCoordinates(blankCoord.x - 1, blankCoord.y, size);
        moves.push(sequence[left]);
    }

    if(blankCoord.x < size - 1){
        const right = getIndexByCoordinates(blankCoord.x + 1,blankCoord.y, size);
        moves.push(sequence[right]);
    }

    if(blankCoord.y > 0){
        const t = getIndexByCoordinates(blankCoord.x,blankCoord.y - 1, size);
        moves.push(sequence[t]);
    }

    if(blankCoord.y < size - 1){
        const b = getIndexByCoordinates(blankCoord.x,blankCoord.y + 1, size);
        moves.push(sequence[b]);
    }


    return moves;
};

export const getMisplaced = (set, pattern) => {
    let misplaced = 0;
    let i = 0;
    while(i < set.length){
        if((!pattern || pattern[i] !== "x") && set[i] !== (i + 1)) misplaced++;
        i++;
    }

    return misplaced;

};

const manhattan = (set, size, pattern) => {
    let cost = 0;

    set.forEach((item, index, arr) => {
        //get grid position of current index
        if(item === arr.length){
            //don't factor in last number used for blank)
        }else{
            if(pattern && pattern[item] === "x"){

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

const linearConflict = (set, size) => {

    let conflictCost = 0;
    let inConflict = [];

    //check rows in conflict
    for(let i = 0; i < size; i++){
        const row = [];
        let factor = 0;
        while(factor < size){
            row.push((i * size) + factor);
            factor++;
        }
        const len = row.length;
        for(let j = 1; j < len; j++){
            let k = j - 1;
            while(k){
                if(set[row[j]] < set[row[k]] && inConflict.indexOf(row[k]) === -1 && inConflict.indexOf(row[j]) === -1){
                    conflictCost += 2;
                    inConflict.push(row[j]);
                    inConflict.push(row[k]);
                }
                k--;
            }
        }
    }


    //check columns in conflict
    for(let c = 0; c < size; c++){
        //find indices in column
        const column = [];
        let f = 0;
        while(f < size){
            column.push((f * size) + c);
            f++
        }

        const columnLen = column.length;
        for(let s = 1; s < columnLen; s++){
            let p = s - 1;
            while(p){
                if(set[column[s]] < set[column[p]] && inConflict.indexOf(column[p]) === -1 && inConflict.indexOf(column[s]) === -1){
                    conflictCost += 2;
                    inConflict.push(column[s]);
                    inConflict.push(column[p]);
                }
                p--;
            }

        }

    }


    return conflictCost;
};


//to convert split string into array of numbers, (instead of strings as str.split('') does)
const stringToNumArray = (str) => {
    const arr = str.split(",");
    let i = 0;
    while(i < arr.length){
        arr[i] = Number(arr[i]);
        i++;
    }

    return arr;
};