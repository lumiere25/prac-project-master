import React, { useState } from 'react';
import Button from './Button';


function Messaging({ currentMessages, onSendMessage,selectedFriendName, onDeleteMessage, selectedFriendUID, userUID})  {
  console.log(`Rendering messages for conversation ID ${selectedFriendUID}:`, currentMessages);
    const [ newMessage, setNewMessage ]  = useState('');
  
      const handleSend = () => {
        if (newMessage.trim()) {
          onSendMessage(newMessage.trim(), selectedFriendUID);
          setNewMessage('');
        }
      };
  
      


    return (
      <div className='msg_container'>
          <ul className="message-list">
           {currentMessages.length === 0 ? (
            <div className="list">Say Something to {selectedFriendName}...</div>
          ) : (
            // Renders messages only if they are in the correct format.
            // Prevents entire object render
          currentMessages.map((msg, index) => (
            typeof msg === 'object' && msg.text ? (
            <div key={msg.id} className="message-item">
              <div className={`message_text ${msg.senderId === userUID ? "my-message" : "other-message"}`}>{msg.text}</div>
               <button className="fas fa-trash-alt delete-icon" onClick={() => onDeleteMessage(msg.id)}></button>
             </div>
            ) : null
          ))
          )}
        </ul>
  
        <div className="message-input">
          <input
            type="text"
            id="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button className='msg_btn' onClick={handleSend}>Send</Button>
        </div>
      </div>
    );
  }

  export default Messaging;