import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AllChats from '../components/AllChats.js';
import {Authorization} from '../components/Authorization';
import "../styles/Chat.css";

export default function Chat() {
    Authorization();

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }

    const navigate = useNavigate();

    const menuNames = ['Home', 'Profile', 'My Listings', 'Settings'];
    const menuLinks = ['/Home', '/Profile', '/Listings', '/Settings'];

    return (
        <>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className="main-container">
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = 'main-area'>
                    <div className = 'all-chat-area'>
                        <AllChats navigate = {navigate}/>
                    </div>
                </div>
            </div>
        </>
    )
}