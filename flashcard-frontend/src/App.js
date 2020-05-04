import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import Login from "./components/Login/Login";
import Signup from "./components/Singup/Signup";
import PrimaryAppBar from "./components/PrimaryAppBar/PrimaryAppBar";
import Translation from "./components/Translation/Translation";
import Flashcards from "./components/Flashcards/Flashcards";

export default function App() {
  const [authState, setAuthState] = React.useState({
    token: localStorage.getItem('userId'),
    userId: localStorage.getItem('expiryDate')
  });

  const authChangeHandler = (token, userId) => {
    setAuthState({
      token: token,
      userId: userId
    });
  };

  const logoutHandler = () => {
    authChangeHandler(null, null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };

  const isLogged = () => {
    return new Date() < new Date(localStorage.getItem('expiryDate'));
  };

  return (
    <Router>
      <div>
        <PrimaryAppBar
          isAuth={authState.isAuth}
          onLogout={logoutHandler}
          isLogged={isLogged}
        />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/search">
            <Translation/>
          </Route>
          <Route path="/flashcards">
            <Flashcards/>
          </Route>
          <Route path="/signup">
            <Signup/>
          </Route>
          <Route path="/">
            <div className="App">
              {!isLogged() ?
                <Login
                  onAuthChange={authChangeHandler}
                  onLogout={logoutHandler}
                /> :
                null
              }
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
