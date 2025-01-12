import React, { useEffect, useState } from "react";
import './home.css';

interface HomeProps {
    setpageIndex: React.Dispatch<React.SetStateAction<number>>;
    authToken: string;
    userEmail: string;
    handleLogout: () => void;
    setSelectedArticle: React.Dispatch<React.SetStateAction<any>>;
    searchedArticle: string;
    isMenuOpen: boolean;
}

function Home({ setpageIndex, authToken, userEmail, handleLogout, setSelectedArticle, searchedArticle, isMenuOpen }: HomeProps) {
    const [lastArticleFromTopic, setLastArticleFromTopic] = useState<any[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>('politics');

    useEffect(() => {
        const fetchArticles = (query: string) => {
            fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEWAPI}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const uniqueTitles = new Set();
                    const filteredArticles = data.articles
                        .filter((article: any) => article.title !== '[Removed]')
                        .filter((article: any) => {
                            const isUnique = !uniqueTitles.has(article.title);
                            uniqueTitles.add(article.title);
                            return isUnique;
                        })
                        .slice(0, 6);
                    setLastArticleFromTopic(filteredArticles);
                })
                .catch(error => {
                    console.error('Error fetching articles:', error);
                });
        };

        if (searchedArticle) {
            fetchArticles(searchedArticle);
        } else {
            fetchArticles(selectedTopic);
        }
    }, [selectedTopic, searchedArticle]);

    const handleTopicChange = (topic: string) => {
        setSelectedTopic(topic);
    };

    const handleArticleClick = (article: any) => {
        setSelectedArticle(article);
        setpageIndex(2);
        console.log('Selected Article:', article);
    };

    return (
        <div className={`home-container ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="home-title">
                <h1>Restez informés</h1>
                <h1 className="second-title">Trouvez de l'inspiration</h1>
            </div>
            <div className="button-container">
                <button onClick={() => handleTopicChange('politics')}>Politics</button>
                <button onClick={() => handleTopicChange('sports')}>Sports</button>
                <button onClick={() => handleTopicChange('technology')}>Technology</button>
                <button onClick={() => handleTopicChange('business')}>Business</button>
            </div>
            <div className="articles-container">
                {lastArticleFromTopic.map((article, index) => (
                    <div key={index} className="article" onClick={() => handleArticleClick(article)}>
                        <h2>{article.title}</h2>
                        <img src={article.urlToImage} alt={article.title} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;