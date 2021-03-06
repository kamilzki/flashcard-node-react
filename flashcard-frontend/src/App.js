import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import './App.css';

import {closeSnackbar, fetchFlashcards} from "./redux/actions/rootAction";

import Login from "./components/Login/Login";
import Signup from "./components/Singup/Signup";
import PrimaryAppBar from "./components/PrimaryAppBar/PrimaryAppBar";
import Translation from "./components/Translation/Translation";
import Flashcards from "./components/Flashcards/Flashcards";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function App({store}) {
  const snackbar = useSelector((state) => state.info.snackbar);
  const loading = useSelector((state) => state.info.loading);
  const [authState, setAuthState] = React.useState({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    expiryDate: localStorage.getItem('expiryDate')
  });
  const dispatch = useDispatch();

  const authChangeHandler = (token, userId, expiryDate) => {
    setAuthState({
      token: token,
      userId: userId,
      expiryDate: expiryDate
    });
  };

  const logoutHandler = () => {
    authChangeHandler(null, null, null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };

  const isLogged = () => {
    return new Date() < new Date(localStorage.getItem('expiryDate'));
  };

  const isLoggedLogic = () => {
    const isLoggedNow = isLogged();
    if (authState.expiryDate && !isLoggedNow) {
      authChangeHandler(null, null, null);
    }
    return isLoggedNow;
  };

  if (isLogged()) {
    dispatch(fetchFlashcards());
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Router>
      <div>
        <PrimaryAppBar
          onLogout={logoutHandler}
          isLogged={isLoggedLogic}
        />
        {loading ? <LinearProgress/> : null}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        {
          <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbar.type}>
              {snackbar.msg}
            </Alert>
          </Snackbar>
        }
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
              {!isLoggedLogic() ? <Login onAuthChange={authChangeHandler}/> : null}
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
