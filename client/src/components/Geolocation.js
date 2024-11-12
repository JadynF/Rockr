import React, { useState } from 'react';

const Geolocation = ({ currentUserId }) => {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const host = process.env.REACT_APP_BACKEND_HOST;

  const fetchLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setMessage("Location grabbed. Pushing to server...");
          setLoading(false);
          console.log(latitude, longitude);
          sendLocationToServer(latitude, longitude);
          console.log('Completed "sendLocationToServer"');
        },
        (err) => {
          setMessage(`Error: ${err.message}`);
          setLocation(null);
          setLoading(false);
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
    }
  };

  const sendLocationToServer = async (lat, lng) => {
    let mytoken = localStorage.getItem('token');
    try{
      await fetch(host + "/setLocation", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          token: mytoken, 
          latitude: lat, 
          longitude: lng 
        }),
      })
      .then(res => res.json)
      .then(data => setMessage(data.response))
    } catch (error) {
      setMessage(error.response);
    }
  };

  return (
    <div>
      <button className = "button" onClick={fetchLocation}>Get Location</button>
      {loading && <p>Loading...</p>}
      {location && (
        <div>
          <h3>Location:</h3>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Geolocation;