import React, { useContext, useEffect, useState } from 'react'
import './chatbox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'


const Chatbox = () => {
  const { userData, messagesId, chatUser, messages, setMessages,chatVisible, setChatVisible } = useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })

        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {            //to check if userChat is available
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
    setInput("");
  }

  const sendImage = async (e) => {
    try {

      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        })


        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {            //to check if userChat is available
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
            userChatData.chatsData[chatIndex].lastMessage = "image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData
            })
          }
        })

      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const convertTimeStamp = (timestamp) => {    // function to convert and set your timestamp
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    //const second = date.getSeconds();

    if (hour > 12) {
      return hour - 12 + ":" + minute.toString().padStart(2, "0") + "PM";

    }
    else {
      return hour + ":" + minute + "AM";
    }

  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data().messages.reverse())
        console.log(res.data().messages)

      })
      return () => {
        unSub();
      }
    }

  }, [messagesId])

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden" }`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 7000 ? <img src={assets.dot_green} className='dot' alt="" /> : null}  </p> 

        <img src={assets.help} alt="" />
        <img onClick={() => setChatVisible(false)} src={assets.arrow} className='arrow' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"]
              ? <img className='msg-img' src={msg.image} alt="" />
              : <p className="msg">{msg.text} </p>
            }

            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}


        {/* <div className="s-msg">      senders message 
          <img className='msg-img' src={assets.image_dogs} alt="" />
          <div>
            <img  src={assets.nature} alt="" />
            <p>2:50 PM</p>
          </div>
        </div>

        <div className="r-msg">      receivers message 
          <p className="msg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, odit voluptatem. </p>
          <div>
            <img src={assets.nature} alt="" />
            <p>2:40 PM</p>
          </div>
        </div> */}

      </div>






      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg, image/jpg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send} alt="" />
      </div>
    </div>
  )
    : <div className={`chat-welcome ${chatVisible ? "" : "hidden" }`}>
      <img src={assets.chief_logo_main} alt="" />
      <p>ChiefGram! Chat like a Chief </p>
    </div>
}

export default Chatbox