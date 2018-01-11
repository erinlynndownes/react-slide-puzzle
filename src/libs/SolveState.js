
class SolveState {
    constructor(sequence, moves){

        //console.log("new state: " + sequence);
        //depth stored in moves lengths
        this.moves = moves;
        //sequence as string
        this.id = sequence.toString();
        //sequence as array
        this.sequence = sequence;



    }

    setCost = (cost) => {
        this.cost = cost;
    }



}




export default SolveState;