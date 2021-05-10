import React from 'react';
import Logo from '../Logo/Logo';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm';
import Rank from '../Rank/Rank';
import FaceRecognition from '../FaceRecognition/FaceRecognition';

const Home = ({user,imageUrl,faceArray,onInputChange,onButtonSubmit,detectFacesPending}) => {
    return(
        <div className="">
      <Logo/>
      <Rank name={user.name} entries={user.entries}/>
      <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} detectFacesPending={detectFacesPending}/>
      <FaceRecognition url={imageUrl} faceArray={faceArray} facekey={user.id}/>
        </div>
    );
}

export default Home;