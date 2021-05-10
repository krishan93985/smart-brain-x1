import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return(
        <Tilt className="Tilt">
        <div className="Tilt-inner"> <img alt='icon' src={brain}/> </div>
        </Tilt>
    );
}

export default Logo;