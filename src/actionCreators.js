import * as types from './actions';
import GridModel from './libs/GridModel';
let model = new GridModel();

export const startNewPuzzle = (gridSize) => ({

    type: types.START_NEW_PUZZLE,
    tiles: model.buildNew(gridSize)
});


export const changeGridSize = (gridSize) => ({

    type: types.CHANGE_GRID_SIZE,
    gridSize,
    tiles: model.buildNew(gridSize)
})

export const changeDisplayType = (displayType) => {

    return {
        type: types.CHANGE_DISPLAY_TYPE,
        displayType,
    }
}

export const grabTile = (dragIndex,dragOffset,dragArea) => {

    if(model.grabTile(dragIndex) === dragIndex) {
        return {
            type: types.GRAB_TILE,
            dragIndex,
            dragOffset,
            dragArea
        }
    } else {
        return {
            type: types.GRAB_TILE,
            dragIndex:null,
            dragArea:null,
            dragOffset:null

        }
    }
}

export const dragTile = (dragOffset) => ({

    type:types.DRAG_TILE,
    dragOffset
})

export const dropTile = (dragIndex,dragOffset,dragArea) => {

    let tiles;
    if(Math.abs(dragOffset.x) > dragArea.w/2 || Math.abs(dragOffset.y) > dragArea.h/2 ){
        tiles = model.moveTile(dragIndex);
    }

    return {
        type: types.DROP_TILE,
        dragIndex: null,
        dragOffset: null,
        dragArea: null,
        tiles
    }
}

export const startMove = (state) => {

    const { solution } = state;
    const move = solution.shift();
    const tiles = model.moveTile(move);

    return {
        type:types.START_MOVE,
        tiles
    }
}

export const endMove = (state) => {

    const { solution } = state;
    const showNext = solution.length > 0;
    return {
        type: types.END_MOVE,
        showNext
    }
}

//is solving true
export const requestSolution = () => ({

    type:types.REQUEST_SOLUTION,
    isSolving:true
})


const receiveSolution = (solution) => ({

    type:types.RECEIVE_SOLUTION,
    solution
})

export const getSolution = () => {

    return (dispatch) => {
        dispatch(requestSolution());
        callModelSolution().then(solution => {
            return dispatch(receiveSolution(solution))
        });
    }
}

function callModelSolution() {

    return new Promise((resolve, reject) => {
        let s = model.getSolution(resolve);
    });
}

export const resizeGame = (viewArea) => ({

    type:types.RESIZE_GAME,
    viewArea
})

