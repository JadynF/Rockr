import React from "react";
import Login from "./pages/Login.js";
import CreateAccount from "./pages/CreateAccount.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Chat from "./pages/Chat.js";
import Settings from "./pages/Settings.js";
import Listings from "./pages/Listings.js";
import "./App.css";

function App() {

  //takes current window path and grabs matching webpage
  let Webpage = Login;
  switch (window.location.pathname) {
    case "/Login":
      Webpage = Login;
      break;
    case "/CreateAccount":
      Webpage = CreateAccount;
      break;
    case "/Home":
      Webpage = Home;
      break;
    case "/Profile":
      Webpage = Profile;
      break;
    case "/Chat":
      Webpage = Chat;
      break;
    case "/Listings":
      Webpage = Listings;
      break;
    case "/Settings":
      Webpage = Settings;
      break;
    default:
      Webpage = Login;
      break;
  }

  return (
    <div className="App">
      <Webpage />
    </div>
  );
}

export default App