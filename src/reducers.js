import * as types from './actions'


const appReducer = (state = {}, action) => {
    console.log("new action: " + action.type);

    switch(action.type) {
        case types.REQUEST_SOLUTION:
            return Object.assign({}, state, {
                isSolving : true,
            });
        case types.RECEIVE_SOLUTION:
            return Object.assign({}, state, {
                solution:action.solution,
                isSolving : false,
                showNext: true,
            });
        case types.START_MOVE:
            return Object.assign({}, state, {
                isShowingSolution: true,
                tiles: action.tiles
            });
        case types.END_MOVE:
            return Object.assign({}, state, {
                isShowingSolution: false,
                showNext: action.showNext,
            });
        case types.CHANGE_DISPLAY_TYPE:
            return Object.assign({}, state, {
                displayType: action.displayType,
            });
        case types.CHANGE_GRID_SIZE:
            return Object.assign({}, state, {
                gridSize: action.gridSize,
                otherSize: action.otherSize
            });
        case types.START_NEW_PUZZLE:
            return Object.assign({}, state, {
                tiles: action.tiles
            });
        case types.GRAB_TILE:
            return Object.assign({}, state, {
                dragIndex: action.dragIndex,
                dragOffset: action.dragOffset,
                dragArea: action.dragArea,
            });
        case types.DRAG_TILE:
            return Object.assign({}, state, {
                dragIndex: action.index,
                dragOffset: action.dragOffset,
            });
        case types.DROP_TILE:
            return Object.assign({}, state, {
                dragIndex: null,
                dragOffset: null,
                dragArea: null,
                tiles: action.tiles
            });
        case types.RESIZE_GAME:
            return Object.assign({}, state, {
                viewArea: action.viewArea
            });
        default:
            return state



    }
}

export default appReducer