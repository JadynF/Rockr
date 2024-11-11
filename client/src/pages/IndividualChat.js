import React, {useState, useEffect, useRef} from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { Authorization } from '../components/Authorization';
import "../styles/IndividualChat.css";

export default function IndividualChat() {
    const host = process.env.REACT_APP_BACKEND_HOST;
    const navigate = useNavigate();

    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }
    const menuNames = ['Home', 'Chat', 'Profile', 'My Listings', 'Settings'];
    const menuLinks = ['/Home', '/Chat', '/Profile', '/Listings', '/Settings'];

    const { userId, listingId } = useParams();

    const [myId, setMyId] = useState(null);
    const [listingName, setListingName] = useState(null);
    const [messages, setMessages] = useState([[]]);
    const [messagesLength, setMessagesLength] = useState(0);
    const [chairDetails, setChairDetails] = useState([]); // [imgPath, condition, price, color, creatorUser]
    const [inputMessage, setInputMessage] = useState("");
    const [myName, setMyName] = useState("");

    const intervalRef = useRef(null);
    const chatContainerRef = useRef(null);

    const updateChat = () => {
        Authorization();

        const myToken = localStorage.getItem('token');
        let body = {
            token: myToken,
            userId: userId,
            listingId: listingId
        } 
        fetch(host + "/getIndividualChat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (!data) {
                navigate("/Home");
            }
            setMyId(data[0]);
            setListingName(data[1]);
            setChairDetails([data[3], data[4], data[5], data[6], data[7]]);
            setMyName(data[8]);
            try {
                setMessages(data[2]);
            }
            catch {
                console.log("no messages");
            }
        });
    }

    useEffect(() => {
        updateChat();
        intervalRef.current = setInterval(updateChat, 5000);
        
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current && messages.length != messagesLength) {
            setMessagesLength(messages.length);
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); 

    const sendMessage = () => {
        if (inputMessage === "")
            return;
        let body = {
            myId: myId,
            recvName: userId,
            message: inputMessage,
            listingId: listingId
        }
        fetch(host + "/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        setInputMessage("");
        updateChat();
    }

    const handleInput = (event) => {
        setInputMessage(event.target.value);
    }

    return (
        <>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className = "main-container" style = {{
                height: "88vh",
            }}>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = 'main-area'>
                    <div className = "chat-div" style = {{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <div className = "chat-title" style = {{
                            flex: "0",
                            backgroundColor: "#111418",
                            borderBottom: "solid",
                            borderColor: "gray",
                            borderWidth: "1px",
                        }}>
                            <h1 style = {{
                                padding: "0",
                                margin: "0",
                            }}>{myName == chairDetails[4] ? userId + " Matched With Your Listing" : "You Matched With " + chairDetails[4] + "'s Listing"}</h1>
                        </div>
                        <div ref = {chatContainerRef} className = "chat-container">
                            {messages.map(item => (
                                <div className = {item.userId == myId ? "sent-message" : "received-message"}>
                                    <p className = "chat-message">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className = 'create-message-div'>
                            <input className = "new-message" type="text" maxlength = "127" value = {inputMessage} onChange = {handleInput} placeholder="Write your message"></input>
                            <h1 className = "send-message-btn" onClick={sendMessage}>Send</h1>
                        </div>
                    </div>
                </div>
                <div className = "details-div" style = {{
                    display: "flex",
                    flexDirection: "column",
                    width: "30vw",
                    borderLeft: "solid",
                    borderColor: "gray",
                    borderWidth: "1px",
                }}>
                    <img className = "details-img" src = {host + chairDetails[0]} style = {{
                        flex: "2",
                        width: "100%",
                        height: "40vh",
                    }}/>
                    <div className = "chair-details" style = {{
                        flex: "0",
                        backgroundColor: "#111418",
                    }}>
                        <h1 style = {{
                            margin: "0",
                            padding: "0",
                        }}>{listingName}</h1>
                        <h2>Created By {chairDetails[4]}</h2>
                        <div style = {{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            marginBottom: "15px",
                        }}>
                            <h3>{chairDetails[1]}</h3>
                            <h3>${chairDetails[2]}</h3>
                            <h3>{chairDetails[3]}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}