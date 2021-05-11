import React from 'react';
import './SignIn.css';

class SignIn extends React.Component{
  constructor(props){
    super();
    this.state = {
      signInEmail:'',
      signInPassword:''
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail:event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword:event.target.value});
  }

  keyPress = (event) => {
    const submit_btn = document.querySelector("#submit-btn");
    if(event.charCode === 13 && this.state.signInEmail && this.state.signInPassword)
      submit_btn.click();
  }

  onSignIn = (event) => {
    event.preventDefault();
    const { target } = event;
    if(!this.state.signInEmail || !this.state.signInPassword){
      alert('Email or Password is empty!');
      return;
    }
    target.disabled = true;
    this.props.setLoading(true);    
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/signin`,{
      method:'post',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        email:this.state.signInEmail,
        password:this.state.signInPassword
      })
    }).then(response => response.json())
    .then(data => {
      if(data.userId && data.success){
        this.props.saveAuthTokenInLocalStorage(data.token);
        this.props.getUserProfile(data.userId);
      }
      else{
        alert('Error Signing in!');
      }
      this.props.setLoading(false);
    }
    ).catch(err => {
      this.props.setLoading(false);
      alert('Error Signing In!')
    });
    target.disabled = false;
  }

  render(){
    return(
      <article className="br3 ba b--black-10 shadow-5 mv4 w-50-m w-25-l mw6 center custom_signin">
      <main className="pa4 black-80">
       <div className="measure">
         <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
           <legend className="f2 fw6 ph0 mh0">Sign In</legend>
           <div className="mt3">
             <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
             <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 focus-black" type="email" name="email-address"  id="email-address" autoComplete="off" onKeyPress={this.keyPress}/>
           </div>
           <div className="mv3">
             <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
             <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 focus-black" type="password" name="password"  id="password" onKeyPress={this.keyPress}/>
           </div>
         </fieldset>
         <div style={{display:"flex",justifyContent:'center',alignItems:'center'}}>
           <input id="submit-btn" onClick={this.onSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in"/>
         </div>
         <div className="lh-copy mt3 pointer">
           <p onClick={() => this.props.onRouteChange('register')} className="f5 link dim black db">Register</p>
         </div>
       </div>
     </main>
     </article>
         )
  }
  
}

export default SignIn;