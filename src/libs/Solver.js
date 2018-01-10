import PriorityQueue from "./PriorityQueue";
import SolveState from "./SolveState";
import {numArrayToString} from "./eldUtils"


class Solver {

    constructor(){






    }

    solvePuzzleAStar(initial){

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
            console.log("how many moves" + topNode.moves.length);



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

    solvePuzzleFringe(startArr){
        let start = numArrayToString(startArr);

        let fringe = [start];
        let listCache = {};


        let found = false;
        let size = (Math.sqrt(startArr.length));
        let cost = 1;
        let flimit = getHeuristics(startArr,size);
        listCache[start] = [0,null];

        while(fringe.length > 0 && !found){

            let fmin = Infinity;

            for(let i = 0; i< fringe.length; i++){

                //console.log("check fringe");

                let fringeNode = fringe[i];
                let g = listCache[fringeNode][0];
                let parent = listCache[fringeNode][1];
                let fringeArr = stringToArrayThatWorks(fringeNode);
                let f = g + getHeuristics(fringeArr,size);

                if(f > flimit){
                    fmin = Math.min(f,fmin);
                    continue;
                }

                if(getMisplaced(fringeArr) === 0){
                    console.log("found!!");
                    found = true;
                    break;

                }

                let childNodes = expandNode(fringeNode,parent,size);

                childNodes.forEach((child)=> {
                    let childG = g + cost;
                    if(listCache[child]){
                        let cachedG = listCache[child][0];
                        if(cachedG <= childG) return;
                    }

                    let index = fringe.indexOf(child);
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



    }
}

export default Solver

const expandNode = (node, parent, size) => {

    //let nodeArr = node.split();
    let nodeArr = stringToArrayThatWorks(node);
    let parentArr = (parent) ? stringToArrayThatWorks(parent) : null;

    //console.log("expanding?? " + nodeArr.length + ", size? " + size);
    let possibleMoves = getAllMoves(nodeArr, size);

    let blankParentIndex = (!parent || !parentArr) ? null :parentArr.indexOf(parentArr.length);

    let childStrings = [];
    for(let i = 0; i< possibleMoves.length; i++) {

        let moveIndex = nodeArr.indexOf(possibleMoves[i]);
        let blankIndex = nodeArr.indexOf(nodeArr.length);

        if(moveIndex === blankParentIndex) continue;

        let newSequence = nodeArr.slice(0);
        let temp = newSequence[blankIndex];
        let temp2 = Number(possibleMoves[i]);
        newSequence[blankIndex] = temp2;
        newSequence[moveIndex] = temp;

        //console.log("what's the issue??" + newSequence);
        let s = numArrayToString(newSequence);
        childStrings.push(s);

    }

    return childStrings;
};

const expandState = (state,queue,size,visited) =>{


    let idStr = state.id + state.moves.length.toString();
    visited[idStr] = state;

    let possibleMoves = getAllMoves(state.sequence, size);
    //create new state from each swap plus move (as number of tile moved swapped with blank)
    console.log("possible moves? " + possibleMoves.length);
    let l = possibleMoves.length;
    for(let i = 0; i< l; i++){

        if(state.moves[state.moves.length - 1] ===  possibleMoves[i]){


        }else{

            let newSequence = state.sequence.slice(0);
            console.log("new sequence: " + newSequence);
            let len = newSequence.length;
            let moveIndex = newSequence.indexOf(possibleMoves[i]);
            let blankIndex = newSequence.indexOf(len);
            let temp = newSequence[blankIndex];
            let temp2 = Number(possibleMoves[i]);
            newSequence[blankIndex] = temp2;
            newSequence[moveIndex] = temp;

            let newMoves = state.moves.slice(0);
            newMoves.push(possibleMoves[i]);

            let newState = new SolveState(newSequence,newMoves);
            let newIdStr = newState.id + newState.moves.length.toString();

            if(!visited[newIdStr] && newMoves.length < 50){
                newState.cost = newMoves.length + getHeuristics(newState.sequence,size);

                queue.push(newState)
            }else{

            }
        }
    }
};

const getHeuristics = (sequence, size) => {
    //return Math.max(manhattan(sequence, size),linearConflict(sequence, size));

    return manhattan(sequence,size) + linearConflict(sequence,size);

};

const getGridCoordinates = (index,size) => {

    let y = Math.floor(index/size);
    let x = index - (y * size);

    return {x:x,y:y};

};

const getIndexByCoordinates = (x,y,size) => {
    return (y * size) + x;

};

const getAllMoves = (sequence, size) => {

    let moves = [];

    //find index of blank
    let blank = sequence.indexOf(sequence.length);
    //get grid position of blank
    let blankCoord = getGridCoordinates(blank,size);
    //add existing surrounding numbers to moves
    //add to the left

    if(blankCoord.x > 0) {
        let left = getIndexByCoordinates(blankCoord.x - 1, blankCoord.y, size);
        moves.push(sequence[left]);

    }

    if(blankCoord.x < size - 1){
        let right = getIndexByCoordinates(blankCoord.x + 1,blankCoord.y, size);
        moves.push(sequence[right]);
    }

    if(blankCoord.y > 0){
        let t = getIndexByCoordinates(blankCoord.x,blankCoord.y - 1, size);
        moves.push(sequence[t]);
    }

    if(blankCoord.y < size - 1){
        let b = getIndexByCoordinates(blankCoord.x,blankCoord.y + 1, size);
        moves.push(sequence[b]);
    }


    return moves;
};

export const getMisplaced = (set) => {
    let misplaced = 0;
    let i = 0;
    while(i < set.length){
        if(set[i] !== (i + 1)) misplaced++;
        i++;
    }

    return misplaced;

};

const manhattan = (set, size) => {
    let cost = 0;

    set.forEach((item, index, arr) => {
        //get grid position of current index
        if(item === arr.length){
            //don't factor in last number used for blank)
        }else{
            let indexCoor = getGridCoordinates(index, size);
            //get grid position of target (number content of array - 1)
            let targetCoor = getGridCoordinates(item - 1, size);

            let xMoves = Math.abs(indexCoor.x - targetCoor.x);
            let yMoves = Math.abs(indexCoor.y - targetCoor.y);

            cost += (xMoves + yMoves)
        }

    });

    return cost;

};

const linearConflict = (set, size) => {

    let conflictCost = 0;
    let inConflict = [];

    //check rows in conflict
    for(let i = 0; i < size; i++){
        let row = [];
        let factor = 0;
        while(factor < size){
            row.push((i * size) + factor);
            factor++;
        }
        let len = row.length;
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
        let column = [];
        let f = 0;
        while(f < size){
            column.push((f * size) + c);
            f++
        }

        let columnLen = column.length;
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

const stringToArrayThatWorks = (str) => {

    /*let arr = [];
    while(arr.length < str.length){

        arr.push(Number(str.charAt(arr.length)));
    }*/

    let arr = str.split(",");
    let i = 0;
    while(i < arr.length){
        arr[i] = Number(arr[i]);
        i++;
    }

    return arr;
};