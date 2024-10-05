import React from "react";
import Login from "./pages/Login.js";
import CreateAccount from "./pages/CreateAccount.js";
import Home from "./pages/Home.js";
import "./App.css";

function App() {

  //takes current window path and grabs matching webpage
  let Webpage = Login
  switch (window.location.pathname) {
    case "/Login": //display login page
      Webpage = Login
      break
      case "/CreateAccount": //display account creation page
        Webpage = CreateAccount
        break
        case "/Home":
          Webpage = Home
          break
        default:
          Webpage = Login
  }

  return (
    <div className="App">
      <Webpage />
    </div>
  );
}

export default App