import {
  ADD_FLASHCARD,
  INIT_FLASHCARDS_ERROR,
  INIT_FLASHCARDS_REQUEST,
  INIT_FLASHCARDS_SUCCESS,
  REMOVE_FLASHCARD
} from '../actions/rootAction';

const initialState = {
  room: null,
  chatLog: [],
  username: null,
  flashcards: [],
  flashcardsError: null,
  flashcardsLoading: {loading: false, loaded: false, error: false}
};

export default function rootReducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState
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
      console.log('ADD_FLASHCARD', action.flashcard);
      state.flashcards = state.flashcards.concat(action.flashcard);
      break;

    case REMOVE_FLASHCARD:
      console.log('REMOVE_FLASHCARD', action.flashcardId);
      state.flashcards = state.flashcards.filter(it => it._id !== action.flashcardId);
      break;
  }
  return state
}