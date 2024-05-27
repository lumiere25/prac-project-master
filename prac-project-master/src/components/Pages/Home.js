import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../modal/Modal';
import LogIn from '../LogIn';
import InitialFriends from "../../data/InitialFriends";
import FriendsList from '../FriendsList';
import Messaging from "../Messaging";
import FormAddFriend from "../FormAddFriend";
import Button from '../Button';
import Styles from './home.module.css'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Auth } from "../../Firebase";
import { getDatabase, ref, push, onChildAdded, off, set, remove, onValue } from 'firebase/database';
import { serverTimestamp } from 'firebase/database';
import { get } from 'firebase/database';

const generateConversationId = (uid1, uid2) => {
  const ids = [uid1, uid2].sort();
  const conversationId = ids.join('_');
  console.log( `generated conversationId: ${conversationId}`);
  return conversationId;

}

const Home = ({ isAuthenticated, setIsAuthenticated, handleAppSignIn  }) => {

  const [showFormAddFriend, setShowFormAddFriend ] = useState
  (false);
  const [friends, setFriends ] = useState(InitialFriends);
  const [ showAddFriend, setShowAddFriend ] = useState(false);
  const [selectedFriendId, setSelectedFriendId ] = useState(null);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);

  
  const [ messages, setMessages ] = useState({});
  
  const [userEmail, setUserEmail ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userUID, setUserUID] = useState(null);
  const [isModalOpen, setIsModalOpen ] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading ] = useState(true);

  // Register/Login states
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);




  const handleRegister = (email, password) => {
    createUserWithEmailAndPassword(Auth, email, password)
    .then((userCredential) => {
      // Registration successful
      console.log('user registered:' , userCredential.user);
      onSignIn(userCredential.user);
      setIsModalOpen(false);
    })
    .catch((error) => {
      alert("Email already registered, please log in");
      /* There is an error (I believe coding error where I shouldn't be getting error on the password */
      console.error('Registration error:', error);
      alert(error.message);
    })

};
 

   

  
  // Calling the find method, searches the friends array and matches id to specific friend.
  const selectedFriend = friends.find(friend => friend.id === selectedFriendId);
  
  // Function where we pass the id and update the state variable to the id

  // Here we set a function that we will use to remove a friend.
  const handleRemoveFriend = (friendId) => {
    setFriends((prevFriends) => prevFriends.filter( friend => friend.id !== friendId));

  }
  


  const handleSendMessage = useCallback((messageContent, friendUID) => {
    console.log(`about to send a message..`, { messageContent, friendUID });
    console.log(`logging userUID...`, userUID);
  
    const conversationId = generateConversationId(userUID, friendUID);
  
    // Ensure that we have all the needed IDs.
    if (selectedFriendId && conversationId) {
      // Correct the path to include the 'messages' node.
      const messagesRef = ref(getDatabase(), `messages/${selectedFriendId}`);
  
      // Push the new message content to Firebase
      push(messagesRef, {
        text: messageContent,
        senderId: userUID,
        // Use serverTimestamp for consistency
        timestamp: serverTimestamp(),
      }).then((reference) => {
        console.log("Message sent to Firebase", reference);
      }).catch((error) => {
        console.error("Error sending message:", error);
      });
    }
  }, [selectedFriendId, userUID]); // Include both dependencies



  
  const handleSelectFriend = (friendId) => {
    // Look for the friend in the local InitialFriends array
    let friend = friends.find(friend => friend.id === friendId);
    
    if (friend) {
      // Friend found locally
      const conversationId = generateConversationId(userUID, friend.uid);
      setSelectedFriendId(conversationId);
    } else {
      // If not found locally, check Firebase
      const db = getDatabase();
      const friendRef = ref(db, `friends/${friendId}`);
      onValue(friendRef, (snapshot) => {
        const firebaseFriend = snapshot.val();
        if (firebaseFriend && firebaseFriend.uid) {
          const conversationId = generateConversationId(userUID, firebaseFriend.uid);
          setSelectedFriendId(conversationId);
        } else {
          console.error('Friend not found');
        }
      }, { onlyOnce: true });
    }
  };
  



