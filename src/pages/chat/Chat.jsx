import React, { useContext, useEffect, useState } from 'react'
import './chat.css'
import LeftSidebar from '../../components/leftSidebar/LeftSidebar';
import Chatbox from '../../components/chatBar/Chatbox';
import RightSidebar from '../../components/rightSidebar/RightSidebar';
import { AppContext } from '../../context/AppContext';

const Chat = () => {
  const {chatData, userData} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }

  }, [chatData, userData]);

  return (
    <div className='chat' >
      {
        loading 
        ? <p className='loading'>Loading...</p>
        :   <div className="chat-container">
        <LeftSidebar />
        <Chatbox />
        <RightSidebar/>
      </div>
      }
    
    </div>
    
  )
}

export default Chat