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

        const grabX = (e.nativeEvent && e.nativeEvent.touches) ? e.nativeEvent.touches[0].clientX : e.clientX;
        const grabY = (e.nativeEvent && e.nativeEvent.touches) ? e.nativeEvent.touches[0].clientY : e.clientY;
        this.props.onGrab(this.props.index,grabX,grabY,this.props.width,this.props.height);
    };


    componentDidUpdate(){
        if(this.props.dropped){
            this.props.moveCompleteHandler();
        }
    }


    render(){
        const {imgSrc, width, height, indexPos, curPos, visible, dragged,dropped, display, matched} = this.props;

        const tileStyle = {
            width:`${width}px`,
            height:`${height}px`,
            backgroundImage: (display === "image") ? `url(${imgSrc})` : `none`,
            backgroundPosition: `${-indexPos.x}px ${-indexPos.y}px`,
            backgroundColor: (matched) ? `white` : `gainsboro`,
            visibility:`${visible}`,
            transition:`left 0.1s ease-out, top 0.1s ease-out`,
            top:`${curPos.y}px`,
            left:`${curPos.x}px`,


        };

        const droppedStyle = {
            width:`${width}px`,
            height:`${height}px`,
            backgroundImage: (display === "image") ? `url(${imgSrc})` : `none`,
            backgroundPosition: `${-indexPos.x}px ${-indexPos.y}px`,
            backgroundColor: (matched) ? `white` : `gainsboro`,
            visibility:`${visible}`,
            top:`${curPos.y}px`,
            left:`${curPos.x}px`,
        };

        //return div, set image background and position
        const tileClass = "Tile";
        const s = (dropped === true || dragged === true) ? droppedStyle : tileStyle;

        const txtStyle = {
            opacity: (display === 'image') ? `0` : `1`
        };

        return(
            <div className={tileClass} style={s} onMouseDown={this.grabHandler} onTouchStart={this.grabHandler} ref="tile">
                <div className="TileTxt" style={txtStyle}>
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