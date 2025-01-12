import React, { useState, useEffect } from "react";
import './header.css';
import { FaMagnifyingGlass, FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

interface HeaderProps {
    handleLogout: () => void;
    setpageIndex: React.Dispatch<React.SetStateAction<number>>;
    authToken: string;
    setSearchedArticle: React.Dispatch<React.SetStateAction<string>>;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ handleLogout, setpageIndex, authToken, setSearchedArticle, isMenuOpen, setIsMenuOpen }: HeaderProps) {
    const [searchInput, setSearchInput] = useState('');

    const goToHome = () => {
        setpageIndex(1);
    }

    const handleSearch = () => {
        setSearchedArticle(searchInput);
        setpageIndex(4);
        console.log('Search:', searchInput);
    }

    const goToFavorites = () => {
        setpageIndex(3);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setIsMenuOpen]);

    return (
        <div className="header-container">
            <div className="header-left-content" onClick={goToHome}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c0/Flipboard_logo.svg" alt="Flipboard Logo" />
                <h1>Flipboard</h1>
            </div>
            <div className="hamburger-menu" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className={`menu-content ${isMenuOpen ? 'open' : ''}`}>
                <div className="searchbar-container">
                    <input type="text" placeholder="Rechercher sur Flipboard" className="searchbar" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <div className="search-btn">
                        <button onClick={handleSearch}>
                            <FaMagnifyingGlass className="glass-icon" />
                            Search
                        </button>
                    </div>
                </div>
                <div className="logout-btn-container">
                    <button className="favorites-btn" onClick={goToFavorites}>Your Favorite</button>
                    {authToken ? (
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button className="logout-btn" onClick={() => setpageIndex(0)}>Login</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;