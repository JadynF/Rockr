import React, {useState, useEffect} from "react";
import CustomNavLink from "../components/CustomNavLink";
import "../styles/Home.css";

export default function Settings() {
    return (
        <div>
            <h1 className="header">Welcome to the Settings Page!</h1>
            <div className="body">
                <CustomNavLink href="/Home">Home</CustomNavLink>
            </div>
        </div>
    )
}