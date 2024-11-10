import React, {useState, useEffect} from "react";
import CustomNavLink from "../components/CustomNavLink";
import { Link, useNavigate } from 'react-router-dom';

export default function CreateAccount() {
    const host = process.env.REACT_APP_BACKEND_HOST;
    //account creation variables
    const [fNameInput, setFName] = useState("");
    const [lNameInput, setLName] = useState("");
    const [usernameInput, setUName] = useState("");
    const [passwordInput, setPassword] = useState("");
    const [emailInput, setEmail] = useState("");
    const [phoneNumInput, setPhoneNum] = useState("");
    //variable to communicate with user
    const [message, setMessage] = useState("");

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

    //Validates format of inputted email
    const checkEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    //function to create an account. When 'Submit' button is pressed, the inputs are sent to the backend. 
    //If the inputted data is acceptable, the account will be created, and the user will be brought into the login page.
    const submitCreateAcct = (event) => {
        if(!checkEmail(emailInput)){
            setMessage("Please enter a valid email.");
            return;
        } else {
            setMessage("Creating your account...");
            event.preventDefault();
            const createAcctQuery = {
                firstName: fNameInput,
                lastName: lNameInput,
                username: usernameInput,
                password: passwordInput,
                email: emailInput,
                phoneNum: phoneNumInput
            };
            fetch(host + '/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createAcctQuery), //sent as a JSON string
                })
                .then(res => res.json())
                .then(data => setMessage(data.response))
                .catch(error => setMessage(error.response));
        }
    }

    return (
        <div>
            <div className = "header" style = {{
                backgroundImage: 'url("' + host + '/banner.png")',
                backgroundSize: "cover",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
            }}>
                <h1>Rockr</h1>
            </div>
            <div class="main-container" style = {{
                    justifyContent: "center",
                }}>
                <div class="user-info-box">
                    <h2>Create an Account!</h2>
                    <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">First Name:</label>
                        <input type="text" class="input-text" id="fNameIn" name="fNameIn" placeholder="First Name" onChange={handleFNameChange} style = {{
                            alignSelf: "center"
                        }}/>
                    </div>
                    
                    <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Last Name:</label>
                        <input type="text" class="input-text" id="lNameIn" name="lNameIn" placeholder="Last Name" onChange={handleLNameChange} style = {{
                            alignSelf: "center"
                        }}/>
                    </div>

                    <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Username:</label>
                        <input type="text" class="input-text" id="usernameIn" name="usernameIn" placeholder="Username" onChange={handleUsernameChange} style = {{
                            alignSelf: "center"
                        }}/>
                    </div>

                    <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Password:</label>
                        <input type="text" class="input-text" id="passwordIn" name="passwordIn" placeholder="Password" onChange={handlePasswordChange} style = {{
                            alignSelf: "center"
                        }}/>
                    </div>

                    <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Email:</label>
                        <input type="text" class="input-text" id="emailIn" name="emailIn" placeholder="Email" onChange={handleEmailChange} style = {{
                            alignSelf: "center"
                        }}/>
                    </div> 

                    <button onClick={submitCreateAcct} disabled={fNameInput != '' && lNameInput != '' && usernameInput != '' && passwordInput != '' && emailInput != '' ? false : true} style = {{
                            backgroundColor: "black",
                            color: "white",
                            padding: "5px 10px",
                            borderColor: "white",
                            borderRadius: "100px",
                            cursor: "pointer",
                            margin: "10px",
                            opacity: (fNameInput != '' && lNameInput != '' && usernameInput != '' && passwordInput != '' && emailInput != '' ? 1 : .3),
                    }}>Submit</button>
                </div>
            </div>
            <div style = {{
                color: "white",
            }}>
                <p>{message}</p>
            </div>
        </div>
    )
}