import React, {useState, useEffect} from "react";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import '../style/Profile.css';

export default function Profile() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    };

    const menuNames = ["Profile", "Chat", "My Listings", "Settings"];
    const menuLinks = ["/Profile", "/Chat", "/MyListings", "/Settings"];

    return (
        <>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className = 'main-container'>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = 'body-section'>
                    <p>
                        Profile Goes Here
                    </p>
                </div>
            </div>
        </>
    );

}