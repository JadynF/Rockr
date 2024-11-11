import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Authorization } from '../components/Authorization';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import "../styles/Home.css";
import "../styles/Settings.css";  // Ensure your CSS file path is correct


export default function Settings() {
    Authorization();  // Authorization check
    const navigate = useNavigate();

    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const toggleMenu = () => {
        setIsMenuVisible(prev => !prev);
    }
    const menuNames = ['Home', 'Chat', 'Profile', 'My Listings'];
    const menuLinks = ['/Home', '/Chat', '/Profile', '/Listings'];

    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
        const savedFontSize = JSON.parse(localStorage.getItem('fontSize'));

        if (savedDarkMode !== null) setDarkMode(savedDarkMode);
        if (savedFontSize !== null) setFontSize(savedFontSize);

        document.body.classList.toggle('dark-mode', savedDarkMode);  // Apply saved dark mode
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        localStorage.setItem('fontSize', fontSize);
    }, [darkMode, fontSize]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
    };

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            localStorage.clear();
            navigate('/signup');
        }
    };

    return (
        <>
            <Header isMenuVisible = {isMenuVisible} toggleMenu = {toggleMenu}/>
            <div className = "main-container">
                <SideMenu isMenuVisible = {isMenuVisible} menuNames = {menuNames} menuLinks = {menuLinks}/>
                <div className = "main-area">
                    <div className="settings-page" style={{ fontSize: `${fontSize}px` }}>
                        <div className="settings-container">
                            <div className="setting-item">
                                <label>Dark Mode:</label>
                                <button onClick={toggleDarkMode} className="toggle-button">
                                    {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
                                </button>
                            </div>

                            <div className="setting-item">
                                <label>Font Size:</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    value={fontSize}
                                    onChange={handleFontSizeChange}
                                    className="font-slider"
                                />
                                <span>{fontSize}px</span>
                            </div>

                            <div className="setting-item">
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </div>

                            <div className="setting-item">
                                <button onClick={handleDeleteAccount} className="delete-account-button">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}