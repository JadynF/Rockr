import React, {useState, useEffect} from "react";
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Listing from '../components/Listing';
import {Authorization} from '../components/Authorization';
import '../styles/Home.css';

export default function Home() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    Authorization();

    const menuNames = ["Profile", "Chat", "My Listings", "Settings"];
    const menuLinks = ["/Profile", "/Chat", "/MyListings", "/Settings"];

    return (
        <>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className = 'main-container'>
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <Listing/>
            </div>
        </>
    )
}