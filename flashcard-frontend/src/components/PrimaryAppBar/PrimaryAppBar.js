import React from 'react';
import {
  Link
} from "react-router-dom";
import {useHistory} from "react-router-dom";

import {axiosServer} from "../../helpers/axiosInstance";
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from "@material-ui/core/InputBase";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  translateTo: {
    marginLeft: '5px',
    marginRight: '5px'
  }
}));

export default function PrimaryAppBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const [search, setSearch] = React.useState({
    word: '',
    from: 'pl',
    to: 'de'
  });

  const onSearchWordChange = (event) => {
    const newValue = event.target.value;
    setSearch(state => ({
      ...state,
      word: newValue
    }));
  };

  const searchHandler = (event) => {
    if(event.key !== 'Enter'){
      return;
    }

    const addQueryParam = (name, current) => {
      if (!current)
        return search[name] !== '' ? `?${name}=` + search[name] : '';
      else {
        const additionalParam = search[name] !== '' ? `&${name}=` + search[name] : '';
        return current + additionalParam;
      }
    };

    let searchWord = addQueryParam('word');
    if (searchWord !== '') {
      if (search.from)
        searchWord = addQueryParam('from', searchWord);
      if (search.to)
        searchWord = addQueryParam('to', searchWord);
    }

    history.push({
      pathname: '/search',
      search: searchWord
    })
  };

  const [languages, setLanguages] = React.useState({
    loading: false,
    loaded: false,
    error: false,
    data: {}
  });

  const fetchLanguages = () => {
    axiosServer.get('/translation/languages')
      .then(result => {
        const lang = result.data;
        setLanguages(state => ({
          ...state,
          loading: false,
          loaded: true,
          data: lang
        }));
        return result;
      })
      .catch(err => {
        let message = JSON.parse(err.request.response);

        setLanguages(state => ({
          ...state,
          loading: false,
          loaded: false,
          error: message
        }));
      })
  };

  if (!languages.loading && !languages.error && !languages.loaded) {
    setLanguages(state => ({
      ...state,
      loading: true
    }));
    fetchLanguages();
  }

  const [fromTo, setFromTo] = React.useState({
    from: '',
    to: ''
  });

  const fromLanguageHandler = (event) => {
    const newFrom = event.target.value;
    setFromTo(state => ({
      ...state,
      from: newFrom
    }));
  };

  const toLanguageHandler = (event) => {
    const newFrom = event.target.value;
    setFromTo(state => ({
      ...state,
      to: newFrom
    }));
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">Home</Link>
          <Typography variant="h6" className={classes.title}>
            FlashcardApp
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fromTo.from}
            onChange={fromLanguageHandler}
          >
            {
              Object.entries(languages.data)
                .filter(([key, value]) => fromTo.to !== value)
                .map(([key, value]) => (
                  <MenuItem value={value} key={key}>{key}</MenuItem>
                ))
            }
          </Select>
          <div className={classes.translateTo}>translate to</div>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fromTo.to}
            onChange={toLanguageHandler}
          >
            {
              Object.entries(languages.data)
                .filter(([key, value]) => fromTo.from !== value)
                .map(([key, value]) => (
                  <MenuItem value={value} key={key}>{key}</MenuItem>
                ))
            }
          </Select>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon/>
            </div>
            <InputBase
              value={search.word}
              onKeyPress={searchHandler}
              onChange={onSearchWordChange}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{'aria-label': 'search'}}
            />
          </div>
          {
            new Date() < new Date(localStorage.getItem('expiryDate')) ?
              <>
                <Button onClick={props.onLogout}>Logout</Button>
                <Link to="/flashcards">
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls='primary-search-account-menu'
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircle/>
                  </IconButton>
                </Link>
              </> :
              <>
                <Link to={{
                  pathname: "/login",
                  state: {handleLogin: true}
                }}>
                  <Button color="inherit">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button color="inherit">Sign Up</Button>
                </Link>
              </>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
