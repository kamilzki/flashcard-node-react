import React from 'react';
import { useHistory } from "react-router-dom";
import {axiosServer} from "../../helpers/axiosInstance";

export default function Signup(props) {
  const history = useHistory();
  const email = 'email';
  const password = 'password';
  const name = "name";
  const [inputsState, setInputsState] = React.useState({
    [email]: "",
    [password]: "",
    [name]: ""
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
    axiosServer.put('/auth/signup', {
      email: inputsState.email,
      password: inputsState.password,
      name: inputsState.name
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res;
      })
      .then(resData => {
        console.log(resData);
        history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <form onSubmit={event => onSignup(event, inputsState)}>
        <input
          name={email}
          onChange={onInputChange}
          value={inputsState.email}
        />
        <input
          name={name}
          onChange={onInputChange}
          value={inputsState.name}
        />
        <input
          name={password}
          onChange={onInputChange}
          value={inputsState.password}
        />
        <button>
          Sign Up
        </button>
      </form>
    </>
  );

};