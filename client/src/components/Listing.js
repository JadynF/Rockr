import React, { useEffect, useState } from 'react';
import {Authorization} from '../components/Authorization';

function Listing() {
    const [pageUpdater, setPageUpdater] = useState(true); // useEffect runs when pageUpdater changes value, listen (it works)
    const [shownImage, setShownImage] = useState([]);


    useEffect(() => {
        Authorization();
        const imageQuery = {
            token: localStorage.getItem('token'),
            currListing: shownImage[1],
        };
        fetch('http://localhost:8000/getListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageQuery),
        })
        .then(res => res.json())
        .then(data => {
            setShownImage([data['imagePath'], data['listingId']])

        });//data => setShownImage(data['imagePath']));
        
    }, [pageUpdater]);

    const imageYes = async () => {
        setPageUpdater(!pageUpdater);
        // send query to add to matched listings
    }

    const imageNo = async () => {
        setPageUpdater(!pageUpdater);
    }

    return (
        <div className = 'listing-section'>
            <div className = 'listing-image'>
                <img src = {shownImage[0]}></img>
            </div>
            <div className = 'listing-btns'>
                <h2 onClick = {imageNo}>NO!</h2>
                <h2 onClick = {imageYes}>YES!</h2>
            </div>
        </div>
    );
}

export default Listing;