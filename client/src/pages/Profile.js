import React, {useState, useEffect} from "react";
import CustomNavLink from "../components/CustomNavLink";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import "../styles/Profile.css";

export default function Profile() {
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
                <CustomNavLink href="/Listings">My Listings</CustomNavLink>
                </div>
            </div>
        </div>
    )
}