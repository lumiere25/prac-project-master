import React from 'react';


// Quite often we will need buttons throughout the UI, in this case we can place the <button> element within it's own component:
  
  
  // Here we are using the <button> element within a Button component.
  // The children prop becomes the 'select' text within the button tags.

function Button({children, onClick}) {
    return (
    <button className="button" onClick={onClick}>{children}</button>
    );
  }

  export default Button;