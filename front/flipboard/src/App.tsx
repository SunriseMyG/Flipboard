import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import Landingpage from "./components/landingpage/landingpage";
import Home from "./components/home/home";
import Header from "./components/header/header";
import Article from "./components/article/article";
import Favorites from "./components/favorites/favorites";
import Searched from "./components/searched/searched";

function App() {
  const [pageindex, setPageIndex] = React.useState(0);
  const [emaillogger, setEmailLogger] = React.useState('');
  const [authToken, setAuthToken] = React.useState('');
  const [articleURL, setArticleURL] = React.useState('');
  const [topicOfArticle, setTopicOfArticle] = React.useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchedArticle, setSearchedArticle] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // console.log(process.env.REACT_APP_NEWAPI);
  // console.log(process.env.REACT_APP_TEST_VARIABLE);

  // const [articles, setArticles] = useState<any[]>([]);
  
  // useEffect(() => {
  //   fetch(`https://newsapi.org/v2/everything?q=elonmusk&from=2024-11-02&to=2024-11-02&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWAPI}`)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       setArticles(data.articles);
  //     });
  // } , []);

  useEffect(() => {
    // Vérifier si un jeton d'authentification est stocké dans localStorage
    const storedToken = localStorage.getItem('authToken');
    const storedEmail = localStorage.getItem('emailLogger');
    if (storedToken && storedEmail) {
      setAuthToken(storedToken);
      setEmailLogger(storedEmail);
      setPageIndex(1);
    }
  }, []);

  const handleLogin = (token: string, email: string) => {
    setAuthToken(token);
    setEmailLogger(email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('emailLogger', email);
    setPageIndex(1);
  }

  const handleLogout = () => {
    setAuthToken('');
    setEmailLogger('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('emailLogger');
    setPageIndex(0);
  }

  return (
    <div className="App">
      {pageindex !== 0 && <Header
        handleLogout={handleLogout}
        setpageIndex={setPageIndex}
        authToken={authToken}
        setSearchedArticle={setSearchedArticle}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />}
      {pageindex === 0 && <Landingpage
        setpageIndex={setPageIndex}
        setAuthToken={handleLogin}
        setEmailLogger={setEmailLogger}
      />}
      {pageindex === 1 && <Home
        setpageIndex={setPageIndex}
        authToken={authToken}
        userEmail={emaillogger}
        handleLogout={handleLogout}
        setSelectedArticle={setSelectedArticle}
        searchedArticle={searchedArticle}
        isMenuOpen={isMenuOpen}
      />}
      {pageindex === 2 && <Article
        setpageIndex={setPageIndex}
        authToken={authToken}
        userEmail={emaillogger}
        handleLogout={handleLogout}
        selectedArticle={selectedArticle}
        isMenuOpen={isMenuOpen}
      />}
      {pageindex === 3 && <Favorites
        setpageIndex={setPageIndex}
        authToken={authToken}
        userEmail={emaillogger}
        handleLogout={handleLogout}
        setSelectedArticle={setSelectedArticle}
        isMenuOpen={isMenuOpen}
      />}
      {pageindex === 4 && <Searched 
        setpageIndex={setPageIndex}
        authToken={authToken}
        userEmail={emaillogger}
        handleLogout={handleLogout}
        setSelectedArticle={setSelectedArticle}
        searchedArticle={searchedArticle}
        isMenuOpen={isMenuOpen}
      />}
    </div>
  );
}

export default App;
