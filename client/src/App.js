import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/Login.js";
import CreateAccount from "./pages/CreateAccount.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Chat from "./pages/Chat.js";
import Settings from "./pages/Settings.js";
import Listings from "./pages/Listings.js";
import IndividualChat from "./pages/IndividualChat.js";
import "./App.css";

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element= {<Navigate to="/Login" replace />} />
          <Route path="/Login" element= {<Login/>} />
          <Route path="/CreateAccount" element= {<CreateAccount/>} />
          <Route path="/Home" element= {<Home/>} />
          <Route path="/Profile" element= {<Profile/>} />
          <Route path="/Chat" element= {<Chat/>} />
          <Route path="/Settings" element= {<Settings/>} />
          <Route path="/Listings" element= {<Listings/>} />
          <Route path="/IndividualChat/:userId/:listingId" element= {<IndividualChat/>} />
        </Routes>
      </div>  
    </Router>
  );
}

export default App