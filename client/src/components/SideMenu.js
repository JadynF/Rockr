import { Link } from 'react-router-dom';

function SideMenu({ isMenuVisible, menuLinks, menuNames }) {

    return (
        <div class = {isMenuVisible ? 'sidebar' : 'sidebar hidden'}>
            {menuLinks.map((item, index) => (
                <div>
                    <Link to={item} className = 'sidebar-btn'>{menuNames[index]}</Link>
                </div>
            ))}
        </div>
    );
}

export default SideMenu;