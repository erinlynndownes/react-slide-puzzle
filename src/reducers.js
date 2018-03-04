import * as types from './actions'


const appReducer = (state = {}, action) => {

    switch(action.type) {
        case types.REQUEST_SOLUTION:
            return Object.assign({}, state, {
                isSolving : true,
            });
        case types.RECEIVE_SOLUTION:
            return Object.assign({}, state, {
                solution: action.solution,
                isSolving : false,
                showNext: true,
            });
        case types.START_SOLUTION_MOVE:
            return Object.assign({}, state, {
                showNext: false,
                isShowingSolution: true,
                solution: action.solution,
                tiles: action.tiles
            });
        case types.END_SOLUTION_MOVE:
            return Object.assign({}, state, {
                isShowingSolution: false,
                showNext: action.showNext,
            });
        case types.SOLUTION_COMPLETE:
            return Object.assign({}, state, {
                isShowingSolution: false,
                showNext: false,
                solution:null
            });
        case types.CHANGE_DISPLAY_TYPE:
            return Object.assign({}, state, {
                displayType: action.displayType,
                imgSrc: action.imgSrc
            });
        case types.CHANGE_GRID_SIZE:
            return Object.assign({}, state, {
                gridSize: action.gridSize,
                tiles: action.tiles
            });
        case types.START_NEW_PUZZLE:
            return Object.assign({}, state, {
                tiles: action.tiles
            });
        case types.GRAB_TILE:
            return Object.assign({}, state, {
                dropIndex: null,
                dragIndex: action.dragIndex,
                dragStart: action.dragStart,
                dragArea: action.dragArea,
            });
        case types.DRAG_TILE:
            return Object.assign({}, state, {
                dragOffset: action.dragOffset,
            });
        case types.DROP_TILE:
            return Object.assign({}, state, {
                dragIndex: null,
                dragStart: null,
                dragOffset: null,
                dragArea: null,
                tiles: action.tiles
            });
        case types.RESIZE_GAME:
            return Object.assign({}, state, {
                viewArea: action.viewArea
            });
        case types.ADD_IMAGES:
            return Object.assign({}, state, {
                images: action.images
            });
        case types.SET_DEFAULT_IMAGE:
            return Object.assign({}, state, {
                defaultImg: action.defaultImg
            });
        default:
            return state

    }
}

export default appReducer