import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tile extends Component{

    grabHandler = (e) => {

        let el = this.refs.tile;
        let offset = {x:0,y:0};
        while (el)
        {
            offset.x += el.offsetLeft;
            offset.y += el.offsetTop;
            el = el.offsetParent;
        }

        console.log("grab x: " + e.clientX);

        if(e.nativeEvent && e.nativeEvent.touches){
            console.log("got touches?" + e.nativeEvent.touches[0].clientX);
            console.dir(e.nativeEvent.touches);
        }

        const grabX = (e.nativeEvent && e.nativeEvent.touches) ? e.nativeEvent.touches[0].clientX : e.clientX;
        const grabY = (e.nativeEvent && e.nativeEvent.touches) ? e.nativeEvent.touches[0].clientY : e.clientY;
        this.props.onGrab(this.props.index,grabX,grabY,offset.x,offset.y);
    };


    componentDidUpdate(){
        if(this.props.dropped){
            this.props.moveCompleteHandler();
        }

    }


    render(){
        const {imgSrc, width, height, indexPos, curPos, visible, dragged,dropped,} = this.props;



        const tileStyle = {
            width:`${width}px`,
            height:`${height}px`,
            backgroundImage: `url(${imgSrc})`,
            backgroundPosition: `${-indexPos.x}px ${-indexPos.y}px`,
            visibility:`${visible}`,

            transition:`left 0.5s ease-out, top 0.5s ease-out`,

            top:`${curPos.y}px`,
            left:`${curPos.x}px`,


        };

        const droppedStyle = {
            width:`${width}px`,
            height:`${height}px`,
            backgroundImage: `url(${imgSrc})`,
            backgroundPosition: `${-indexPos.x}px ${-indexPos.y}px`,
            visibility:`${visible}`,
            top:`${curPos.y}px`,
            left:`${curPos.x}px`,
        };

        const draggedStyle = {

            width:`${width}px`,
            height:`${height}px`,
            backgroundImage: `url(${imgSrc})`,
            backgroundPosition: `${-indexPos.x}px ${-indexPos.y}px`,
            visibility:`${visible}`,
            top:`${curPos.y}px`,
            left:`${curPos.x}px`,
            //transform:`translate(${draggedOffset.x}px,${draggedOffset.y}px)`

        };
        //return div, set image background and position
        const tileClass = "Tile";
        const s = (dropped === true || dragged === true) ? droppedStyle : tileStyle;



        return(
            <div className={tileClass} style={s} onMouseDown={this.grabHandler} onTouchStart={this.grabHandler} ref="tile">
                <div className="TileTxt">
                    {this.props.id}
                </div>

            </div>
        )


    }
}

Tile.propTypes = {

    index:PropTypes.number.isRequired,
    curPos:PropTypes.object.isRequired,
    imgSrc:PropTypes.string

};


export default Tile;