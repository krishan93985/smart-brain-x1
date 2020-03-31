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
  route:'signout',
  user:{
    id:'',
    name:'',
    email:'',
    password:'',
    entries:0,
    joined:''
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state=initialState;
  }

  loadUser = (data) => {
    this.setState({user:data});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }
  
  onRouteChange = (route) => {
    if(route === 'signout')
    this.setState(initialState)
    else if(route === 'profile')
    {
      fetch(`https://evening-castle-93461.herokuapp.com/profile/${this.state.user.id}`,{
        method:'get',
        headers:{'Content-type':'application/json'}
      }).then(response => response.json())
      .then(user => {
        if(user.id)
        this.loadUser(user);
        else
        alert('Cannot Get Profile!')
      })
      .catch(console.log);
    }
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
      this.setState({imageUrl:this.state.input});
    fetch('https://evening-castle-93461.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({
        input:this.state.input
      })
    }).then(response => response.json())
    .then(response => {
      console.log(response)
      const DATA = response.outputs[0].data;
      if(response)
      {
        fetch('https://evening-castle-93461.herokuapp.com/image',{
        method:'put',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({
        id:this.state.user.id
     }) 
    })
    .then(resp => resp.json())
    .then(resp => this.setState(Object.assign(this.state.user,{entries:resp})))
    .catch(error =>console.log(error));
      }
    if(DATA.regions)
    this.calculateFaceBox(DATA.regions)
    else{
      this.setState({faceArray:[]})
    } 
  })   
    .catch(error => { this.setState({faceArray:[]});console.log(error)});
    }
    else {
      alert('image Url does not exist!')
    }
  })
    }

  deleteUser = () => {
    if(window.confirm('Are you Sure you want to remove Account!!'))
    {
        fetch(`https://evening-castle-93461.herokuapp.com/profile/delete/${this.state.user.id}`,{
        method:'delete',
        headers:{'Content-type':'application/json'},
      }).then(response => response.json())
      .then(message => {
        if(message==='success')
        {
        this.onRouteChange('signout');
        alert('Account Removed');
        }
        else
        alert('Unable to Remove Account!')
      })
      .catch(console.log);
    }
    }

  render(){
    const { imageUrl,faceArray,route,user} = this.state;
  return (
    <div className="App">
      <Particles className='particles' params={parameters}/>
      <Navbar onRouteChange={this.onRouteChange} route={route} onDelete={this.deleteUser}/>
      {route === 'signout'?
      <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
     : (route === 'register')?
     <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
     :(route === 'profile')?
     <Profile user={user}  loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
     :<div>
      <Logo/>
      <Rank name={user.name} entries={user.entries}/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition url={imageUrl} faceArray={faceArray} facekey={user.id}/>
      </div>
      }
    </div>
  );
  }
}

export default App;
