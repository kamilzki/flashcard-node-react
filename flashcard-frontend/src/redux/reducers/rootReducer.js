import {
  ADD_FLASHCARD,
  CLOSE_SNACKBAR,
  HIDE_LOADING,
  INIT_FLASHCARDS_ERROR,
  INIT_FLASHCARDS_REQUEST,
  INIT_FLASHCARDS_SUCCESS,
  OPEN_SNACKBAR,
  REMOVE_FLASHCARD,
  SHOW_LOADING
} from '../actions/rootAction';
import {combineReducers} from "redux";

const initialFlashcardState = {
  flashcards: [],
  flashcardsLoading: {loading: false, loaded: false, error: false}
};

function flashcardReducer(state, action) {
  if (typeof state === 'undefined') {
    return initialFlashcardState
  }

  switch (action.type) {
    case INIT_FLASHCARDS_REQUEST:
      state.flashcardsLoading.loading = true;
      break;

    case INIT_FLASHCARDS_SUCCESS:
      state.flashcards = action.flashcards;
      state.flashcardsLoading.loaded = true;
      state.flashcardsLoading.loading = false;
      state.flashcardsLoading.error = false;
      break;

    case INIT_FLASHCARDS_ERROR:
      state.flashcardsLoading.loaded = false;
      state.flashcardsLoading.loading = false;
      state.flashcardsLoading.error = action.message;
      break;

    case ADD_FLASHCARD:
      state.flashcards = state.flashcards.concat(action.flashcard);
      break;

    case REMOVE_FLASHCARD:
      state.flashcards = state.flashcards.filter(it => it._id !== action.flashcardId);
      break;
  }
  return state
}

const initialInfoState = {
  snackbar: {open: false, type: null, msg: null},
  loading: false
};

function infoReducer(state = initialInfoState, action) {
  if (typeof state === 'undefined') {
    return initialInfoState
  }

  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbar: {
          open: true,
          type: action.snackbarType,
          msg: action.msg
        }
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
          msg: ""
        }
      };

    case SHOW_LOADING:
      return {
        ...state,
        loading: true
      };

    case HIDE_LOADING:
      return {
        ...state,
        loading: false
      };
  }

  return state;
}

export default combineReducers({
  flashcards: flashcardReducer,
  info: infoReducer
});