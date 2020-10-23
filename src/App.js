import React from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navbar from './components/Navbar/Navbar';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';

const parameters={
  particles:{
    number:{
    value:80,
    density:{
      enable:true,
      value_area:800
    }
    }
  }
}

const initialState = {   //Better way for multiple users in a huge app
  input:'',
  imageUrl:'',
  faceArray:[],
  route:'',
  isProfileOpen: false,
  user:{
    id:'',
    name:'',
    email:'',
    password:'',
    entries:0,
    joined:'',
    pet:'',
    age:''
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state=initialState;
  }

  componentDidMount = () => {
    const token = window.localStorage.getItem('token');
    if(token){
      fetch('https://smart-brain-x1-dockerize.herokuapp.com/signin', {
        method:'post',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      }).then(res => res.json())
      .then(data => {
        if(data && data.userId)
          this.getUserProfile(data.userId);
        else{
          this.onRouteChange('signout');
          this.removeAuthToken();
        }
      }).catch(() => {
        this.onRouteChange('signout');
        this.removeAuthToken();
       })
    } else{
      this.onRouteChange('signout');
    }
  }

  getUserProfile = (userId) => {
    fetch(`https://smart-brain-x1-dockerize.herokuapp.com/profile/${userId}`, {
      method:'get',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${window.localStorage.getItem('token')}`
      }
    }).then(res => res.json())
    .then(user => {
      if(user.email && user.id)
          this.loadUser(user);
      else{
          this.onRouteChange('signout')
          this.removeAuthToken();
        }
    }).catch(() => {
       this.onRouteChange('signout');
       this.removeAuthToken();
      })
  }

  revokeUserSession = () => {
    fetch(`https://smart-brain-x1-dockerize.herokuapp.com/signout/${this.state.user.id}`, {
      method:'delete',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${window.localStorage.getItem('token')}`
      }
    }).then(res => res.json())
    .then(data => {
      if(data.success){
        this.removeAuthToken();
        this.onRouteChange('signout');
      }
    }).catch(err => this.onRouteChange('signout'))
  }

  removeAuthToken = () => window.localStorage.getItem('token')
                         && window.localStorage.removeItem('token');

  saveAuthTokenInLocalStorage = (token) => {
    window.localStorage.setItem('token',token);
  }

  loadUser = (data) => {
    this.setState({user:data},() => {
      return this.onRouteChange('home');
    });
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }
  
  toggleProfile = () => {
    this.setState(prevState => ({
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  onRouteChange = (route) => {
    if(route === 'signout')
      this.setState(initialState)

    this.setState({route:route});
  }

  calculateFaceBox = (regions) => {
    const faces = regions.map(face => {
    const data = face.region_info.bounding_box;
    const image = document.getElementById('pic');
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      topRow:height * data.top_row,
      bottomRow:height - (height * data.bottom_row),
      leftCol:width * data.left_col,
      rightCol:width - (width * data.right_col)
    }
  });
    this.setState({faceArray:faces});
  }
   
  checkImageExists = (url,callBack) => {
     let image = new Image();
     image.onload = () => {
       callBack(true);
     }
     image.onerror = () => {
       callBack(false);
     }
     image.src = url;
   }

  onButtonSubmit = () => {
    this.checkImageExists(this.state.input,(imageExists) => {
      if(imageExists){
      this.setState({imageUrl:this.state.input},() => this.setState({faceArray:[]}));
    fetch('https://smart-brain-x1-dockerize.herokuapp.com/imageurl',{
      method:'post',
      headers:{
        'Content-type':'application/json',
        'Authorization':`Bearer ${window.localStorage.getItem('token')}`
      },
      body:JSON.stringify({
        input:this.state.input
      })
    }).then(response => response.json())
    .then(response => {
      const DATA = response.outputs && response.outputs[0].data;
      if(response.outputs)
      {
        fetch('https://smart-brain-x1-dockerize.herokuapp.com/image',{
        method:'put',
        headers:{
          'Content-type':'application/json',
          'Authorization':`Bearer ${window.localStorage.getItem('token')}`
        },
        body:JSON.stringify({
        id:this.state.user.id
        }) 
        })
      .then(resp => resp.json())
      .then(resp => this.setState(Object.assign(this.state.user,{entries:resp})))
      .catch(error =>console.log(error));
      }
      if(DATA && DATA.regions)
        this.calculateFaceBox(DATA.regions)
      else
        alert('Enter a valid img')
  })   
    .catch(error => alert('Enter a valid img'));
    }
    else {
      alert('Invalid image Url!')
    }
  })
    }

  deleteUser = () => {
    if(window.confirm('Are you Sure you want to remove Account!!'))
    {
        fetch(`https://smart-brain-x1-dockerize.herokuapp.com/profile/delete/${this.state.user.id}`,{
        method:'delete',
        headers:{
          'Content-type':'application/json',
          'Authorization':`Bearer ${window.localStorage.getItem('token')}`
        }
      }).then(response => response.json())
      .then(message => {
        if(message==='success' || message==='Unauthorized'){
          this.onRouteChange('signout');
          this.removeAuthToken();
        }
        else
          alert('Unable to Remove Account!')
      })
      .catch(console.log);
    }
    }

  render(){
    const { imageUrl,faceArray,route,user,isProfileOpen} = this.state;
  return (
    <div className="App">
      { route !== '' && (<div>
        <Particles className='particles' params={parameters}/>
        <Navbar onRouteChange={this.onRouteChange} route={route} toggleProfile={this.toggleProfile} revokeUserSession={this.revokeUserSession} />
      </div>)
      }
      { isProfileOpen &&
      <Modal>
        <Profile toggleProfile={this.toggleProfile} user={user} loadUser={this.loadUser} onDelete={this.deleteUser} />
      </Modal>
      }
      {route === 'signout'?
      <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} getUserProfile={this.getUserProfile} saveAuthTokenInLocalStorage={this.saveAuthTokenInLocalStorage} />
     : (route === 'register')?
     <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} getUserProfile={this.getUserProfile} saveAuthTokenInLocalStorage={this.saveAuthTokenInLocalStorage} />
     :(route === 'home')?<div>
      <Logo/>
      <Rank name={user.name} entries={user.entries}/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition url={imageUrl} faceArray={faceArray} facekey={user.id}/>
      </div> : null
      }
    </div>
  );
  }
}

export default App;
