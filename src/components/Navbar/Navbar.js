import React from 'react';
import './Navbar.css';

const Navbar= ({onRouteChange,route,onDelete}) =>  {
        return(route==='home')?
    (<div className='navigation'>
    <p onClick={() => onRouteChange('home')} className='para'>Home</p>
    <p onClick={() => onRouteChange('profile')} className='para'>Profile</p>
    <p onClick={() => onRouteChange('signout')} className='para'>Sign Out</p>
    </div>)
    :(route==='profile')?
    (<div className='navigation'>
    <p onClick={() => onRouteChange('home')} className='para'>Home</p>
    <p onClick={onDelete} className='para' style={{color:'red'}}>Remove Account</p>
    <p onClick={() => onRouteChange('signout')} className='para'>Sign Out</p>
    </div>)
    :
    (<div className='navigation'>
    <p onClick={() => onRouteChange('signout')} className='para'>Sign In</p>
    <p onClick={() => onRouteChange('register')} className='para'>Register</p>
    </div>)
}



export default Navbar;