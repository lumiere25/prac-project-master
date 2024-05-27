import React from "react";
import Button from './Button';
import "./friend.module.css";



function Friend({ friend, onSelectFriend, onRemoveFriend, isSelected })  {

 
 
    return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
  
       <div className="button-container">
      <Button onClick={() => onSelectFriend(friend.id)} className={isSelected ? 'selected' : ''}>Select</Button>
      <Button onClick={() => onRemoveFriend(friend.id)}>Remove</Button>
      </div>
    </li>
  
    );
  }
  
 export default Friend;