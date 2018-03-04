import './index.css';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { startNewPuzzle, requestSolution, getSolution, changeGridSize } from './actionCreators'
import appReducer from './reducers'
import Root from './components/Root'
import React from 'react'
import ReactDOM from 'react-dom';

import { render } from 'react-dom'

const loggerMiddleware = createLogger()

const initialState = {

    viewArea: { w:window.innerWidth, h:window.innerHeight },
    gridSize: 4,
    tiles: null,
    puzzleArea: { w:768, h:768 },
    displayType: 'Numbers',
    solution: null,
    isSolving: false,
    showNext: false,
    isShowingSolution: false,
    imgSrc: null,
    images: [],
    defaultImg: null,
    dragIndex: null,
    dragStart: null,
    dragOffset: null,
    dragArea: null,
    dropIndex: null

}

const store = createStore(
    appReducer,
    initialState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)


store.dispatch(startNewPuzzle(4));

render(
    <Root store={store} />,
    document.getElementById('root')

);


