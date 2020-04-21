import React from 'react';
import {axiosServer} from '../../helpers/axiosInstance';

const Login = (props) => {
  const email = 'email';
  const password = 'password';
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

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      props.onLogout();
    }, milliseconds);
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
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
        props.onAuthChange(true, resData.token, resData.userId);
        setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        props.onAuthChange(false, null, null);
      });
  };

  return (
    <>
      <form
        onSubmit={e =>
          loginHandler(e, {
            email: inputsState.email,
            password: inputsState.password
          })
        }
      >
        <input
          name={email}
          onChange={onInputChange}
          value={inputsState.email}
        />
        <input
          name={password}
          onChange={onInputChange}
          value={inputsState.password}
        />
        <button>
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
