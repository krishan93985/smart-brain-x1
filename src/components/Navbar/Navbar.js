import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';
import './Navbar.css';

const Navbar= ({onRouteChange,route,toggleProfile,revokeUserSession,profileUrl}) =>  {
    return(route==='home')?
    (<div className='navigation'>
        <ProfileIcon toggleProfile={toggleProfile} revokeUserSession={revokeUserSession} onRouteChange={onRouteChange} profileUrl={profileUrl}/>
    </div>)
    :
    (<div className='navigation' id="touch-conf" >
        <p onClick={() => onRouteChange('signout')} className='para'>Sign In</p>
        <p onClick={() => onRouteChange('register')} className='para'>Register</p>
    </div>)
}



export default Navbar;