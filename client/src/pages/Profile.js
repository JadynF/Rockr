import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import {Authorization} from '../components/Authorization';
import "../styles/Profile.css";


export default function Profile() {
    Authorization();

    const [firstName, setFName] = useState("");
    const [lastName, setLName] = useState("");
    const [username, setUName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [location, setLocation] = useState("");

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuNames = ["Home", "Chat", "My Listings", "Settings"];
    const menuLinks = ["/Home",  "/Chat", "/Listings", "/Settings"];

    const grabUserInfo = () => {
        setFName("John");
        setLName("Doe");
        setUName("testuser");
        setPassword("password")
        setEmail("testemail@gmail.com");
        setPhoneNum("1234567890");
        setLocation("North Pole");
    }

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    useEffect(() => {
        grabUserInfo();
    }, []);

    return (
        <div>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className="main-container">
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className="user-info-box">
                    <div>
                        <h2>{username}</h2>
                    </div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Email: {email}</p>
                    <p>Phone Number: {phoneNum}</p>
                </div>
                <button className="location-link-box">Location: {location}</button>
                <div className="listing-link-box">
                <Link to="/Listings">My Listings</Link>
                </div>
            </div>
        </div>
    )
}