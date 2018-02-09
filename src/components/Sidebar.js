import React, { Component } from 'react';
import SolvingAnim from './SolvingAnim';
import gitmark from '../images/GitHub-Mark-64px.png';

class Sidebar extends Component{

    render(){

        const giturl = "https://github.com/erinlynnlouise/react-slide-puzzle";

        return (
            <div className="sidebar">
                <SolvingAnim solving={this.props.solving}/>
                <figure >
                    <a href={giturl}  className="gitlink" target="_blank">
                        <img alt='github logo' src={gitmark}/>
                        <figcaption>See on github</figcaption>
                    </a>

                </figure>

            </div>
        )
    }
}

export default Sidebar;