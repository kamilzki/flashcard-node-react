import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import './Flashcards.css'

import {removeFlashcard} from "../../redux/actions/rootAction";

import Flashcard from "./Flashcard/Flashcard";
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";

const Flashcards = (props) => {
  const [removeSnackbar, setRemoveSnackbar] = React.useState({open: false, type: null, msg: null});
  const loading = useSelector((state) => state.flashcardsLoading);
  const flashcards = useSelector((state) => state.flashcards);
  const dispatch = useDispatch();

  const closeRemoveSnackbar = () => {
    setRemoveSnackbar(state => ({
      open: false,
      type: "",
      msg: ""
    }));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeRemoveSnackbar();
  };

  const removeFlashcardHandler = (flashcardId) => {
    closeRemoveSnackbar();
    axiosServerAuthFunc().delete('/flashcard/' + flashcardId)
      .then(_ => {
        dispatch(removeFlashcard(flashcardId));
        setRemoveSnackbar(state => ({
          open: true,
          type: "success",
          msg: "Successfully deleted"
        }));
      })
      .catch(err => {
        let message = {message: 'Something go wrong. Please try again later.'};
        if (err.request.response) {
          const response = JSON.parse(err.request.response);
          if (response instanceof String) {
            message = response;
          } else if (response instanceof Object && response.message) {
            message = response.message;
          }
        }
        setRemoveSnackbar(state => ({
          open: true,
          type: "error",
          msg: message
        }));
      })
  };

  return <div>
    {
      <Snackbar open={removeSnackbar.open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={removeSnackbar.type}>
          {removeSnackbar.msg}
        </Alert>
      </Snackbar>
    }
    {
      loading.error ?
        <Alert className="alertInfo" variant="filled" severity="error">
          {loading.error.message}
        </Alert> :
        loading.loaded && flashcards && flashcards.length > 0 ?
          <div className="flashcards">
            {
              flashcards.map(it => (
                <Flashcard
                  flashcard={it}
                  removeFlashcard={removeFlashcardHandler}
                  key={it._id}
                />
              ))
            }
          </div> :
          loading.loaded ?
            <Alert className="alertInfo" variant="filled" severity="info">
              Not found any flashcards
            </Alert> :
            <LinearProgress/>
    }
  </div>;
};

export default Flashcards;
