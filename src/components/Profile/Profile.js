import React, {useState} from "react";
import "./Profile.css";

const Profile = ({ toggleProfile, user, loadUser, onDelete }) => {
  const [name,setUserName] = useState(user.name);
  const [age,setUserAge] = useState(user.age);
  const [pet,setPetName] = useState(user.pet);

  const updateUserProfile = (data) => {
    if(!name){
      return alert('Name Cannot Be Empty!');
    }

    fetch(`https://smart-brain-x1-dockerize.herokuapp.com/profile/${user.id}`, {
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
    })
    .catch(err => alert('Unable to update profile!'))
  }

  return (
    <div className="profile-modal">
      <article className="pa-left br3 ba b--black-10 shadow-5 mv4 w-50-m w-30-l center bg-white">
        <main className="pa4 black-80 control-width">
          <img
            src="https://tachyons.io/img/logo.jpg"
            className="ba h3 w3 dib"
            alt="avatar"
          />
          <h1 style={{overflow:"hidden"}}>{name}</h1>
          <h4>Images Submitted: {user.entries}</h4>
          <p>Member Since: {new Date(user.joined).toLocaleDateString()}</p>
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
                <button className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20 br-none"
                  onClick={() => updateUserProfile({name,age,pet})}>
                  Save
                </button>
                <button onClick={toggleProfile} className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20 br-none">
                  Cancel
                </button>
              </div>
              <div className="mt4" style={{ display:'flex', justifyContent:'space-evenly'}}>
                <button onClick={onDelete} className="b pa1 grow pointer hover-white w-50 bg-light-red b--black-20 br-none">
                  <span style={{ color:'yellow' }} >&#9888;</span> Remove Account
                </button>
              </div>
            </fieldset>
        </main>
        <span className="modal-close" onClick={toggleProfile} >&times;</span> 
      </article>
    </div>
  );
};

export default Profile;
