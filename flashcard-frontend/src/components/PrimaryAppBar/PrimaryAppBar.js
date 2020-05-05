import React from 'react';
import {
  Link
} from "react-router-dom";
import {useHistory} from "react-router-dom";

import {axiosServer, axiosServerAuthFunc} from "../../helpers/axiosInstance";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer'
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
  const urlSearchParams = new URLSearchParams(history.location.search);
  const wordParam = urlSearchParams.get('word');
  const [search, setSearch] = React.useState({
    word: wordParam ? wordParam : '',
    wordSearch: wordParam ? wordParam : '',
    from: 'pl',
    to: 'de',
    suggestions: wordParam ? [wordParam] : [],
  });

  const searchHandler = () => {
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
    });
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
        let message = 'Something go wrong. Please try again later.';
        if (err.request.response) {
          message = JSON.parse(err.request.response);
        }
        setLanguages(state => ({
          ...state,
          loading: false,
          loaded: false,
          error: message
        }));
      })
  };

  const fetchSuggestions = () => {
    axiosServerAuthFunc().get(`/translation/suggestion/${search.wordSearch}?from=${search.from}&to=${search.to}`, {})
      .then(result => {
        if (result.status === 200 || result.status === 204) {
          setSearch(state => ({
            ...state,
            suggestions: result.data
          }));
        }
        setLoadingSuggestions(() => false);

        return result;
      })
      .catch(err => {
        setSearch(state => ({
          ...state,
          suggestions: []
        }));
        setLoadingSuggestions(() => false);
      })
  };

  if (!languages.loading && !languages.error && !languages.loaded) {
    setLanguages(state => ({
      ...state,
      loading: true
    }));
    fetchLanguages();
  }

  const fromLanguageHandler = (event) => {
    const newFrom = event.target.value;
    setSearch(state => ({
      ...state,
      from: newFrom
    }));
  };

  const toLanguageHandler = (event) => {
    const newFrom = event.target.value;
    setSearch(state => ({
      ...state,
      to: newFrom
    }));
  };

  const linkToHome = () => {
    history.push({
      pathname: '/'
    })
  };

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (search.wordSearch) {
      fetchSuggestions();
    }
  }, [search.wordSearch]);

  React.useEffect(() => {
    searchHandler();
  }, [search.word]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} onClick={linkToHome}>
            FlashcardApp
          </Typography>
          {
            props.isLogged() ?
              <>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={search.from}
                  onChange={fromLanguageHandler}
                >
                  {
                    Object.entries(languages.data)
                      .filter(([key, value]) => search.to !== value)
                      .map(([key, value]) => (
                        <MenuItem value={value} key={key}>{key}</MenuItem>
                      ))
                  }
                </Select>
                <div className={classes.translateTo}>translate to</div>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={search.to}
                  onChange={toLanguageHandler}
                >
                  {
                    Object.entries(languages.data)
                      .filter(([key, value]) => search.from !== value)
                      .map(([key, value]) => (
                        <MenuItem value={value} key={key}>{key}</MenuItem>
                      ))
                  }
                </Select>
                <div className={classes.search}>
                  <Autocomplete
                    freeSolo
                    style={{width: 300}}
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                      if (search.wordSearch)
                        fetchSuggestions()
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    // onKeyPress={searchHandler}
                    inputValue={search.wordSearch}
                    value={search.word}
                    onChange={(event, newInputValue) => {
                      const newValue = newInputValue ? newInputValue.value : "";
                      setSearch(state => ({
                        ...state,
                        word: newValue,
                        wordSearch: newValue
                      }));
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => option.value}
                    options={search.suggestions}
                    loading={loadingSuggestions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Search…"
                        onChange={event => {
                          const newValue = event.target.value;
                          setSearch(state => ({
                            ...state,
                            wordSearch: newValue
                          }));
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon/>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <React.Fragment>
                              {loadingSuggestions ? <CircularProgress color="inherit" size={20}/> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
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
