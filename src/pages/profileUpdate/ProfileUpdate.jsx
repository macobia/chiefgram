import React, { useContext, useEffect, useState } from 'react'
import './profileUpdate.css'
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

// const ProfileUpdate = () => {

//   const navigate = useNavigate();
//   const [image, setImage] = useState(false);
//   const [name, setName] = useState('');
//   const [bio, setBio] = useState("");
//   const [uid, setUid] = useState("");
//   const [prevImage, setPrevImage] = useState();

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData} = useContext(AppContext)

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image){
        toast.error("Upload profile pic")

      }
      const docRef = doc(db, 'users', uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage (imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          name: name,
          bio: bio, 
        })
      }
      else{
        await updateDoc(docRef, {
          name: name,
          bio: bio, 
        })

      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error(error)
      toast.error(error.message);
    }

  } 

  useEffect(() => {
    onAuthStateChanged(auth, async (user) =>{
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if ( docSnap.data().name) {
          setName(docSnap.data().name);
        
        } 
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        
        } 
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
        
      }
      else  {
        navigate('/')
      }
    })

  }, [])




  // const profileUpdate = async (event) => {
  //   event.preventDefault();
  //   try {
  //     if (!prevImage && !image) {
  //       toast.error("Upload profile pic");
  //       return;
  //     }

  //     const docRef = doc(db, "users", uid);

  //     if (image) {
  //       const imgUrl = await upload(image, uid); // Upload to Supabase
  //       if (!imgUrl) throw new Error("Image upload failed");

  //       setPrevImage(imgUrl);
  //       await updateDoc(docRef, {
  //         avatar: imgUrl,
  //         name,
  //         bio,
  //       });
  //     } else {
  //       await updateDoc(docRef, {
  //         name,
  //         bio,
  //       });
  //     }

  //     toast.success("Profile updated successfully!");
  //   } catch (error) {
  //     console.error("Profile update failed:", error);
  //     toast.error("Profile update failed!");
  //   }
  // };

  

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUid(user.uid);
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const data = docSnap.data();
  //         setName(data.name || "");
  //         setBio(data.bio || "");
  //         setPrevImage(data.avatar || ""); // Fixed typo "avartar" → "avatar"
  //       }
  //     } else {
  //       navigate("/");
  //     }
  //   });
  // }, []);
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg, .webp' hidden/>
            <img src={image ? URL.createObjectURL(image) : assets.avatar} alt="" />
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value) } value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e) => setBio (e.target.value)} value={bio} placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.chief_logo_main} alt="" />
      </div>
    </div>
  
  )
}

export default ProfileUpdate