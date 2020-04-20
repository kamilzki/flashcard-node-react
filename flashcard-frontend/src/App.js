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

export default function App() {
  const [authState, setAuthState] = React.useState({
    isAuth: false,
    token: null,
    userId: null
  });
  const authChangeHandler = (isAuth, token, userId) => {
    setAuthState({
      isAuth: isAuth,
      token: token,
      userId: userId
    });
  };

  const logoutHandler = () => {
    authChangeHandler(false, null, null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <div>
        <PrimaryAppBar
          isAuth={authState.isAuth}
          onLogout={logoutHandler}
        />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/signup">
            <Signup/>
          </Route>
          <Route path="/">
            <div className="App">
              {!authState.isAuth ?
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
