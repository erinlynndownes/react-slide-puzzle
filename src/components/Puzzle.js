import React, { Component } from 'react';
import Grid from './Grid';
import GridModel from "../libs/GridModel";


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
        //also called with null on unmount
        if(elem) this.buildNewPuzzle(this.props.rowsize);
    };

    buildNewPuzzle = (size) => {

        this.setState(getNewModel(size),this.props.afterUpdate);
    };

    showNextMove = () => {
        //get solution if none
        if(!this.state.gridModel.solution) this.state.gridModel.getSolution();

        if(!this.moves || this.moves.length <= 0){
            this.props.solveComplete();
            this.state.gridModel.solution = null;

        }else{
            let nextMove = this.moves.shift();
            this.inputMove(nextMove);
            //this.props.afterUpdate();
            const ref = this;
            this.solveTimer = setTimeout(()=>{
                ref.showNextMove();
            },300);

        }



    };

    solvePuzzle = () => {
        if(!this.state.gridModel.solution) this.state.gridModel.getSolution(this.handleSolution);



    };

    handleSolution = (solution) => {

        this.moves = solution;

        const ref = this;
        this.solveTimer = setTimeout(()=>{
            ref.showNextMove();
        },300);
    };

    handlePieceGrab = (position, mouseX, mouseY, tileWidth, tileHeight) => {
        if(this.props.solving) return;
        const g = this.state.gridModel.grabTile(position);


        if(g != null){

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
        }


    };

    dragPiece = (e) => {


        let offsetX = (e.pageX - this.dragStart.x) / this.props.puzzleScale;
        let offsetY = (e.pageY - this.dragStart.y) / this.props.puzzleScale;

        if(e.touches){
            let touch = e.touches[0];
            offsetX = (touch.pageX - this.dragStart.x);
            offsetY = (touch.pageY - this.dragStart.y);
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
        }
    };

    completePieceDrop = () =>{

        const ref = this;
        const s = setTimeout(()=>{
            ref.setState(setDragDropState(null,null));
        },1);

    };

    inputMove = (position) => {
        //input move to grid model
        let p = this.state.gridModel.moveTile(position);

        //if valid move get new tile state
        if(p !== null){
            //set state with new tiles or complete
            let t = this.state.gridModel.getTiles();

            this.setState({
                tiles:t,
                draggedIndex:null,
                droppedPiece:p,
            })
        }
    };

    render(){

        const {rowsize, src, width, height, puzzleScale, gridStyle, containerStyle, displayType} = this.props;
        const {gridModel,tiles, draggedPiece, droppedPiece, dragOffset} = this.state;

        if(!gridModel || !tiles){
            //init start up

            return (
                <div>Not there yet...</div>

            )
        }else{

            //render puzzle grid, get tileset and current positions from model
            return(
                <div className="grid-container" style={containerStyle}>
                  <Grid sequence={tiles} onGrab={this.handlePieceGrab} onDrop={this.handlePieceDrop} onComplete={this.completePieceDrop} src={src} gridsize={rowsize} width={width} height={height} gridscale={puzzleScale} gridStyle={gridStyle} draggedIndex={draggedPiece} droppedIndex={droppedPiece} dragOffset={dragOffset} displayType={displayType}/>
                </div>
            )
        }
    }
}

const getNewModel = (size) => {

    let m = new GridModel(size);
    let t = m.getTiles();

    return function update(state){
        return{
            gridModel:m,
            tiles:t,
            complete:false,
            moves:0,
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
