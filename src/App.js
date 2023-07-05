import './App.css';
import Logo from './components/Navigation/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecgonition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
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
    }
  }
calculateFaceLocation=(data)=>{
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);

}
  onInputChange = (event)=>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit =() =>{
this.setState({imageUrl: this.state.input});

    app.models.predict('face-detection', this.state.input)
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

  render(){
    return (
      <div className="App">
       <Navigation/>
       <Logo/>
       <Rank/>
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
       <FaceRecgonition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
 
}

export default App;
