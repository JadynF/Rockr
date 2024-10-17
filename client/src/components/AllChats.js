import {Authorization} from './Authorization';
import React, {useState} from 'react';

function AllChats() {

    const [chairNames, setChairNames] = useState(['Scary Chair', 'Awesome Chair', 'Floating Chair']);
    const [userNames, setUserNames] = useState(['Joseph', 'Mary', 'Bob']);
    const [lastMessages, setLastMessages] = useState(['Hey I want this chair.', 'Is this chair still available.', "$7500 don't lowball I know what I got"]);

    Authorization();

    // need to query database to get chat information
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
    .then();// set useState variables)

    return (
        <div className = 'all-chats'>
            {chairNames.map((item, index) => (
                <div className = 'individual-chat'>
                    <div className = 'chat-titles'>
                        <h2>{item}</h2>
                        <h3>{userNames[index]}</h3>
                    </div>
                    <div className = 'last-message'>
                        <h4>{lastMessages[index]}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AllChats;