import {Authorization} from './Authorization';
import React, {useState, useEffect} from 'react';

function AllChats() {

    const [chairNames, setChairNames] = useState(['Scary Chair', 'Awesome Chair', 'Floating Chair']);
    const [userNames, setUserNames] = useState(['Joseph', 'Mary', 'Bob']);
    const [lastMessages, setLastMessages] = useState(['Hey I want this chair.', 'Is this chair still available.', "$7500 don't lowball I know what I got"]);

    const [outgoingChats, setOutgoingChats] = useState([]);
    const [incomingChats, setIncomingChats] = useState([]);

    // need to query database to get chat information
    useEffect(() => {
        Authorization();

        const myToken = localStorage.getItem('token');
        let body = {
            token: myToken
        }
        fetch('http://localhost:8000/getChatOverviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setOutgoingChats(data[0]);
            setIncomingChats(data[1]);
        });// set useState variables)
    }, []);


    return (
        <div className = 'all-chats'>
            <div className = 'outgoing-chats'>
                <h2>Outgoing Chats</h2>
                {outgoingChats.map((item, index) => (
                    <div className = 'individual-chat'>
                        <div className = 'chat-titles'>
                            <h2>{item.listingName}</h2>
                            <h3>{item.username}</h3>
                        </div>
                        <div className = 'last-message'>
                            <h4></h4>
                        </div>
                    </div>
                ))}
            </div>
            <hr></hr>
            <div className = 'incoming-chats'>
                <h2>Incoming Chats</h2>
                {incomingChats.map((item, index) => (
                    <div className = 'individual-chat'>
                        <div className = 'chat-titles'>
                            <h2>{item.listingName}</h2>
                            <h3>{item.username}</h3>
                        </div>
                        <div className = 'last-message'>
                            <h4></h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllChats;