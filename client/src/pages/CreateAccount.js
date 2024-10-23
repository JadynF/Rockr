import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function CreateAccount() {
    const host = process.env.REACT_APP_BACKEND_HOST;
    //account creation variables
    const [fNameInput, setFName] = useState("");
    const [lNameInput, setLName] = useState("");
    const [usernameInput, setUName] = useState("");
    const [passwordInput, setPassword] = useState("");
    const [emailInput, setEmail] = useState("");
    const [phoneNumInput, setPhoneNum] = useState("");
    //variable to hold response from backend
    const [data, setData] = useState("");

    //handles changes to user input variables
    const handleFNameChange = (event) => {
        setFName(event.target.value);
    }
    const handleLNameChange = (event) => {
        setLName(event.target.value);
    }
    const handleUsernameChange = (event) => {
        setUName(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePhoneNumChange = (event) => {
        setPhoneNum(event.target.value);
    }
    //function to create an account. When 'Submit' button is pressed, the inputs are sent to the backend. 
    //If the inputted data is acceptable, the account will be created, and the user will be brought into the login page.
    const submitCreateAcct = (event) => {
        event.preventDefault();
        const createAcctQuery = {
            firstName: fNameInput,
            lastName: lNameInput,
            username: usernameInput,
            password: passwordInput,
            email: emailInput,
            phoneNum: phoneNumInput
        };
        fetch(host + '/AcctCreation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createAcctQuery), //sent as a JSON string
            })
            .then(res => res.json())
            .then(data => setData(JSON.stringify(data)))
            .catch(error => console.error(error));
    }

    return (
        <div>
            <div>
                <h1>Welcome to the CreateAccount Page!</h1>
                <Link to="/Login">Login Page</Link>
            </div>
            <div>
                <h2>Create an Account!</h2>
                <input type="text" id="fNameIn" name="fNameIn" placeholder="First Name" onChange={handleFNameChange} />
                <input type="text" id="lNameIn" name="lNameIn" placeholder="Last Name" onChange={handleLNameChange} />
                <input type="text" id="usernameIn" name="usernameIn" placeholder="Username" onChange={handleUsernameChange} />
                <input type="text" id="passwordIn" name="passwordIn" placeholder="Password" onChange={handlePasswordChange} />
                <input type="text" id="emailIn" name="emailIn" placeholder="Email" onChange={handleEmailChange} />
                <input type="text" id="phoneNumIn" name="phoneNumIn" placeholder="Phone Number" onChange={handlePhoneNumChange} />
                <button onClick={submitCreateAcct}>Submit</button>
            </div>
            <div>
                <p>Results from server:</p>
                <p>{data}</p>
            </div>
        </div>
    )
}