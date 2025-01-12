import React, { useState, useEffect } from 'react';
import './searched.css';

interface SearchedProps {
    setpageIndex: React.Dispatch<React.SetStateAction<number>>;
    authToken: string;
    userEmail: string;
    handleLogout: () => void;
    setSelectedArticle: React.Dispatch<React.SetStateAction<any>>;
    searchedArticle: string;
    isMenuOpen: boolean;
}

interface Article {
    title: string;
    urlToImage: string;
}

function Searched({ setpageIndex, authToken, userEmail, handleLogout, setSelectedArticle, searchedArticle, isMenuOpen }: SearchedProps) {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = (query: string) => {
            fetch(`https://newsapi.org/v2/everything?q=iphone&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWAPI}`)
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                })
                .catch(error => {
                    console.error('Error fetching articles:', error);
                });
        }
        fetchArticles(searchedArticle);
    }, [searchedArticle]);

    const handleArticleClick = (article: Article) => {
        setSelectedArticle(article);
        setpageIndex(2);
        console.log('Selected Article:', article);
    }

    return (
        <div className={`searched-container ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className='searched-list'>
                {articles.map((article, index) => (
                    <div key={index} className='article' onClick={() => handleArticleClick(article)}>
                        <h2>{article.title}</h2>
                        <img src={article.urlToImage} alt='article' />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Searched;