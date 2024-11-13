import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
export default function Login() {
    const host = process.env.REACT_APP_BACKEND_HOST;

    //Variables for user input
    const [uNameInput, setUName] = useState("");
    const [passInput, setPassword] = useState("");
    
    //Variable for value returned from the backend
    const [loginMessage, setLoginMessage] = useState("");

    //handle changes to username and password input
    const handleUsernameChange = (event) => {
        setUName(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const navigate = useNavigate();
    //function to login. When 'Log In' button is pressed, the inputs are sent to the backend. 
    //If the login info matches a user in the database, the user will be sent to the home page.
    const submitLogin = (event) => {
        event.preventDefault();
        const loginQuery = {
            username: uNameInput,
            password: passInput
        };
        fetch(host + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginQuery), //sent as a JSON string
            })
            .then(res => res.json())
            .then(data => {
                if (data.response == "accepted") {
                    setLoginMessage("Login accepted. Going to home...");
                    localStorage.setItem('token', data.token);
                    navigate("/Home");
                }
                else {
                    setLoginMessage("Login rejected. Please enter valid credentials...");
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            <div className = "header" style = {{
                backgroundImage: 'url("' + host + '/banner.png")',
                backgroundSize: "cover",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
            }}>
                <h1>Rockr</h1>
            </div>
            <div className = "login-div" style = {{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <h1 style = {{
                    color: "white",
                    margin: "0",
                    padding: "0",
                }}>Login</h1>
                <p style = {{
                    color: "red",
                }}>{loginMessage}</p>
                <div class="main-container" style = {{
                    justifyContent: "center",
                }}>
                    <div class="user-info-box">
                        <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Username:</label>
                            <input type="text" class="input-text" id="userInputText" name="userInputText" placeholder="Username" onChange={handleUsernameChange} style = {{
                                width: "70%",
                                padding: "0",
                                margin: "0",
                                alignSelf: "center",
                            }}/>
                        </div>
                        <div style = {{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <label class="login-label">Password: </label>
                            <input type="password" class="input-text" id="passInputText" name="passInputText" placeholder="Password" onChange={handlePasswordChange} style = {{
                                width: "70%",
                                padding: "0",
                                margin: "0",
                                alignSelf: "center",
                            }}/>
                        </div>
                        <p> </p>
                        <button onClick={submitLogin} style = {{
                            backgroundColor: "black",
                            color: "white",
                            padding: "5px 10px",
                            borderColor: "white",
                            borderRadius: "100px",
                            cursor: "pointer",
                            margin: "10px",
                        }}>Log In</button>
                    </div>
                </div>
                <h1 style = {{
                    color: "white",
                    marginBottom: "0",
                    paddingBottom: "0",
                }}>Register</h1>
                <div class="main-container" style = {{
                    justifyContent: "center",
                }}>
                    <div class="user-info-box" style = {{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <label class="profile-description">Need an account?</label>
                        <Link to="/CreateAccount" style = {{
                            backgroundImage: "linear-gradient(to right, #fc2776, #ff6630)",
                            color: "white",
                            padding: "5px 10px",
                            borderColor: "white",
                            borderRadius: "100px",
                            cursor: "pointer",
                            margin: "10px",
                        }}>Create Account</Link>
                    </div>
                </div>
            </div>
        </>
    )
}