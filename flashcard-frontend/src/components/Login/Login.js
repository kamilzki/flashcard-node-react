import React from 'react';
import {useDispatch} from "react-redux";
import './Login.css';

import {hideLoading, showLoading} from "../../redux/actions/rootAction";

import {axiosServer} from '../../helpers/axiosInstance';
import {getErrorMessage} from "../../helpers/messageHelper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";

const Login = (props) => {
  const dispatch = useDispatch();

  const email = 'Email';
  const password = 'Password';
  const [error, setError] = React.useState(null);
  const [inputsState, setInputsState] = React.useState({
    [email]: "",
    [password]: ""
  });

  const onInputChange = (event) => {
    event.persist();
    setInputsState(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
    dispatch(showLoading());
    // this.setState({ authLoading: true });
    axiosServer.post('/auth/login', {
      email: authData.email,
      password: authData.password
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Could not authenticate you!');
        }
        return res.data;
      })
      .then(resData => {
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);
        localStorage.setItem('expiryDate', resData.expiryDate);

        props.onAuthChange(resData.token, resData.userId, resData.expiryDate);
        setError(_ => null);
        dispatch(hideLoading());
      })
      .catch(err => {
        setError(_ => getErrorMessage(err));
        props.onAuthChange(null, null);
        dispatch(hideLoading());
      });
  };

  return (
    <>
      {!error ? null :
        <div className="errors">
          {
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          }
        </div>
      }
      <form
        onSubmit={e =>
          loginHandler(e, {
            email: inputsState[email],
            password: inputsState[password]
          })
        }
      >
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
          Login
        </Button>
      </form>
    </>
  );
};

export default Login;
