import React, { useEffect } from "react";
import './article.css';

interface ArticleProps {
  setpageIndex: React.Dispatch<React.SetStateAction<number>>;
  authToken: string;
  userEmail: string;
  handleLogout: () => void;
  selectedArticle: any;
  isMenuOpen: boolean;
}

function Article({ setpageIndex, authToken, userEmail, handleLogout, selectedArticle, isMenuOpen }: ArticleProps) {

  const [userId, setUserId] = React.useState<number | null>(null);

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
      setUserId(null); // Définir userId sur null si userEmail n'est pas défini
    }
  }, [authToken, userEmail]);

  const addArticleToFavorite = () => {
    if (userId === null) {
      console.error('User ID is not defined');
      return;
    }

    fetch(`http://localhost:3000/api/favorites/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        author: selectedArticle.author || 'Unknown',
        title: selectedArticle.title,
        description: selectedArticle.description,
        content: selectedArticle.content,
        url: selectedArticle.url,
        urlToImage: selectedArticle.urlToImage,
        published_at: selectedArticle.publishedAt || new Date().toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Favorite added:', data);
      })
      .catch((error) => {
        console.error('Error during add favorite:', error);
      });
  };

  return (
    <div className={`article-container ${isMenuOpen ? 'menu-open' : ''}`}>
      {selectedArticle && (
        <div className="article-item">
          <h2>{selectedArticle.title}</h2>
          <img src={selectedArticle.urlToImage} alt={selectedArticle.title} />
          <p>{selectedArticle.description}</p>
          <p>{selectedArticle.content}</p>
        </div>
      )}
      <div className="tempbuttonfavorite">
        {authToken ? (
          <button onClick={addArticleToFavorite} className="favorites-btn">Add this article to your favorite list</button>
        ) : (
          <button className="logout-btn">Login if you want to add this article to your favorite list</button>
        )}
      </div>
    </div>
  );
}

export default Article;