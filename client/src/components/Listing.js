import React, { useState } from 'react';
import img1 from '../assets/chair1.webp';
import img2 from '../assets/chair2.webp';
import img3 from '../assets/chair3.webp';
import img4 from '../assets/chair4.jpg';
import img5 from '../assets/chair5.webp';

function Listing() {
    const images = [img1, img2, img3, img4, img5];
    const [imageIndex, setImageIndex] = useState(0); // default image is first index
    const [shownImage, setShownImage] = useState(images[imageIndex]);


    const handleShownImage = (event) => {

        // handle web server requests here when available
        // possibly keep a queue of listings, when reach end of queue send request for more

        if (imageIndex >= images.length - 1)
            setImageIndex(0);
        else
            setImageIndex(imageIndex + 1);
        
        setShownImage(images[imageIndex]);
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