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

    }

    uiSelectSize(e) {

        const { gridSize } = this.props;
        const selectedSize = (gridSize === 4) ? 3 : 4;
        this.props.changeGridSize(selectedSize);
    }

    uiSelectType(e) {

        const { selectType } = this.props;
        this.props.changeDisplayType(selectType);
    }

    uiStartNew(e) {

        const { gridSize } = this.props;
        this.props.startNewPuzzle(gridSize);
    }



    render() {
        const {selectSize, selectType, onSolveClick, navStyle, buttonStyle} = this.props;
        return (
            <UiView onSolveClick={ onSolveClick } onNewClick={ this.uiStartNew } onSizeClick={ this.uiSelectSize } onDisplayClick={ this.uiSelectType } selectSize={ selectSize } selectType={ selectType } navStyle={ navStyle } buttonStyle={ buttonStyle }/>
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
        gridSize:state.gridSize,
        selectSize: getSelectSize(state.gridSize),
        selectType: getSelectType(state.displayType),

    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        startNewPuzzle: (size) => {
            dispatch(startNewPuzzle(size))
        },
        onSolveClick: () => {
            dispatch(getSolution())
        },
        changeGridSize: (size) => {
            dispatch(changeGridSize(size))
        },
        changeDisplayType: (type) => {
            dispatch(changeDisplayType(type))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UI)

