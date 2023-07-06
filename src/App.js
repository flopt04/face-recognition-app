import './App.css';
import Logo from './components/Navigation/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import { Component } from 'react';


const returnClarifaiRequestOptions =(imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '820003041c104f668b2e93b74ce51ef4';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'mecls';       
  const APP_ID = 'test';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

 const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};
return requestOptions;
}


class App extends Component {
  constructor() {
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {},
      route: 'home',
      isSignedIn: false
    }
  }
calculateFaceLocation=(data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) =>{
this.setState({box:box})
}
  onInputChange = (event)=>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() =>{
this.setState({imageUrl: this.state.input});

fetch("https://api.clarifai.com/v2/models/" + 'face-detection' +  "/outputs", returnClarifaiRequestOptions)
.then(response => response.json())
  .then(response => {
  console.log('hi', response)
  if (response) {
    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id
      })
    })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count}))
      })

   }
   this.displayFaceBox(this.calculateFaceLocation(response))
})
.catch(err => console.log(err));
  }

  onRouteChange = (route)=>{
    if(route === 'signout'){
      this.setState({isSignedIn: false});
    }else if(route ==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route: route});

  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
       <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
       { this.state.route === 'home' 
       ?<div>
       <Logo/>
       <Rank/>
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
       <FaceRecognition box={box} imageUrl={imageUrl}/>
       </div>
       
       :(
       route === 'signin' ?
        <Signin onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
       )

       }
      </div>
    );
  }
}

export default App;
