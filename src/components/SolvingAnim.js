import React, { Component } from 'react';
import gear1 from "../images/small-gear.png";
import gear2 from "../images/big-gear.png";

class SolvingAnim extends Component{



    render(){

        //move gears with solving;
        const gearclass = (this.props.solving) ? "gearsmoving" : "gears";
        //hide show txt with solving;
        const txtClass = {
            opacity: (this.props.solving) ? `1` : `0`,
            color:`white`,

        };

        return (
            <div className="solveInfo">
                <div className={gearclass}>
                    <img alt='big gear' src={gear2} />
                    <img alt='small gear' src={gear1} />
                    <p style={txtClass}>Solving...</p>

                </div>


            </div>
        )

    }


}

export default SolvingAnim;