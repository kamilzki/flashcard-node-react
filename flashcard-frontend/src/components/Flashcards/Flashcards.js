import React from 'react';
import {axiosServerAuthFunc} from "../../helpers/axiosInstance";
import Flashcard from "./Flashcard/Flashcard";
import './Flashcards.css'
import Alert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";

const Flashcards = (props) => {
  const [flashcards, setFlashcards] = React.useState(null);
  const [loading, setLoading] = React.useState({loading: false, loaded: false, error: false});
  const [removeSnackbar, setRemoveSnackbar] = React.useState({open: false, type: null, msg: null});

  const fetchFlashcards = () => {
    axiosServerAuthFunc().get(`/flashcard/all`)
      .then(result => {
        if (result.status === 200 || result.status === 204) {
          setFlashcards(state => (result.data.flashcards));
          setLoading(state => ({
            ...state,
            loading: false,
            loaded: true
          }));
        }
        return result;
      })
      .catch(err => {
        let message = {message: 'Something go wrong. Please try again later.'};
        if (err.request && err.request.response) {
          message = JSON.parse(err.request.response);
        }

        setLoading(state => ({
          ...state,
          loading: false,
          loaded: false,
          error: message
        }));
        setFlashcards(state => ([]));
      })
  };

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
        const withoutDeleted = flashcards.filter(it => it._id !== flashcardId);
        setFlashcards(state => (withoutDeleted));
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

  let gotResponseFromServer = !loading.error && !loading.loaded;
  if (!loading.loading && gotResponseFromServer) {
    setLoading(state => ({
      ...state,
      loading: true
    }));
    fetchFlashcards();
  }

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
            <LinearProgress />
    }
  </div>;
};

export default Flashcards;
