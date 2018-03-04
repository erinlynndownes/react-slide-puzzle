import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '../components/Grid'
import { grabTile, dropTile, dragTile, startSolutionMove, endSolutionMove, solutionComplete } from '../actionCreators'


class Puzzle extends Component{

    constructor(props){
        super(props);

        this.dragStart = null;
        this.dragOffset = null;

        this.handlePieceGrab = this.handlePieceGrab.bind(this);
        this.handlePieceDrop = this.handlePieceDrop.bind(this);
        this.handlePieceDrag = this.handlePieceDrag.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);

    }


    componentDidUpdate(prevProps, prevState){

        //add listeners if drag triggered
        if(this.props.dragIndex !== null && prevProps.dragIndex === null){

            this.addListeners();
        }
        //remove listeners if drag stopped
        if(this.props.dragIndex === null && prevProps.dragIndex !== null){

            this.removeListeners();
        }

        //if showNext dispatch next move in solution
        if(this.props.showNext && !prevProps.showNext){

            if(!this.props.solution) return;

            if(this.props.solution.length > 0) {
                let remainingMoves = this.props.solution.slice(0);
                let move = remainingMoves.shift();
                this.props.startSolutionMove(move, remainingMoves);
            } else {
                //done
                this.props.solutionComplete();
            }

        }

        if(this.props.isShowingSolution && !prevProps.isShowingSolution){

            setTimeout(this.props.endSolutionMove,250)
        }

    }

    componentWillUnmount(){
        if(this.listenersActive) this.removeListeners();
    }

    addListeners() {

        this.listenersActive = true;
        window.addEventListener("touchmove" ,this.handlePieceDrag);
        window.addEventListener("touchend" ,this.handlePieceDrop);
        window.addEventListener("mousemove" ,this.handlePieceDrag);
        window.addEventListener("mouseup" ,this.handlePieceDrop);

    }

    removeListeners() {

        window.removeEventListener("mousemove" ,this.handlePieceDrag);
        window.removeEventListener("mouseup" ,this.handlePieceDrop);
        window.removeEventListener("pressmove" ,this.handlePieceDrag);
        window.removeEventListener("touchend" ,this.handlePieceDrop);
        this.listenersActive = false;
    }


    handlePieceGrab = ( position, mouseX, mouseY, tileWidth, tileHeight ) => {


        if(this.props.isSolving) return;
        this.props.grabTile(position, { x: mouseX, y: mouseY }, { w: tileWidth, h: tileHeight } )

    };

    handlePieceDrag = (e) => {

        const { dragStart , puzzleScale} = this.props;

        let offsetX = ( (e.pageX - window.scrollX) - dragStart.x ) / puzzleScale;
        let offsetY = ( (e.pageY - window.scrollY) - dragStart.y ) / puzzleScale;

        if(e.touches){
            let touch = e.touches[0];
            offsetX = ((touch.pageX - window.scrollX) - dragStart.x);
            offsetY = ((touch.pageY - window.scrollY) - dragStart.y);
        }

        this.props.dragTile( { x: offsetX, y: offsetY } )

    };

    handlePieceDrop = () => {

        const { dragIndex, dragOffset, dragArea } = this.props;

        let dropIndex = dragIndex;

        //make all dragging unnecessary until it has a home that won't scroll
        /*if(Math.abs(dragOffset.x) > dragArea.w/4 || Math.abs(dragOffset.y) > dragArea.h/4 ) {

            dropIndex = dragIndex;
        } else {

        }*/

        this.props.dropTile(dropIndex);
    };


    render(){

        const {gridSize, imgSrc, defaultImg, puzzleArea, gridStyle, containerStyle, displayType, tiles, dragIndex, dropIndex, dragOffset } = this.props;

        return(
            <div className ='grid-container' style={ containerStyle }>
                <Grid  tiles={ tiles } gridSize={ gridSize } onGrab={ this.handlePieceGrab } imgSrc={ imgSrc } defaultImg={ defaultImg } puzzleArea={ puzzleArea } containerSytle={ containerStyle } gridStyle={ gridStyle } dragIndex={ dragIndex } dropIndex={ dropIndex } dragOffset={ dragOffset } displayType={ displayType }/>
            </div>
        )
    }
}



const mapStateToProps = (state, ownProps) => {

    return {

        tiles: state.tiles,
        isSolving: state.isSolving,
        solution: state.solution,
        gridSize: state.gridSize,
        puzzleArea: state.puzzleArea,
        displayType: state.displayType,
        dragIndex: state.dragIndex,
        dragStart: state.dragStart,
        dragOffset: state.dragOffset,
        dragArea: state.dragArea,
        dropIndex: state.dropIndex,
        imgSrc: state.imgSrc,
        defaultImg: state.defaultImg,
        showNext: state.showNext,
        isShowingSolution: state.isShowingSolution,
        gridStyle: ownProps.gridStyle,
        containerStyle: ownProps.containerStyle
    }
}

const mapDispatchToProps = (dispatch) => {

    return {

        grabTile: (dragIndex,dragOffset,dragArea) => {

            dispatch(grabTile(dragIndex,dragOffset,dragArea))
        },

        dragTile: (dragOffset) => {

            dispatch(dragTile(dragOffset))
        },

        dropTile: (dragIndex,dragOffset,dragArea) => {

            dispatch(dropTile(dragIndex,dragOffset,dragArea))
        },

        startSolutionMove: (move, solution) => {

            dispatch(startSolutionMove(move, solution))
        },

        endSolutionMove: () => {

            dispatch(endSolutionMove());
        },

        solutionComplete: () => {

            dispatch(solutionComplete());
        }

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Puzzle);
