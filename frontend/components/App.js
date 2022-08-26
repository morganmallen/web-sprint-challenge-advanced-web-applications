import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  const initialFormValues = { title: "", text: "", topic: "" };

  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(initialFormValues);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      setMessage("Goodbye!");
    }
    redirectToLogin();
  };

  const login = (values) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setSpinnerOn(true);
    axios
      .post("http://localhost:9000/api/login", values)
      .then((res) => {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.token);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch((err) => console.log(err));
  };

  const getArticles = (updateMessage = false) => {
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    axios
      .get("http://localhost:9000/api/articles", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        if(updateMessage){
          setMessage(res.data.message);
          setArticles(res.data.articles);
          setSpinnerOn(false);
        } else {
          setArticles(res.data.articles);
          setSpinnerOn(false);
        }
      })
      .catch(() => {
        redirectToLogin();
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axios
      .post("http://localhost:9000/api/articles", article, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        getArticles();
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err));
  };

  const updateArticle = (article) => {
    // ✨ implement
    // You got this!
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    axios
      .put(
        `http://localhost:9000/api/articles/${article.article_id}`,
        article,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        getArticles();
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    axios
      .delete(`http://localhost:9000/api/articles/${article_id}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        getArticles();
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticle={currentArticle}
                  setEditing={setEditing}
                  editing={editing}
                  />
                <Articles
                  articles={articles}
                  editing={editing}
                  setEditing={setEditing}
                  setCurrentArticle={setCurrentArticle}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
