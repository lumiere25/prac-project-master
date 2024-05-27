import React, { useState } from 'react';
import Styles from "./login.module.css";
import { getAuth, signInWithEmailAndPassword, browserSessionPersistence, setPersistence } from "firebase/auth";
import { Auth } from '../Firebase'; // Make sure to import the Firebase auth object

const LogIn = ({ isOpen, onClose, onSignIn, onAppSignIn }) => {
  const [email, setEmail ] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

      const auth = getAuth();
      setPersistence(auth, browserSessionPersistence)
      .then(() => {
      return signInWithEmailAndPassword(Auth, email, password);
    })
        .then((userCredential) => {
        // Sign-in successful
        const user = userCredential.user;
        console.log('Login success:', user);
        console.log('user success:', onAppSignIn)
        onAppSignIn(formData.email);
        
        // Perform any post-login actions

        // This was the reason the filteredFriends variable was not executing when sigining into the app and instead was executing outside of the app.
        // onSignIn(user.email)
        onClose(); // Close the modal or login form
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Login failed:', errorCode, errorMessage);
        alert('Invalid email or password. Please try again or register if you have not already.');
      });
  };
  
  
 


  if (!isOpen) return null;

 
    return (
      <div className={Styles.form_overlay}>
        <form className={Styles.login_form}
         onSubmit={handleSubmit}>

       <div className={Styles.form_exit}>
          <button onClick={onClose}>X</button>
        </div>
        <div className={Styles.account_info}>    
        <h2> Your Friends are waiting!.🫂</h2>
        </div>
         
          <div>
            <label className={Styles.form_label}>Your Email:</label>
            <input className={Styles.form_input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className={Styles.form_label}> Your Password:</label>
            <input className={Styles.form_input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <button className={Styles.login_submit}  type="submit">Submit</button>
          </div>
        </form>
      </div>

    );
}

export default LogIn;