// setIsAuthenticated needed to be true so the userUID could be defined
useEffect(() => {
  const unsubscribe = Auth.onAuthStateChanged((user) => {
    if (user) {
      setUserEmail(user.email);
      setUserUID(user.uid);
      setIsAuthenticated(true);
    } else {
      setUserUID(null);
      setUserEmail("");
      setIsAuthenticated(false);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, [setIsAuthenticated]);


  
  function handleShowAddFriend()  {
    setShowFormAddFriend((show) => !show);
  }
  


  function handleAddFriend(newFriend) {
    // First, check that all friend properties are defined.
    if (!newFriend.name || !newFriend.email || !newFriend.uid) {
      console.error('All friend details must be defined.');
      return;
    }
  
    // Add friend to local state first
    setFriends((prevFriends) => [...prevFriends, newFriend]);
    setShowAddFriend(false);

   
  
    // Then add friend to Firebase Realtime Database
    const db = getDatabase();
    const friendsRef = ref(db, 'friends');

    const newFriendRef = push(friendsRef);
    set(newFriendRef, {
    
      name: newFriend.name,
      email: newFriend.email,
      image: "https://i.pravatar.cc/48",
      uid: newFriend.uid,

    
     
    })
    .then(() => {
      console.log('Friend added to Firebase!');
    })
    .catch((error) => {
      console.error('Error adding friend to Firebase:', error);
    });
  }
  useEffect(() => {
    if (!selectedFriendId) {
      setMessages({});
      return;
    }
  
    const messagesRef = ref(getDatabase(), `messages/${selectedFriendId}`);
  
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      console.log("test...");
      const newMessageData = snapshot.val();
      const newMessageKey = snapshot.key;
  
      if (typeof newMessageData === 'object' && newMessageData !== null) {
        newMessageData.id = newMessageKey; // Assign the Firebase key as the 'id'
  
        setMessages((prevMessages) => {
          // Check if the message is already in the state to avoid duplicates
          const messagesForCurrentFriend = prevMessages[selectedFriendId] || [];
          if (messagesForCurrentFriend.some(message => message.id === newMessageKey)) {
            return prevMessages; // If the message is already present, do not update the state
          }
          // If it's a new message, add it to the state
          return {
            ...prevMessages,
            [selectedFriendId]: [...messagesForCurrentFriend, newMessageData],
          };
        });
      }
    });
  
    // Cleanup the listener when the component unmounts or selectedFriendId changes
    return () => off(messagesRef, 'child_added', unsubscribe);
  }, [selectedFriendId]);
  
 
  



  const handleDeleteMessage = useCallback((messageId) => {
    // Reference the correct conversation ID
    const messageRef = ref(getDatabase(), `messages/${selectedFriendId}/${messageId}`);
  
    // Remove the message from Firebase
    remove(messageRef)
      .then(() => {
        // Also remove the message from the local state
        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          const friendMessages = updatedMessages[selectedFriendId] || [];
          const messageIndex = friendMessages.findIndex(message => message.id === messageId);
          if (messageIndex > -1) {
            friendMessages.splice(messageIndex, 1);
            updatedMessages[selectedFriendId] = friendMessages;
          }
          return updatedMessages;
        });
        console.log("Message successfully deleted", messageId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }, [selectedFriendId, setMessages]);
  

 
  
  

  
  const onSignIn = (user) => {
    console.log(user);
    setUserEmail(user.email);
    setUserUID(user.uid);
    setIsAuthenticated(true);
  };

  

 
 if(loading) {
  return <div>Loading...</div>
 }

 const filteredFriends = friends.filter(friend => friend.email !== userEmail);



  // Content of the Home component when not logged in
 // If login successful, Ternary Operator returns the App.
return (
    !isAuthenticated ? (
      <div className={Styles.landing_Container}>
        <div className={Styles.child_texts}>
        <h1>Welcome to Chat-Station!</h1>
        <p>The home where friendships start</p>
      </div>
        <form className={Styles.homeform}>
          <h2>Don't have an account?</h2>
          <button type="button" onClick={openModal}>Create an Account now!</button>
          <h2>Already have an account?</h2>
          <button type="button" onClick={openForm} >Sign In</button>
        </form>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSignIn={handleRegister}
            setIsAuthenticated={setIsAuthenticated}
          />
 
          <LogIn
            isOpen={isFormOpen}
            onClose={closeForm}
            onSignIn={onSignIn}
            onAppSignIn={handleAppSignIn}

         
    
          />
     
      </div>
    ) : (
      <div className= {Styles.flex_container}>
        <div className={Styles.sidebar}>
          <FriendsList friends={filteredFriends} onSelectFriend={(friendUid) => handleSelectFriend(friendUid)} onRemoveFriend={handleRemoveFriend} selectedFriendId={selectedFriendId} />
          {showFormAddFriend && <FormAddFriend  onAddFriend={handleAddFriend} />}
          <Button onClick={handleShowAddFriend}>{showFormAddFriend ? 'Close' : 'Add Friend'}</Button>
        </div>
        <div className={Styles.messaging}>
           <Messaging
            currentMessages={messages[selectedFriendId]|| []}
            onSendMessage={(messageContent, friendUID) => handleSendMessage(messageContent, friendUID)}
            selectedFriendName={selectedFriend ? selectedFriend.name : ""}
            onDeleteMessage={handleDeleteMessage}
            selectedFriendUID={selectedFriendId}
            userUID={userUID}
            
          />
        </div>
      </div>

    )
   )

 
 }  


export default Home;