import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({url,faceArray,facekey}) => {
    return(
       <div className='center ma3'>
          <div className='absolute'>
          <img alt='' src={url} width='450px' height='auto' id='pic'/>
        {
        faceArray.map(face => 
        <div className='detectedBox' key={facekey++}
        style={{top:face.topRow, bottom:face.bottomRow, left:face.leftCol, right:face.rightCol}}></div>
        )
        }
          </div>
       </div>
    );
}

export default FaceRecognition;