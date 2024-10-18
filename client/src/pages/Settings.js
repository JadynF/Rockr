import { Link } from 'react-router-dom';
import {Authorization} from '../components/Authorization';
import "../styles/Home.css";

export default function Settings() {
    Authorization();

    return (
        <div>
            <h1 className="header">Welcome to the Settings Page!</h1>
            <div className="body">
                <Link to="/Home">Home</Link>
            </div>
        </div>
    )
}