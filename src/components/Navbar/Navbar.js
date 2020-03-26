import React from 'react';
import './Navbar.css';

const Navbar = ({onRouteChange,isSignedIn}) => {
    return(isSignedIn)?
    (<div className='nav'>
    <p onClick={() => onRouteChange('signout')} className='para'>Sign Out</p>
     </div>)
     :(
    <div className='nav'>
    <p onClick={() => onRouteChange('signout')} className='para'>Sign In</p>
    <p onClick={() => onRouteChange('register')} className='para'>Register</p>
    </div>);
}

export default Navbar;