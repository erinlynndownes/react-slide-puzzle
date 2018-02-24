
self.onmessage = (e) => {

    if(e.data['cmd'] === 'solve'){
        let s = e.data['sequence'];
        let moves = (s.length > 10) ? solvePuzzlePattern(s) : solvePuzzleFringe(s);
        self.postMessage({'cmd':'solved','solution':moves});

    }
};


const solvePuzzlePattern = (startSequence) => {

    let allMoves = [];
    let moves = null;
    let curArrayState = startSequence.slice(0);
    moves = solvePuzzleFringe(curArrayState,[1,2,"x","x","x","x","x","x","x","x","x","x","x","x","x","x"]);
    allMoves = allMoves.concat(moves);
    const a = reconstructFromMoves(moves,startSequence);
    const aArr = a.slice(0);
    moves = solvePuzzleFringe(aArr,[1,2,3,4,"x","x","x","x","x","x","x","x","x","x","x","x"]);
    allMoves = allMoves.concat(moves);
    const b = reconstructFromMoves(moves,a);
    const bArr = b.slice(0);
    moves = solvePuzzleFringe(bArr,[1,2,3,4,5,"x","x","x",9,"x","x","x",13,"x","x","x"]);
    allMoves = allMoves.concat(moves);
    const c = reconstructFromMoves(moves,b);
    const cArr = c.slice(0);
    moves = solvePuzzleFringe(cArr,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,"x"]);
    allMoves = allMoves.concat(moves);

    return allMoves;
};

const solvePuzzleFringe = (startSequence,pattern) => {

    //if there's a pattern, replace not used index in array with "x"
    if(pattern) {

        let i = 0;
        while(i < pattern.length - 1) {

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

    while(fringe.length > 0 && !found) {

        let fmin = Infinity;

        for(let i = 0; i< fringe.length; i++) {

            const fringeNode = fringe[i];
            const g = listCache[fringeNode][0];
            const parent = listCache[fringeNode][1];
            const fringeArr = convertToNumArray(fringeNode);
            const f = g + getHeuristics(fringeArr,size);

            if(f > flimit) {

                fmin = Math.min(f,fmin);
                continue;
            }

            if(getMisplaced(fringeArr) === 0) {
                //construct path back with lookup of parents stored in cache

                let nextStep = fringeNode;
                while(nextStep){

                    //move is number switched with blank (last num) between current and parent sequence
                    const nextArr = convertToNumArray(nextStep);
                    const move = nextArr.indexOf(nextArr.length);
                    nextStep = listCache[nextStep][1];
                    if(nextStep) moves.unshift(move);

                }

                found = true;
                break;

            }

            const childNodes = expandNode(fringeNode,parent,size,pattern);

            //console.log("children: " + childNodes);
            childNodes.forEach((child) => {

                const childG = g + cost;
                if(listCache[child]) {

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

};

const reconstructFromMoves = (moves,sequence) => {

    let constructed = sequence;
    let i = 0;
    while(i < moves.length){

        const moveIndex = moves[i];
        const blankIndex = constructed.indexOf(constructed.length);
        const tempA = constructed[moveIndex];
        constructed[moveIndex] = constructed.length;
        constructed[blankIndex] = tempA;


        i++;
    }


    return constructed;
};


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


    //childStrings = shuffleArray(childStrings);
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


const getMisplaced = (set) => {

    let misplaced = 0;
    let i = 0;
    while(i < set.length) {

        if(set[i] !== "x" && set[i] !== (i + 1) && set[i] !== set.length) misplaced++;
        i++;
    }

    return misplaced;

};

const manhattan = (set, size) => {

    let cost = 0;

    set.forEach((item, index, arr) => {
        //get grid position of current index
        if(item === arr.length) {
            //don't factor in last number used for blank
        }else{
            if(item === "x") {

            }else{

                let indexCoor = getGridCoordinates(index, size);
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
    while(i < arr.length) {

        if(arr[i] !== "x") arr[i] = Number(arr[i]);
        i++;
    }

    return arr;
};


const getAllMoves = (sequence, size) => {

    let moves = [];

    const blank = sequence.indexOf(sequence.length);
    const blankCoord = getGridCoordinates(blank,size);

    if(blankCoord.x > 0) {

        const left = getIndexByCoordinates(blankCoord.x - 1, blankCoord.y, size);
        moves.push(left);
    }

    if(blankCoord.x < size - 1) {

        const right = getIndexByCoordinates(blankCoord.x + 1,blankCoord.y, size);
        moves.push(right);
    }

    if(blankCoord.y > 0) {

        const t = getIndexByCoordinates(blankCoord.x,blankCoord.y - 1, size);
        moves.push(t);
    }

    if(blankCoord.y < size - 1) {

        const b = getIndexByCoordinates(blankCoord.x,blankCoord.y + 1, size);
        moves.push(b);
    }

    return moves;
};




