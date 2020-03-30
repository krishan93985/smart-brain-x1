import React from 'react';

class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      updateName:this.props.user.name,
      updateEmail:this.props.user.email,
      updatePassword:''
    }
  }

  onNameChange = (event) => {
    this.setState({updateName:event.target.value})
  }

  onEmailChange = (event) => {
    this.setState({updateEmail:event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({updatePassword:event.target.value})
  }

  onUpdate = () => {
    const {updateEmail,updateName,updatePassword} = this.state;
    if(updateName && updateEmail && updatePassword)
    {
    fetch(`https://evening-castle-93461.herokuapp.com/profile/update/${this.props.user.id}`,{
      method:'put',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        name:updateName,
        email:updateEmail,
        password:updatePassword
      })
    }).then(response => response.json())
    .then(user => {
      if(user.id)
      {
      this.props.loadUser(user);
      this.props.onRouteChange('home');
      }
      else
      alert('Error Updating Profile!')
    })
    .catch(console.log);
  }
  else {
    alert('Can\'t Update with an empty field!')
  }
  }

  render(){
      const {name,email,entries,joined} = this.props.user;
    return(
      <article className="mt5 br3 ba b--black-10 shadow-5 mv4 w-100 w-50-m w-25-l mw6 center">
      <main className="pa4 black-80">
       <div className="measure">
         <fieldset className="ba b--transparent ph0 mh0">
           <legend className="f2 fw6 ph0 mh0">Profile</legend>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
             <input onChange={this.onNameChange} defaultValue={name} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name"/>
           </div>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
             <input onChange={this.onEmailChange} defaultValue={email} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
           </div>
           <div className="mv3">
             <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
             <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
           </div>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="entries">Entry Count</label>
             <p className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100">{entries}</p>
           </div>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="entries">Joining Date</label>
             <p className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100">{joined}</p>
           </div>
         </fieldset>
         <div>
           <input onClick={this.onUpdate} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Update"/>
         </div>
       </div>
     </main>
     </article>
         )
  }
   
}

export default Profile;