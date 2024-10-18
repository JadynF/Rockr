import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.js";
import CreateAccount from "./pages/CreateAccount.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Chat from "./pages/Chat.js";
import Settings from "./pages/Settings.js";
import Listings from "./pages/Listings.js";
import "./App.css";
import VerifyingEmail from "./pages/VerifyingEmail.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/Login" Component={Login} />
        <Route path="/CreateAccount" Component={CreateAccount} />
        <Route path="/Home" Component={Home} />
        <Route path="/verify" Component={VerifyingEmail} />
        <Route path="/Profile" Component={Profile} />
        <Route path="/Chat" Component={Chat} />
        <Route path="/Listings" Component={Listings} />
      </Routes>
    </Router>
  )
}

export default App