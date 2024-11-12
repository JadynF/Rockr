import React, {useState} from "react";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Listing from '../components/Listing';
import {Authorization} from '../components/Authorization';

import '../styles/Home.css';

export default function Home() {
    Authorization();

    const [isMenuVisible, setIsMenuVisible] = useState(true);

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    const menuNames = ["Profile", "Chat", "My Listings", "Settings"];
    const menuLinks = ["/Profile", "/Chat", "/Listings", "/Settings"];

    return (
        <div style = {{
            overflow: "hidden",
        }}>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className = 'main-container' style = {{
                flex: 1,
            }}>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <Listing/>
            </div>
        </div>
    )
}