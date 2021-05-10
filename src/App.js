import React, {lazy,Suspense} from 'react';
import './App.css';
import Particles from 'react-tsparticles';
import Navbar from './components/Navbar/Navbar';
import SignIn from './components/SignIn/SignIn';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';
import Loader from './components/Loader/Loader';
import url from './components/Profile/profile.png';
const Register = lazy(() => import('./components/Register/Register'));
const Home = lazy(() => import('./components/Home/Home'));

const Options ={
  fpsLimit:60,
  particles:{
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#add8e6",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 6,
      straight: false,
    },
    number:{
    value:60,
    density:{
      enable:true,
      value_area:700
    }
    }
  }
}

const initialState = {   //Better way for multiple users in a huge app
  input:'',
  imageUrl:'',
  base64ProfileImgUrl:'',
  faceArray:[],
  route:'',
  isProfileOpen: false,
  defaultProfileImg:true,
  detectFacesPending:false,
  profilePicUploadPending:false,
  profilePicRemovePending:false,
  isLoading:false,
  user:{
    id:'',
    name:'',
    email:'',
    password:'',
    entries:0,
    joined:'',
    pet:'',
    age:'',
    profileUrl:url
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
      fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/signin`,{
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
      this.onRouteChange('home');
    }
  }

  particlesInIt(main){

  }

  particlesLoaded(container){

  }

  getUserProfile = (userId) => {
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/profile/${userId}`, {
      method:'get',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${window.localStorage.getItem('token')}`
      }
    }).then(res => res.json())
    .then(user => {
      if(user.email && user.id){
        var newUser = {};
        if(user.profileurl){
          newUser = Object.assign(user,{profileUrl:user.profileurl})
          this.setState({defaultProfileImg:false});
        }else{
          newUser = Object.assign(user,{profileUrl:url});
        }
          this.loadUser(newUser);
      }
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
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/signout/${this.state.user.id}`, {
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

  setLoading = (value) => {
    this.setState({isLoading:value});
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


   setFacePending = (value) => {
     this.setState({detectFacesPending:value});
   }

  onButtonSubmit = (event) => {
    event.preventDefault();
    const { target } = event;
    this.checkImageExists(this.state.input,(imageExists) => {
      if(imageExists){
        this.setFacePending(true);
        target.disabled = true;
      this.setState({imageUrl:this.state.input},() => this.setState({faceArray:[]}));
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/imageurl`,{
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
      console.log(response)
      const DATA = response.outputs && response.outputs[0].data;
      if(response.outputs)
      {
        fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/image`,{
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
        this.setFacePending(false);
        target.disabled = false;
        
  })   
    .catch(error => alert('Enter a valid img'));
    }
    else {
      alert('Invalid image Url!')
    }
  })
    }

  deleteUser = (event) => {
    event.preventDefault();
    if(window.confirm('Are you Sure you want to remove Account!!'))
    {
        fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/profile/delete/${this.state.user.id}`,{
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

    
    getMime = () => {
      const profile = document.getElementById("profile-image");
      var files = profile.files;
      var blob = files[0];
      var type = blob.type;
      
      var fileReader = new FileReader();
      var header = "";
      fileReader.onloadend = (e) => {
      var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
      for(var i = 0; i < arr.length; i++)
      header += arr[i].toString(16);
    }
    console.log(header);
    switch (header) {
        case "89504e47":
            type = "image/png";
            break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            type = "image/jpeg";
            break;
        case '47494638':
            type = "image/gif";
            break;
        default:
            type = blob.type;
            break;
          }
          return type;
    }
    
    getDataUrl = (img) => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Set width and height
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image
      ctx.drawImage(img, 0, 0);
      const mime = this.getMime();
      return canvas.toDataURL(mime);
    }
    
    toBase64Url = (event) => {
      const dataUrl = this.getDataUrl(event.currentTarget);
      console.log(dataUrl)
      this.setState({base64ProfileImgUrl:dataUrl});
    }
    
    setProfilePicUploadPending = (value) => this.setState({profilePicUploadPending:value});
    setProfilePicRemovePending = (value) => this.setState({profilePicRemovePending:value});

    uploadProfileImage = (event) => {
      event.preventDefault();
      if(!this.state.base64ProfileImgUrl) return;
      
      const { target } = event;
      this.setProfilePicUploadPending(true);
      target.disabled = true;
      fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/upload_profile_img/${this.state.user.id}`,{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${window.localStorage.getItem('token')}`
        },
        body:JSON.stringify({
          profileUrl:this.state.base64ProfileImgUrl
        })
      }).then(response => response.json())
      .then(response => {
        if(response.url){
          console.log(response.url)
          const updatedUser = Object.assign(this.state.user,{profileUrl:response.url});
          this.setState({defaultProfileImg:false});
          this.loadUser(updatedUser);
          this.toggleProfile();
        } else{
          alert('Cannot upload profile!')
        }
        this.setProfilePicUploadPending(false);
        target.disabled = false;
      }).catch(err => alert('Cannot upload Profile!'))
      
      
    }

    removeProfileImage = (event) => {
      event.preventDefault();
      const { target } = event;
      this.setProfilePicRemovePending(true);
      target.disabled = true;
      
      fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/delete_profile_img/${this.state.user.id}`,{
        method:'delete',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${window.localStorage.getItem('token')}`
        }
      }).then(res => res.json())
      .then(response => {
        if(response.success){
          var updatedUser = Object.assign(this.state.user,{profileUrl:initialState.user.profileUrl})
          this.setState({defaultProfileImg:true});
          this.loadUser(updatedUser);
          this.toggleProfile();
        } else alert('Unable to remove profile Picture!')
          this.setProfilePicRemovePending(false);
          target.disabled = false;
      })
    }

  render(){
    const { imageUrl,faceArray,route,user,isProfileOpen,defaultProfileImg,profilePicRemovePending,profilePicUploadPending,detectFacesPending, isLoading} = this.state;
  return (
    <div className="App">
      { route !== '' && (<div>
        <Particles className='particles'
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={Options}/>
        <Navbar onRouteChange={this.onRouteChange} route={route} toggleProfile={this.toggleProfile} revokeUserSession={this.revokeUserSession} profileUrl={user.profileUrl}/>
      </div>)
      }
      { isProfileOpen &&
      <Modal>
        <Profile toggleProfile={this.toggleProfile} user={user} loadUser={this.loadUser} onDelete={this.deleteUser} profileUrl={user.profileUrl} uploadProfileImage={this.uploadProfileImage} toBase64Url={this.toBase64Url} removeProfileImage={this.removeProfileImage} defaultProfileImg={defaultProfileImg} profilePicRemovePending={profilePicRemovePending} profilePicUploadPending={profilePicUploadPending}/>
      </Modal>
      }
      {route === 'signout'?
      <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} getUserProfile={this.getUserProfile} saveAuthTokenInLocalStorage={this.saveAuthTokenInLocalStorage} isLoading={isLoading} setLoading={this.setLoading}/>
     : (route === 'register')?
     <Suspense fallback={<Loader/>}>
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} getUserProfile={this.getUserProfile} saveAuthTokenInLocalStorage={this.saveAuthTokenInLocalStorage} defaultUrl={this.state.user.profileUrl} isLoading={isLoading} setLoading={this.setLoading} />
     </Suspense>
     :(route === 'home')?
      <Suspense fallback={<Loader/>}>
        <Home imageUrl={imageUrl} detectFacesPending={detectFacesPending} user={user} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} faceArray={faceArray}/> 
      </Suspense>
      : null
      }
    </div>
  );
  }
}

export default App;
