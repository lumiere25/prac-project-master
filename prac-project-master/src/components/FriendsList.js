import React from 'react';
import Friend from './Friend';


function FriendsList({friends, onSelectFriend, onRemoveFriend, selectedFriendId})  {

 
  
  //The map method executes the provided function once for each element in the array, in order, and constructs a new array from the results, which in this case is an array of `<Friend>` components. This array of components is then inserted into the `<ul>` (unordered list) element, thereby creating a list of friends on the UI.
    return (
     <ul>
   {friends.map((friend) => (
     <Friend friend={friend} 
     key={friend.uid} onSelectFriend={onSelectFriend} onRemoveFriend={onRemoveFriend}
     isSelected={friend.id === selectedFriendId} />
     
   ))}
     </ul>
   );
 }

 export default FriendsList;