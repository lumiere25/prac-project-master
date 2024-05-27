import React from 'react';
import logo from '../assets/CHAT__STATION (1).png';
import Styles from "./navbar.module.css";



const Navbar =({ loggedInEmail, onLogout})  => {


   return (
     
        <nav className="col-md-4 navbar">
          <div className={Styles.navbar_logo}>
            <img className={Styles.logo} src={logo} alt="CHAT STATION"/>
            </div>

            <div className={Styles.email_sub}>
                <p>Signed in as {loggedInEmail}</p>
            </div>

            <div>
                <button className={Styles.logout} onClick={onLogout}>
                 Log Out
                </button>

            </div>
        </nav>

    );
}

export default Navbar;
