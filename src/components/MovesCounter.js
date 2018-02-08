import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MovesCounter extends Component{

    render(){

        return (
            <div className="counter">
                <p>no.of moves:</p>
                <p className="moveNumber">{this.props.movesCount}</p>

            </div>
        )
    }
}

export default MovesCounter;