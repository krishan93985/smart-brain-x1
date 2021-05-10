import React,{useState,useEffect} from 'react';
import './UploadProfile.css';
import addIcon from './add.png';
import subtractIcon from './subtract.png';

const UploadProfile = ({uploadProfileImage, toBase64Url, removeProfileImage, defaultProfileImg, profilePicUploadPending, profilePicRemovePending}) => {
    const [imageOptions,setImageOptions] = useState(false);
    const [iconSrc,setIconSrc] = useState(addIcon);
    useEffect(() => {
        var remove_btn = document.getElementById('remove-profile');
        if(!defaultProfileImg && remove_btn){
            remove_btn.disabled = false;
        } else if(remove_btn){
            remove_btn.disabled = true;
        }
        if(imageOptions) setIconSrc(subtractIcon)
        else setIconSrc(addIcon)
    },[defaultProfileImg,imageOptions])

    const toggleImageOptions = () => {
        setImageOptions(prevOptions => !prevOptions)
    }

    const loadFile = (event) => {
        if(event.target.files[0]){
        var img = document.getElementById("dummy-img");
        img.src = URL.createObjectURL(event.target.files[0]);
        }
    }

    return(
        <div className="profile-options">
        <div><img src={iconSrc} alt='add-icon' className="add-icon grow" onClick={toggleImageOptions}/> Configure Profile Image</div>
        {imageOptions &&
            <div className="image-options">
        <label htmlFor="profile-image" ></label>
        <input name="profile-image" type="file" accept="image/*" onChange={loadFile} id="profile-image"/>
        <img alt='dummy' hidden id="dummy-img" onLoad={toBase64Url}/>
        <div className="profile-actions">
            <button className="b pa2 pointer w-40 b--black-20 br-none ma1 grow btn_color" onClick={uploadProfileImage} id="upload-profile touch-conf" >
            { profilePicUploadPending ? <div className="extended-loader-wrapper"><div className="loader extended-loader"></div></div> : "Upload"}
            </button>
            <button className="b pa2 pointer w-40 ma1 b--black-20 br-none grow bg-light-red" onClick={removeProfileImage} id="remove-profile touch-conf">
            { profilePicRemovePending ? <div className="extended-loader-wrapper"><div className="loader extended-loader"></div></div>:"Remove"}
            </button>
        </div></div>
        }   
        </div>
    );
}

export default UploadProfile;