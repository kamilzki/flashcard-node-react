import React from 'react';
import { useHistory } from "react-router-dom";

import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from "@material-ui/core/InputBase";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import {
  Link
} from "react-router-dom";

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
}));

export default function PrimaryAppBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const [search, setSearch] = React.useState("");

  const handleProfileMenuOpen = (event) => {

  };

  const onSearchChange = (event) => {
    const newValue = event.target.value;
    setSearch(state => (newValue));
  };

  const searchHandler = (event) => {
    history.push(`/search${search !== "" ? '?word=' + search : "" }`)
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">Home</Link>
          <Typography variant="h6" className={classes.title}>
            FlashcardApp
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon/>
            </div>
            <InputBase
              value={search}
              onKeyPress={searchHandler}
              onChange={onSearchChange}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{'aria-label': 'search'}}
            />
          </div>
          {
            props.isAuth ?
              <>
                <Button onClick={props.onLogout}>Logout</Button>
                <Link to="/flashcards">
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls='primary-search-account-menu'
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
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
