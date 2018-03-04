import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startNewPuzzle, changeGridSize, changeDisplayType, getSolution } from "../actionCreators"
import UiView from '../components/UiView'

class UI extends Component {

    constructor(props){
        super(props);

        this.uiSelectSize = this.uiSelectSize.bind(this);
        this.uiSelectType = this.uiSelectType.bind(this);
        this.uiStartNew = this.uiStartNew.bind(this);
        this.uiSolve = this.uiSolve.bind(this);

    }

    uiSelectSize(e) {

        const { gridSize , isSolving, isShowingSolution, showNext } = this.props;
        if(isSolving || isShowingSolution || showNext) return;
        const selectedSize = (gridSize === 4) ? 3 : 4;
        this.props.changeGridSize(selectedSize);
    }

    uiSelectType(e) {

        const { selectType , images } = this.props;
        let imgSrc = null;
        if( selectType === 'Image') {

            let index = Math.floor( Math.random() * Math.floor( images['allKeys'].length - 1 ) );
            imgSrc = images[ images['allKeys'][index] ];

        }
        this.props.changeDisplayType(selectType, imgSrc);
    }

    uiStartNew(e) {

        const { gridSize , isSolving , isShowingSolution, showNext} = this.props;
        if(isSolving || isShowingSolution || showNext) return;
        this.props.startNewPuzzle(gridSize);
    }

    uiSolve(e) {

        const { isSolving , isShowingSolution, showNext} = this.props;
        if(isSolving || isShowingSolution || showNext) return;
        this.props.getSolution();
    }



    render() {
        const {selectSize, selectType, navStyle, buttonStyle} = this.props;
        return (
            <UiView onSolveClick={ this.uiSolve } onNewClick={ this.uiStartNew } onSizeClick={ this.uiSelectSize } onDisplayClick={ this.uiSelectType } selectSize={ selectSize } selectType={ selectType } navStyle={ navStyle } buttonStyle={ buttonStyle }/>
        );
    }
}




const getSelectSize = (size) => {

    return (size === 3) ? 15 : 8
}

const getSelectType = (type) => {

    return (type === 'Numbers') ? 'Image' : 'Numbers'
}


const mapStateToProps = (state) => {

    return {
        gridSize: state.gridSize,
        images: state.images,
        isSolving: state.isSolving,
        isShowingSolution: state.isShowingSolution,
        showNext: state.showNext,
        selectSize: getSelectSize(state.gridSize),
        selectType: getSelectType(state.displayType),


    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        startNewPuzzle: (size) => {
            dispatch(startNewPuzzle(size))
        },
        getSolution: () => {
            dispatch(getSolution())
        },
        changeGridSize: (size) => {
            dispatch(changeGridSize(size))
        },
        changeDisplayType: (type, src) => {
            dispatch(changeDisplayType(type, src))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UI)

