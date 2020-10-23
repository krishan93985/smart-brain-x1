import React, { useState } from 'react';
import { Dropdown,
      DropdownToggle,
      DropdownMenu, 
      DropdownItem } from 'reactstrap';
import './ProfileIcon.css';

const ProfileIcon = ({toggleProfile, revokeUserSession})  =>  {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return(
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle 
            tag="span"
            data-toggle="dropdown"
            aria-expanded={dropdownOpen}
        >
          <img
            src="https://tachyons.io/img/logo.jpg"
            className="br-100 ba h3 w3 dib" alt="avatar"
            style={{cursor:"pointer", marginTop:'0.5rem'}}/>
        </DropdownToggle>
        <DropdownMenu className="b--transparent shadow-5 dropdown"
            style={{marginTop:'-40px',
            backgroundColor:'rgba(255,255,255,0.7)'}} right>
            <DropdownItem onClick={toggleProfile}>View Profile</DropdownItem>
            <DropdownItem onClick={revokeUserSession}>Sign Out</DropdownItem>
        </DropdownMenu>
        </Dropdown>
    )
    
}

export default ProfileIcon;