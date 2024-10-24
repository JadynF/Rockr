import React, {useState, useEffect, useRef} from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { Authorization } from '../components/Authorization';
import "../styles/IndividualChat.css";

export default function IndividualChat() {
    const host = process.env.REACT_APP_BACKEND_HOST;
    const navigate = useNavigate();

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }
    const menuNames = ['Home', 'Chat', 'Profile', 'My Listings', 'Settings'];
    const menuLinks = ['/Home', '/Chat', '/Profile', '/Listings', '/Settings'];

    const { userId, listingId } = useParams();

    const [myId, setMyId] = useState(null);
    const [listingName, setListingName] = useState(null);
    const [messages, setMessages] = useState([[]]);
    const [inputMessage, setInputMessage] = useState("");

    const intervalRef = useRef(null);

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
            try {
                setMessages(data[2]);
                console.log(data[2][0].userId)
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

    const sendMessage = () => {
        console.log(inputMessage);
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
            <div className = "main-container">
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = 'main-area'>
                    <div className = "chat-title">
                        <h1>{listingName} by {userId}</h1>
                    </div>
                    {messages.map(item => (
                        <div className = {item.userId == myId ? "sent-message" : "received-message"}>
                            <h2 className = "chat-user">{item.userId == myId ? "Me:" : userId + ":"}</h2>
                            <p className = "chat-message">{item.text}</p>
                        </div>
                    ))}
                    <div className = 'create-message-div'>
                        <input className = "new-message" type="text" value = {inputMessage} onChange = {handleInput} placeholder="Write your message"></input>
                        <h1 className = "send-message-btn" onClick={sendMessage}>Send</h1>
                    </div>
                </div>
            </div>
        </>
    );
}