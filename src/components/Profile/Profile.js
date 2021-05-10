import React, {useState} from "react";
import UploadProfile from "../UploadProfile/UploadProfile";
import "./Profile.css";

const Profile = ({ toggleProfile, user, loadUser, onDelete, profileUrl, uploadProfileImage, toBase64Url, removeProfileImage, defaultProfileImg, profilePicUploadPending, profilePicRemovePending }) => {
  const [name,setUserName] = useState(user.name);
  const [age,setUserAge] = useState(user.age);
  const [pet,setPetName] = useState(user.pet);
  const [profileSavePending,setProfileSavePending] = useState(false);

  const updateUserProfile = (event,data) => {
    if(!name){
      return alert('Name Cannot Be Empty!');
    }
    const {target} = event;
    event.preventDefault();
    setProfileSavePending(true);
    target.disabled = true;
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/profile/${user.id}`, {
      method:'put',
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${window.localStorage.getItem('token')}`
      },
      body:JSON.stringify({
        formInput:{
        name,
        age,
        pet
        }
      })
    }).then(response => response.json())
    .then(response => {
        if(response === 'success'){
          const updatedUser = Object.assign(user,data);
          loadUser(updatedUser); //or simply pass {...user,...data}
          toggleProfile();
        } else if(response === 'Unauthorized')
            this.props.onRouteChange('signout')
          else
            alert('Unable to update profile!')
        setProfileSavePending(false);
        target.disabled = false;
    })
    .catch(err => alert('Unable to update profile!'))
  }

  return (
    <div className="profile-modal">
    <div className="contain">
      <article className="pa-left br3 ba b--black-10 shadow-5 mv4 w-50-m w-30-l center bg-white">
        <main className="pa4 black-80 control-width">
          <img
            src={profileUrl}
            className="ba h3 w3 dib profile-image"
            alt="avatar"
          />
          <UploadProfile uploadProfileImage={uploadProfileImage} toBase64Url={toBase64Url} removeProfileImage={removeProfileImage} defaultProfileImg={defaultProfileImg} profilePicRemovePending={profilePicRemovePending} profilePicUploadPending={profilePicUploadPending}/>
          <h1 style={{overflow:"hidden"}}>{name}</h1>
          <hr className="separate-profile"/>
          <h5>Images Submitted: {user.entries}</h5>
          <h5>Member Since: {new Date(user.joined).toLocaleDateString()}</h5>
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <label className="mt2 fw6" htmlFor="user-name">
                Name
              </label>
              <input
                onChange={(event) => setUserName(event.target.value)}
                className="pa2 ba w-100"
                type="text"
                placeholder={name}
                name="user-name"
                id="user-name"
                maxLength="40"
                autoComplete="off"
              />
              <label className="mt2 fw6" htmlFor="age">
                Age
              </label>
              <input
                onChange={(event) => setUserAge(event.target.value)}
                className="pa2 ba w-100"
                type="text"
                name="age"
                id="age"
                maxLength="3"
                placeholder={user.age}
                autoComplete="off"
              />
              <label className="mt2 fw6" htmlFor="pet-name">
                Pet
              </label>
              <input
                onChange={(event) => setPetName(event.target.value)}
                className="pa2 ba w-100"
                type="text"
                name="pet-name"
                id="pet-name"
                maxLength="30"
                placeholder={user.pet}
              />
              <div className="mt4" style={{ display:'flex', justifyContent:'space-evenly'}}>
                <button id="save_btn touch-conf" className="b pa2 grow pointer hover-white w-40 b--black-20 br-none btn_color"
                  onClick={(event) => updateUserProfile(event,{name,age,pet})}>
                  { profileSavePending ? <div className="extended-loader-wrapper"><div className="loader extended-loader"></div></div>:"Save"}
                </button>
                <button onClick={toggleProfile} id="touch-conf"  className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20 br-none">
                  Cancel
                </button>
              </div>
              <div className="mt4" style={{ display:'flex', justifyContent:'space-evenly'}}>
                <button onClick={onDelete} id="touch-conf" className="b pa1 grow pointer hover-white w-50 bg-red b--black-20 br-none">
                <div><span style={{ color:'yellow' }} >&#9888;</span> Remove Account</div>
                </button>
              </div>
            </fieldset>
        </main>
        <span className="modal-close" onClick={toggleProfile} >&times;</span> 
      </article>
    </div>
    </div>
  );
};

export default Profile;
