import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import GridModel from "../libs/GridModel";

//model
//grid

class Puzzle extends Component{
    constructor(props){
        super(props);

        this.dragStart = null;
        this.dragOffset = null;

        this.state = {
            gridModel:null,
            complete:false,
            draggedPiece:null,
            droppedPiece:null

        };

    }

    componentWillMount(){
        this.handleStartPuzzle(true);
    }


    componentWillReceiveProps(nextProps){

        //trigger new
        if(nextProps.new && !this.props.new){
            this.buildNewPuzzle(nextProps.rowsize);

        }

        //trigger hint
        if(nextProps.forceMove && !this.props.forceMove){
            this.showNextMove();
        }
        //trigger solve
        if(nextProps.isSolving && !this.props.isSolving){
            this.solvePuzzle();
        }

    }

    handleStartPuzzle = (elem) => {
        console.log("start puzzle");
        //also called with null on unmount
        if(elem) this.buildNewPuzzle(this.props.rowsize);
    };

    buildNewPuzzle = (size) => {
        console.log("build new: " + this.props);
        console.dir(this.props);
        this.setState(getNewModel(size),this.props.afterUpdate);

    };

    showNextMove = () => {
        //get solution if none
        if(!this.state.gridModel.solution) this.state.gridModel.getSolution();

        //let nextMove = this.state.gridModel.solution.unshift();
        //this.inputMove(nextMove);
        //this.props.afterUpdate();


    };

    solvePuzzle = () => {
        //delay...make next move
        console.log("solve puzzle");
        if(!this.state.gridModel.solution) this.state.gridModel.getSolution();
    };

    handlePieceGrab = (position, mouseX, mouseY, tileX, tileY) => {
        if(this.props.solving) return;
        const g = this.state.gridModel.grabTile(position);


        if(g != null){

            this.dragStart = {x:mouseX,y:mouseY};
            this.setState({
                draggedPiece:position,
                droppedPiece:null,
                dragOffset:{x:0,y:0},
            });



            window.addEventListener("touchmove" ,this.dragPiece);
            window.addEventListener("touchend" ,this.handlePieceDrop);
            window.addEventListener("mousemove" ,this.dragPiece);
            window.addEventListener("mouseup" ,this.handlePieceDrop);
        }
        //set state dragged/ dropped

    };

    dragPiece = (e) => {


        let offsetX = e.pageX - this.dragStart.x;
        let offsetY = e.pageY - this.dragStart.y;

        if(e.touches){
            let touch = e.touches[0];
            offsetX = touch.pageX - this.dragStart.x;
            offsetY = touch.pageY - this.dragStart.y;
        }


        this.setState({
                dragOffset:{x:offsetX,y:offsetY}
            })
    ;

    };

    handlePieceDrop = () => {
        //if(this.props.solving) return;

        window.removeEventListener("mousemove" ,this.dragPiece);
        window.removeEventListener("mouseup" ,this.handlePieceDrop);
        window.removeEventListener("pressmove" ,this.dragPiece);
        window.removeEventListener("touchend" ,this.handlePieceDrop);

        if(this.props.touchEnabled){

        }else{

        }

        const d = this.state.draggedPiece;
        if(d != null){
            //check current position to move to blank or back

            //if near blank
            //dropped piece is new position (position of blank before move);

            //else
            //dropped piece is former dragged

            //this.setState(setDragDropState(null,d));
            this.inputMove(d);
        }
        //set state dragged/ dropped

    };

    completePieceDrop = () =>{
        /*this.setState({
            draggedPiece:null,
            droppedPiece:null
        });*/
        const ref = this;
        const dropTimeout = setTimeout(()=>{
            ref.setState(setDragDropState(null,null));
        },1);

    };



    handleClick = (position) => {

        if(this.props.solving) return;

        this.inputMove(position);

    };

    inputMove = (position) => {
        //input move to grid model
        let p = this.state.gridModel.moveTile(position);

        //if valid move get new tile state
        if(p !== null){
            //set state with new tiles or complete
            let t = this.state.gridModel.getTiles();
            //this.setState(setTileState(t))
            //call move counter from props
            this.setState({
                tiles:t,
                draggedIndex:null,
                droppedPiece:p
            })
        }

    };



    render(){

        const {rowsize, src, width, height, puzzlescale, puzzleAreaWidth, puzzleAreaHeight} = this.props;
        const {gridModel,tiles, draggedPiece, droppedPiece, dragOffset} = this.state;

        //console.dir(this.state);

        if(!gridModel || !tiles){
            //init start up

            return (
                <div>Not there yet...</div>

            )
        }else{

            //render puzzle grid, get tileset and current positions from model
            return(
                <div className="grid-container" style={this.props.containerStyle}>
                  <Grid sequence={tiles} onGrab={this.handlePieceGrab} onDrop={this.handlePieceDrop} onComplete={this.completePieceDrop} src={src} gridsize={rowsize} width={width} height={height} gridscale={puzzlescale} areaWidth={puzzleAreaWidth} areaHeight={puzzleAreaHeight} draggedIndex={draggedPiece} droppedIndex={droppedPiece} dragOffset={dragOffset}/>
                </div>
            )
        }
    }

}

const getNewModel = (size) => {

    console.log("get new model??" + size);
    let m = new GridModel(size);
    let t = m.getTiles();

    console.log("what are the tiles? " + t);

    return function update(state){
        return{
            gridModel:m,
            tiles:t,
            complete:false,
            moves:0,
        }

    }
};

const setTileState = (tiles) => {


    return function update(state){
        return{
            tiles:tiles,
        }

    }
};

const setDragDropState = (dragged,dropped) => {

    return function update(state){
        return{
            draggedPiece:dragged,
            droppedPiece:dropped
        }
    }
};

export default Puzzle;

Puzzle.propTypes = {
    rowsize:PropTypes.oneOf([3,4]).isRequired,
    src:PropTypes.string.isRequired
};
