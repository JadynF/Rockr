function SideMenu({ isMenuVisible, menuLinks, menuNames }) {

    return (
        <div class = {isMenuVisible ? 'sidebar' : 'sidebar hidden'}>
            {menuLinks.map((item, index) => (
                <div>
                    <a href={item} className = 'sidebar-btn'>{menuNames[index]}</a>
                </div>
            ))}
        </div>
    );
}

export default SideMenu;