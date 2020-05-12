import React from 'react';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import "./Signup.css";

import {hideLoading, showLoading} from "../../redux/actions/rootAction";

import {axiosServer} from "../../helpers/axiosInstance";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from '@material-ui/lab/Alert';

export default function Signup(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const email = 'Email';
  const password = 'Password';
  const name = "Name";
  const [inputsState, setInputsState] = React.useState({
    [email]: "",
    [password]: "",
    [name]: "",
    errors: []
  });

  const onInputChange = (event) => {
    event.persist();
    setInputsState(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  };

  const onSignup = (event, authData) => {
    event.preventDefault();
    dispatch(showLoading());
    axiosServer.put('/auth/signup', {
      email: inputsState[email],
      password: inputsState[password],
      name: inputsState[name]
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating a user failed!');
        }
        return res;
      })
      .then(resData => {
        history.push('/');
        dispatch(hideLoading());
      })
      .catch(err => {
        setInputsState(state => ({
          ...state,
          errors: err.response.data.data
        }));
        dispatch(hideLoading());
      });
  };

  return (
    <>
      <div className="errors">
      {
        inputsState.errors.map(err => (
          <Alert variant="filled" severity="error">
            {err.msg === "Invalid value" ? `${err.msg} - ${err.param}` : err.msg}
          </Alert>
        ))
      }
      </div>
      <form onSubmit={event => onSignup(event, inputsState)}>
        <div className="textField">
          <TextField
            fullWidth
            label={email}
            name={email}
            onChange={onInputChange}
            value={inputsState[email]}
          />
        </div>
        <div className="textField">
          <TextField
            fullWidth
            label={name}
            name={name}
            onChange={onInputChange}
            value={inputsState[name]}
          />
        </div>
        <div className="textField">
          <TextField
            fullWidth
            type="password"
            label={password}
            name={password}
            autoComplete="current-password"
            onChange={onInputChange}
            value={inputsState[password]}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Sign Up
        </Button>
      </form>
    </>
  );

};