import React from 'react';

const GameUi = props => (

    <div className="nav" style={props.navStyle}>
        <button onClick={props.imageClick} style={props.buttonStyle}>{props.otherType}</button>
        <button onClick={props.solveClick} style={props.buttonStyle}>Solve</button>
        <button onClick={props.newClick} style={props.buttonStyle}>New</button>
        <button onClick={props.sizeClick} style={props.buttonStyle}>{props.otherSize} puzzle</button>

    </div>

);

export default GameUi;