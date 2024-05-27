import React, { useState, useEffect } from 'react';
import Styles from './modal.module.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Auth } from "../../Firebase";

const Modal = ({ isOpen, onClose, onSignIn, isAuthenticated, setIsAuthenticated}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    console.log(formData)
    createUserWithEmailAndPassword(Auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('user logged in:' , userCredential.user);
      onSignIn(formData.user);
      // Reset the state so user does not get signed into app automatically
      setIsAuthenticated("");
   
      //reflect that user is logged in
      onClose();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Check for email duplication error:
      if(errorCode === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account');
      } else {
        alert(errorMessage);
      }
    });

  }


  

  if (!isOpen) return null;

  // Display message if the user is already registered
  if (isRegistered) {
    return (
      <div className={Styles.modal_overlay}>
        <div className={Styles.modal}>
          <div>You have already registered! Please log in.</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className={Styles.modal_overlay}>
      <div className={Styles.modal}>
        <div className={Styles.emoji}>
          😀
        </div>
        <form className={Styles.modal_form} onSubmit={handleSubmit}>
          <div className={Styles.form_exit}>
            <button onClick={onClose}>X</button>
          </div>
          <div className={Styles.account_info}>    
            <h2>Don't have an account? Register Today!</h2>
          </div>
          
       <div>
          <label className={Styles.form_label}>First Name:</label>
          <input className={Styles.form_input}
            type="text"
            id=  "firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className={Styles.form_label}>Last Name:</label>
          <input className={Styles.form_input}
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className={Styles.form_label}>Email:</label>
          <input className={Styles.form_input}
            type="email"
            id = "email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className={Styles.form_label}>Password:</label>
          <input className={Styles.form_input}
            type="password"
            id=  "password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

          <div>
            <button className={Styles.modal_submit} type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;




