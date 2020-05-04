import React from 'react';
import './Login.css';
import {axiosServer} from '../../helpers/axiosInstance';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const Login = (props) => {
  const email = 'Email';
  const password = 'Password';
  const [inputsState, setInputsState] = React.useState({
    [email]: "",
    [password]: ""
  });

  const onInputChange = (event) => {
    event.persist();
    console.log(event.target.name, event.target.value);
    setInputsState(state => ({
      ...state,
      [event.target.name]: event.target.value
    }));
  };

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      props.onLogout();
    }, milliseconds);
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
    // this.setState({ authLoading: true });
    console.log('loginHandler');
    axiosServer.post('/auth/login', {
      email: authData.email,
      password: authData.password
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.data;
      })
      .then(resData => {
        console.log(resData);
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        props.onAuthChange(resData.token, resData.userId);
        setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        props.onAuthChange(null, null);
      });
  };

  return (
    <>
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
