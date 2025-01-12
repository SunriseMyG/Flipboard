import React, { useEffect, useState } from "react";
import './favorites.css';

interface FavoritesProps {
    setpageIndex: React.Dispatch<React.SetStateAction<number>>;
    authToken: string;
    userEmail: string;
    handleLogout: () => void;
    setSelectedArticle: React.Dispatch<React.SetStateAction<any>>;
    isMenuOpen: boolean;
}

function Favorites({ setpageIndex, authToken, userEmail, setSelectedArticle, isMenuOpen }: FavoritesProps) {
    const [userId, setUserId] = useState<number | null>(null);
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        if (userEmail) {
            fetch(`http://localhost:3000/api/users/${userEmail}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data && data.length > 0 && data[0].id) {
                        setUserId(data[0].id);
                        console.log('User ID:', data[0].id);
                    } else {
                        console.error('User ID is undefined in the response data');
                    }
                })
                .catch((error) => {
                    console.error('Error during fetch user:', error);
                });
        } else {
            setUserId(null);
        }
    }, [authToken, userEmail]);

    useEffect(() => {
        if (userId !== null) {
            fetch(`http://localhost:3000/api/favorites/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch favorites');
                    }
                    return response.json();
                })
                .then((data) => {
                    // Utiliser un ensemble pour filtrer les articles uniques
                    const uniqueFavorites = Array.from(new Set(data.map((a: any) => a.url)))
                        .map(url => {
                            return data.find((a: any) => a.url === url);
                        });
                    setFavorites(uniqueFavorites);
                    console.log('Favorites:', uniqueFavorites);
                })
                .catch((error) => {
                    console.error('Error during fetch favorites:', error);
                });
        }
    }, [userId, authToken]);

    const handleArticleClick = (article: any) => {
        setSelectedArticle(article);
        setpageIndex(2);
        console.log('Selected Article:', article);
    }

    return (
        <div className={`favorite-container ${isMenuOpen ? 'menu-open' : ''}`}>
            <h1>Your favorite articles!</h1>
            <div className="favorite-list">
                {favorites.map((favorite, index) => (
                    <div key={index} className="favorite-item" onClick={() => handleArticleClick(favorite)}>
                        <h2>{favorite.title}</h2>
                        <img src={favorite.urlToImage} alt={favorite.title} />
                        <button>Remove this article</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;