import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SolvingAnim from './SolvingAnim';
import MovesCounter from './MovesCounter';
import gitmark from '../images/GitHub-Mark-64px.png';

class Sidebar extends Component{



    render(){

        const giturl = "https://github.com/erinlynnlouise/react-slide-puzzle";

        return (
            <div className="sidebar">
                <SolvingAnim solving={this.props.solving}/>

                <a href={giturl} target="_blank">
                <figure>

                    <img src={gitmark}/>
                    <figcaption>See on github.</figcaption>

                </figure>
                </a>
            </div>
        )
    }
}

export default Sidebar;