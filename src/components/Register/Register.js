import React from 'react';
import './Register.css';

class Register extends React.Component{
  constructor(props){
    super();
    this.state = {
      registerName:'',
      registerEmail:'',
      registerPassword:''
    }
  }

  onNameChange = (event) => {
    this.setState({registerName:event.target.value})
  }

  onEmailChange = (event) => {
    this.setState({registerEmail:event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({registerPassword:event.target.value})
  }

  onRegister = () => {
    if(!this.state.registerName || !this.state.registerEmail || !this.state.registerPassword){
      alert('Cannot Register an empty user!');
      return;
    }
    fetch('https://smart-brain-x1-dockerize.herokuapp.com/register',{
      method:'post',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        name:this.state.registerName,
        email:this.state.registerEmail,
        password:this.state.registerPassword
      })
    }).then(response => response.json())
    .then(data => {
      if(data.userId && data.success){
        this.props.saveAuthTokenInLocalStorage(data.token);
        this.props.getUserProfile(data.userId);
      }
      else
        alert('Cannot Register an Empty user!')
    })
    .catch(console.log);
  }

  render(){
    return(
      <article className="br3 ba b--black-10 shadow-5 mv4 w-50-m w-25-l mw6 center width-over">
      <main className="pa4 black-80">
       <div className="measure">
         <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
           <legend className="f2 fw6 ph0 mh0">Register</legend>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
             <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 focus-black" type="text" name="name"  id="name" autoComplete="off"/>
           </div>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
             <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 focus-black" type="email" name="email-address"  id="email-address" autoComplete="off"/>
           </div>
           <div className="mv3">
             <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
             <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 focus-black" type="password" name="password"  id="password"/>
           </div>
         </fieldset>
         <div className="">
           <input onClick={this.onRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
         </div>
       </div>
     </main>
     </article>
         )
  }
   
}

export default Register;