class PriorityQueue {
    constructor(scoreFunction, idFunction){

        this.heap=[];
        this.scoreFunction = scoreFunction;
        this.idFunction = idFunction;
        this.map = {};

    }

    getQueueSize = () => {
        return this.heap.length;
    };

    //return highest priority
    getHighestPriority = () => {

        let result = this.heap[0];

        //delete this.map[this.idFunction(result)];

        let end = this.heap.pop();
        if(this.heap.length > 0){
            this.heap[0] = end;
            this.sink(0);
        }

        return result;
    };

    push = (queueItem) => {


        /*if(this.map[this.idFunction(queueItem)]){

            console.log("already in heap");
            return;
        }*/

        this.heap.push(queueItem);
        this.map[this.idFunction(queueItem)] = queueItem;
        this.bubble(this.heap.length - 1);

    };


    bubble =(node)=> {

        let elem = this.heap[node];
        let score = this.scoreFunction(elem);

        while(node > 0){
            let parentNode = Math.floor((node - 1)/2);
            let parentElem = this.heap[parentNode];
            let parentscore = this.scoreFunction(parentElem);

            if(score >= parentscore) break;

            //swap with parent node if less

            this.map[this.idFunction(elem)] = parentNode;
            this.map[this.idFunction(parentElem)] = node;

            this.heap[parentNode] = elem;
            this.heap[node] = parentElem;

            node = parentElem;
        }



        this.map[this.idFunction(elem)] = node;
        return node;



    };

    sink =(node)=> {

        let len = this.heap.length;
        let elem = this.heap[node];
        let score = this.scoreFunction(elem);
        let swap = null;

        while(true){

            let childBIndex = (node + 1) * 2;
            let childAIndex = childBIndex - 1;
            let aScore;
            let bScore;

            if(childAIndex < len){
                aScore = this.scoreFunction(this.heap[childAIndex]);
                if(aScore < score) swap = childAIndex;

            }

            if(childBIndex < len){
                bScore = this.scoreFunction(this.heap[childBIndex]);

                if(bScore < (swap === null ? score : aScore)){
                    swap = childBIndex;
                }
            }

            if(swap === null) break;

            this.map[this.idFunction(this.heap[swap])] = node;
            this.map[this.idFunction(elem)] = swap;

            this.heap[node] = this.heap[swap];
            this.heap[swap] = elem;

            node = swap;
        }

        this.map[this.idFunction(elem)] = node;
        return node;

    }

}

export default PriorityQueue;