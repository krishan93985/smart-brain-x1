import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange,onButtonSubmit,detectFacesPending}) => {
    const keyPress = (event) => {
        const btn = document.querySelector("#detect-faces");
        if(event.charCode === 13) btn.click();
    }

    return(
       <div>
           <p className='f4'>
             This Magic Brain will detect faces in your pictures.Give it a try.
           </p>
           <div className='center'>
           <div className='form center pa4 br3 shadow-5'>
               <input type='search' className='f4 pa2 w-70 center' onChange={onInputChange} placeholder='Enter url (publically accessible image)' onKeyPress={keyPress}/>
               <button id="detect-faces" className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>
               {detectFacesPending?
               <div className="extended-loader-wrapper">
                    <div className="loader extended-loader"></div>
               </div> : "Detect"}
               </button>
           </div>
           </div>
       </div>
    );
}

export default ImageLinkForm;