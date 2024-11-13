import React, {useState, useEffect} from "react";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import {Authorization} from '../components/Authorization';
import Geolocation from "../components/Geolocation";
import Popup from 'reactjs-popup';
import "../styles/Profile.css";


export default function Profile() {
    Authorization();

    const host = process.env.REACT_APP_BACKEND_HOST;

    //variables for current user info (from DB)
    const [firstName, setFName] = useState("");
    const [lastName, setLName] = useState("");
    const [username, setUName] = useState("");
    const [passwordText, setPassText] = useState("••••••••••");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");

    //variables to hold new profile info inputted by user
    const [newFirstName, setNewFName] = useState("");
    const [newLastName, setNewLName] = useState("");
    const [newUsername, setNewUName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhoneNum, setNewPhoneNum] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [passwordMessage, setPMess] = useState("");

    const [userPreferences, setUserPreferences] = useState([null, null, null, null]); //[prefPrice, prefColor, prefCondition, prefRange]
    const [newMaxPrice, setNewMaxPrice] = useState("");
    const [newPrefColor, setNewPrefColor] = useState("");
    const [newPrefCondition, setNewPrefCondition] = useState("");
    const [newPrefRange, setNewPrefRange] = useState(null);

    //sidebar variables
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const menuNames = ["Home", "Chat", "My Listings", "Settings"];
    const menuLinks = ["/Home",  "/Chat", "/Listings", "/Settings"];

    //by using the user's token, retrieve the user and their profile info
    const grabUserInfo = () => {
        let mytoken = localStorage.getItem('token');
        fetch(host + '/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: mytoken})
        })
        .then(res => res.json())
        .then(data => {
            setFName(data[0].FirstName);
            setLName(data[0].LastName);
            setUName(data[0].username);
            setEmail(data[0].email);
            setPhoneNum(data[0].phone);
            setUserPreferences([data[1].prefPrice, data[1].prefColor, data[1].prefCondition, data[1].prefRange]);
        })
        .catch(error => console.error(error));
    }

    //compile current and changed info and push it to the server. Server retrieves the information from the DB and returns it here
    const changeUserInfo = () => {
        //compile info to push to server
        let qFN = newFirstName;
        let qLN = newLastName;
        let qUN = newUsername;
        let qEm = newEmail;
        let qPh = newPhoneNum;

        if(newFirstName.length === 0) {
            qFN = firstName;
        }
        if(newLastName.length === 0) {
            qLN = lastName;
        }
        if(newUsername.length === 0) {
            qUN = username;
        }
        if(newEmail.length === 0) {
            qEm = email;
        }
        if(newPhoneNum.length === 0) {
            qPh = phoneNum;
        }

        let mytoken = localStorage.getItem('token');
        let userObj = {
            token: mytoken,
            newfirstname: qFN,
            newlastname: qLN,
            newusername: qUN,
            newemail: qEm,
            newphone: qPh
        };
        fetch(host + "/newUserInfo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObj)
        })
        .then(res => res.json())
        .then(data => {
            setFName(data.FirstName);
            setLName(data.LastName);
            setUName(data.username);
            setEmail(data.email);
            setPhoneNum(data.phone);
        })
        .catch(error => console.error(error));
    }

    const changeUserPreferences = () => {
        console.log(newMaxPrice);
        console.log(newPrefColor);
        console.log(newPrefCondition);
        console.log(newPrefRange);

        let payload = {token: localStorage.getItem('token')};

        if (newMaxPrice == "")
            payload.newPrice = "NULL";
        else
            payload.newPrice = newMaxPrice;

        console.log(newPrefColor);
        if (newPrefColor == "")
            payload.newColor = "NULL";
        else
            payload.newColor = newPrefColor;

        console.log(newPrefColor);
        if (newPrefCondition == "")
            payload.newCondition = "NULL";
        else
            payload.newCondition = newPrefCondition;

        if (newPrefRange == "")
            payload.newRange = "NULL";
        else
            payload.newRange = newPrefRange;

        fetch(host + "/newPreferences", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => grabUserInfo());

    }

    const changePassword = () => {
        if(newPassword === confirmPass){
            let mytoken = localStorage.getItem('token');
            let userObj = {
                token: mytoken,
                password: newPassword
            };
            fetch(host + '/newUserPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userObj)
            })
            .then(res => res.json())
            .then(data => setPMess(data.response))
            .catch(error => setPMess(error.response));

            setNewPassword('');
            setConfirmPass('');
        } else {
            setPMess('Your passwords do not match.');
        }
    }

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    useEffect(() => {
        grabUserInfo();
    }, []);

    return (
        <>
            <Header class="header" isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className="main-container" style = {{
                flex: '2',
            }}>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = "user-boxes" style = {{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: "1",
                }}>
                    <div className="user-info-box">
                        <div>
                            <h2>User Preferences</h2>
                        </div>
                        {console.log(userPreferences[0])}
                        <p class="profile-description">Max Price: {userPreferences[0] == null ? "None" : "$" + userPreferences[0]}</p>
                        <p></p>
                        <p class="profile-description">Preferred Color: {userPreferences[1] == null ? "None" : userPreferences[1]}</p>
                        <p></p>
                        <p class="profile-description">Preferred Condition: {userPreferences[2] == null ? "None" : userPreferences[2]}</p>
                        <p></p>
                        <p class="profile-description">Preferred Range: {userPreferences[3] == null ? "None" : userPreferences[3] + " miles"}</p>
                        <Popup trigger={<button class="button">Change Preferences</button>} position="right">
                            <div class="change-info-box">
                                <label>New Max Price: </label>
                                <div>
                                    <input 
                                        type="range" 
                                        class="input-range" 
                                        min="0" 
                                        max="1000" 
                                        step="10" 
                                        value={newMaxPrice} 
                                        onChange={(e) => setNewMaxPrice(e.target.value)} 
                                    />
                                    <span style = {{
                                        alignSelf: "center",
                                    }}>{"$" + newMaxPrice || userPreferences[0]}</span>
                                </div>
                                <label>New Preferred Color: </label>
                                <div>
                                <select value={newPrefColor} onChange={(e) => setNewPrefColor(e.target.value)} style = {{
                                    backgroundColor: "#111418",
                                    color: "white",
                                    borderRadius: "5px",
                                }}>
                                    <option value="">None</option>
                                    <option value="Red">Red</option>
                                    <option value="Orange">Orange</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Green">Green</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Purple">Purple</option>
                                    <option value="White">White</option>
                                    <option value="Black">Black</option>
                                    <option value="Gray">Gray</option>
                                    <option value="Brown">Beige</option>
                                    <option value="Beige">Beige</option>
                                    <option value="Pink">Pink</option>
                                </select>
                                </div>
                                <label>New Preferred Condition: </label>
                                <div>
                                <select value={newPrefCondition} placeholder={userPreferences[2]} onChange={(e) => setNewPrefCondition(e.target.value)} style = {{
                                    backgroundColor: "#111418",
                                    color: "white",
                                    borderRadius: "5px",
                                }}>
                                    <option value="">None</option>
                                    <option value="New">New</option>
                                    <option value="Used (No Defects)">Used (No Defects)</option>
                                    <option value="Used (Slightly Damaged)">Used (Slightly Damaged)</option>
                                    <option value="Used (Heavily Damaged)">Used (Heavily Damaged)</option>
                                </select>
                                </div>
                                <label>New Max Range: </label>
                                <div>
                                    <input 
                                        type="range" 
                                        class="input-range" 
                                        min="0" 
                                        max="1000" 
                                        step="1" 
                                        value={newPrefRange} 
                                        onChange={(e) => setNewPrefRange(e.target.value)} 
                                    />
                                    <span style = {{
                                        alignSelf: "center",
                                    }}>{newPrefRange + " miles" || userPreferences[3]}</span>
                                </div>
                                <button class="button" onClick={changeUserPreferences}>Submit New Preferences</button>
                            </div>
                        </Popup>
                    </div>
                    <div className="user-info-box">
                        <div>
                            <h2>User Information</h2>
                        </div>
                        <p class="profile-description">First Name: {firstName}</p>
                        <p></p>
                        <p class="profile-description">Last Name: {lastName}</p>
                        <p></p>
                        <p class="profile-description">Username: {username}</p>
                        <p></p>

                        <Popup trigger={<button class="button">Change Profile Info</button>} position="right">
                            <div class="change-info-box">
                                <label>Input New First Name: </label>
                                <div>
                                <input type="text" class="input-text" value={newFirstName} placeholder={firstName} onChange={(e) => setNewFName(e.target.value)} />
                                </div>
                                <label>Input New Last Name: </label>
                                <div>
                                <input type="text" class="input-text" value={newLastName} placeholder={lastName} onChange={(e) => setNewLName(e.target.value)} />
                                </div>
                                <label>Input New Username: </label>
                                <div>
                                <input type="text" class="input-text" value={newUsername} placeholder={username} onChange={(e) => setNewUName(e.target.value)} />
                                </div>
                                <button class="button" onClick={changeUserInfo}>Submit New Profile Info</button>
                            </div>
                        </Popup>
                    </div>
                    <div class="user-info-box">
                            <h2>  Communication  </h2>
                            <p class="profile-description">Email: {email}</p>
                            <p></p>
                            <p class="profile-description">Phone Number: {phoneNum}</p>
                            <p></p>
                            <Popup trigger={<button class="button">Change Profile Info</button>} position="right">
                                <div class="change-info-box">
                                    <label>Input New Email: </label>
                                    <div>
                                    <input type="text" class="input-text" value={newEmail} placeholder={email} onChange={(e) => setNewEmail(e.target.value)} />
                                    </div>
                                    <label>Input New Phone #: </label>
                                    <div>
                                    <input type="text" class="input-text" value={newPhoneNum} placeholder={phoneNum} onChange={(e) => setNewPhoneNum(e.target.value)} />
                                    </div>
                                    <button class="button" onClick={changeUserInfo}>Submit New Contact Info</button>
                                </div>
                            </Popup>
                    </div>
                    <div class="user-info-box">
                        <h2>  Password  </h2>
                        <div>
                            <p id="passwordText"> {passwordText} </p>
                            <Popup trigger={<button class="button">Change Password</button>} position="right">
                                <div class="change-info-box">
                                    <label>Input New Password: </label>
                                    <div>
                                    <input type="password" class="input-text" value={newPassword} placeholder={passwordText} onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <label>Confirm New Password: </label>
                                    <div>
                                        <input type="password" class="input-text" value={confirmPass} placeholder={passwordText} onChange={(e) => setConfirmPass(e.target.value)} />
                                    </div>
                                    <button class="button" onClick={changePassword}>Submit New Password</button>
                                </div>
                            </Popup>
                        </div>
                        <p>{passwordMessage}</p>
                    </div>
                    <div class="user-info-box">
                        <h2>  Location  </h2>
                        <Geolocation />
                    </div>
                </div>
            </div>
        </>
    )
}