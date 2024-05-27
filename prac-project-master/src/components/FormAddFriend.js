 import React, { useState } from 'react';
 import Button from './Button';
 import Styles from "./formaddfriend.module.css";
  
  
  
  // display and hide this form based on a state variable.
 
  // Function handles the form to add a friend.
  function FormAddFriend({onAddFriend}) {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ image, setImage ]  = useState("https://i.pravatar.cc/48");
  
    function handleSubmit(e) {
      e.preventDefault();
  
      if( !name || !email || !image ) return;
  
      const id = crypto.randomUUID();
      const uid = crypto.randomUUID();
      const newFriend = {
        id,
        name,
        email,
        uid,
        image: `https://i.pravatar.cc/48?u=${id}`,
        
      };
      onAddFriend(newFriend);
  
      setName("");
      setEmail("");
      setImage("https://i.pravatar.cc/48");
    }
    
  
  
  
    return (
      
      <div>
      <form className={Styles.form_add_friend} onSubmit={handleSubmit}>
        <label>Friend name</label>
        <input type="text" value={name}  onChange={(e) => setName(e.target.value)}/>
        <label>Friend Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <label>Image URL</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
  
        <Button>Add</Button>
  
      </form>
      </div>
    );
  }

  export default FormAddFriend;
  