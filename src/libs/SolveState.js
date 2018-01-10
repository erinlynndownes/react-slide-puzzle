import {numArrayToString} from "./eldUtils"

class SolveState {
    constructor(sequence, moves){

        console.log("new state: " + sequence);
        //sequence as string
        this.id = numArrayToString(sequence);
        //sequence as array
        this.sequence = sequence;

        //depth stored in moves lengths
        this.moves = moves;

        //

    }

    setCost = (cost) => {
        this.cost = cost;
    }



}




export default SolveState;