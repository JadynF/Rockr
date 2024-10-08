import React, {useState, useEffect} from "react";
import CustomNavLink from "../components/CustomNavLink";

export default function Login() {
    //Variables for user input
    const [uNameInput, setUName] = useState("");
    const [passInput, setPassword] = useState("");
    //Variable for value returned from the backend
    const [mydata, setData] = useState("Nothing from the server...");
    const [loginMessage, setLoginMessage] = useState("");

    //handle changes to username and password input
    const handleUsernameChange = (event) => {
        setUName(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    //function to login. When 'Log In' button is pressed, the inputs are sent to the backend. 
    //If the login info matches a user in the database, the user will be sent to the home page.
    const submitLogin = (event) => {
        event.preventDefault();
        const loginQuery = {
            username: uNameInput,
            password: passInput
        };
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginQuery), //sent as a JSON string
            })
            .then(res => res.json())
            .then(data => setData(data.response))
            .catch(error => console.error(error));
        //if credentials are accepted, send user to home page, else, they must reenter credentials.
        if(mydata == "accepted"){
            setLoginMessage("Login accepted. Going to home...");
            window.location.pathname = "/Home"; //sends user to home page
        } else {
            setLoginMessage("Login rejected. Please enter valid credentials...");
        }
    }

    return (
        <div>
            <h1>Welcome to the Login Page!</h1>
            <p>Need an account?</p>
            <CustomNavLink href="/CreateAccount">Create Account</CustomNavLink>
            <div>
                <input type="text" id="userInputText" name="userInputText" placeholder="Username" onChange={handleUsernameChange} />
                <input type="text" id="passInputText" name="passInputText" placeholder="Password" onChange={handlePasswordChange} />
                <button onClick={submitLogin}>Log In</button>
            </div>
            <p>{loginMessage}</p>
        </div>
    )
}