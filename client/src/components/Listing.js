import React, { useEffect, useState } from 'react';
import {Authorization} from '../components/Authorization';

function Listing() {
    const [imageIndex, setImageIndex] = useState(0); // default image is first index
    const [shownImage, setShownImage] = useState('');

    useEffect(() => {
        Authorization();
        console.log(imageIndex);
        const imageQuery = {
            imageIndex: imageIndex
        };
        fetch('http://localhost:8000/GetListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageQuery),
        })
        .then(res => res.json())
        .then(data => setShownImage(data['imagePath']));//data => setShownImage(data['imagePath']));
        
    }, [imageIndex]);


    const handleShownImage = () => {

        // handle web server requests here when available
        // possibly keep a queue of listings, when reach end of queue send request for more

        if (imageIndex >= 4)
            setImageIndex(0);
        else
            setImageIndex(imageIndex + 1);

    }

    return (
        <div className = 'listing-section'>
            <div className = 'listing-image'>
                <img src = {shownImage}></img>
            </div>
            <div className = 'listing-btns'>
                <h2 onClick = {handleShownImage}>NO!</h2>
                <h2 onClick = {handleShownImage}>YES!</h2>
            </div>
        </div>
    );
}

export default Listing;