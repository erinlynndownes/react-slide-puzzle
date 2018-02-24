import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '../components/Grid'
import { grabTile, dropTile } from '../actionCreators'


class Puzzle extends Component{
    constructor(props){
        super(props);

        this.dragStart = null;
        this.dragOffset = null;

        this.handlePieceGrab = this.handlePieceGrab.bind(this);
        this.handlePieceDrop = this.handlePieceDrop.bind(this);
        this.handlePieceDrag = this.handlePieceDrag.bind(this);


    }

    componentWillMount(){
        //this.handleStartPuzzle(true);
    }


    componentDidUpdate(){

        //add listeners if drag triggered

        //remove listeners if drag stopped

    }

    componentWillUnmount(){
        //clear out listeners
    }


    handlePieceGrab = ( position, mouseX, mouseY, tileWidth, tileHeight ) => {

        console.log("grab piece!");
        if(this.props.isSolving) return;
        this.props.grabTile(position, { x: mouseX, y: mouseY }, { w: tileWidth, h: tileHeight} )
       // const g = this.state.gridModel.grabTile(position);


        /*if(g != null){

            this.dragStart = {x:mouseX,y:mouseY};
            this.setState({
                draggedPiece:position,
                droppedPiece:null,
                dragOffset:{x:0,y:0},
                dragWidth:tileWidth,
                dragHeight:tileHeight
            });

            window.addEventListener("touchmove" ,this.dragPiece);
            window.addEventListener("touchend" ,this.handlePieceDrop);
            window.addEventListener("mousemove" ,this.dragPiece);
            window.addEventListener("mouseup" ,this.handlePieceDrop);
        }*/


    };

    handlePieceDrag = (e) => {


        console.log("dragging piece!");

        /*let offsetX = ((e.pageX - window.scrollX) - this.dragStart.x) / this.props.puzzleScale;
        let offsetY = ((e.pageY - window.scrollY) - this.dragStart.y) / this.props.puzzleScale;

        if(e.touches){
            let touch = e.touches[0];
            offsetX = ((touch.pageX - window.scrollX) - this.dragStart.x);
            offsetY = ((touch.pageY - window.scrollY) - this.dragStart.y);
        }

        this.setState({

                dragOffset:{x:offsetX,y:offsetY}
            })
     */

    };

    handlePieceDrop = () => {
        //if(this.props.solving) return;

        /*window.removeEventListener("mousemove" ,this.dragPiece);
        window.removeEventListener("mouseup" ,this.handlePieceDrop);
        window.removeEventListener("pressmove" ,this.dragPiece);
        window.removeEventListener("touchend" ,this.handlePieceDrop);

        const d = this.state.draggedPiece;
        if(d != null){
            if(Math.abs(this.state.dragOffset.x) > this.state.dragWidth/2 || Math.abs(this.state.dragOffset.y) > this.state.dragHeight/2 ){
                this.inputMove(d);
            } else{
                this.setState({
                    draggedIndex:null,
                    droppedPiece:d
                })
            }
        }*/
    };


    render(){

        const {gridSize, imgSrc, puzzleArea, gridStyle, containerStyle, displayType, tiles, draggedPiece, droppedPiece, dragOffset} = this.props;


        return(
            <Grid  tiles={ tiles } gridSize={ gridSize } onGrab={ this.handlePieceGrab } src={imgSrc} puzzleArea={ puzzleArea } containerSytle={ containerStyle } gridStyle={ gridStyle } draggedIndex={draggedPiece} droppedIndex={ droppedPiece } dragOffset={ dragOffset } displayType={ displayType }/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        tiles: state.tiles,
        isSolving: state.isSolving,
        gridSize: state.gridSize,
        puzzleArea: state.puzzleArea,
        displayType: state.displayType,
        dragIndex: state.dragIndex,
        dropIndex: state.dropIndex,
        dragOffset: state.dragOffset,
        gridStyle: ownProps.gridStyle,
        containerStyle: ownProps.containerStyle

    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        grabTile: (dragIndex,dragOffset,dragArea) => {
            dispatch(grabTile(dragIndex,dragOffset,dragArea))
        },
        dropTile: (dragIndex,dragOffset,dragArea) => {
            dispatch(dropTile(dragIndex,dragOffset,dragArea))
        },


    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Puzzle);
