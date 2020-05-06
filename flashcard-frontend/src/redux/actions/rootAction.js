import {axiosServerAuthFunc} from "../../helpers/axiosInstance";

export const INIT_FLASHCARDS_REQUEST = "INIT_FLASHCARDS_REQUEST";
export function initFlashcardsRequest() {
  return {
    type: INIT_FLASHCARDS_REQUEST
  }
}

export const INIT_FLASHCARDS_SUCCESS = "INIT_FLASHCARDS_SUCCESS";
export function initFlashcardsSuccess(flashcards) {
  return {
    type: INIT_FLASHCARDS_SUCCESS,
    flashcards
  }
}

export const INIT_FLASHCARDS_ERROR = "INIT_FLASHCARDS_ERROR";
export function initFlashcardsError(message) {
  return {
    type: INIT_FLASHCARDS_ERROR,
    message
  }
}

export function fetchFlashcards() {
  return function (dispatch, getState) {
    const { flashcardsLoading } = getState();
    console.log('fetchFlashcards -> flasLoading:', flashcardsLoading);
    if (flashcardsLoading.loading) {
      console.log('sorry ale ładuje się!');
      return;
    }
    dispatch(initFlashcardsRequest());

    axiosServerAuthFunc().get(`/flashcard/all`)
      .then(result => {
        if (result.status === 200 || result.status === 204) {
          dispatch(initFlashcardsSuccess(result.data.flashcards));
        }
      })
      .catch(err => {
        let message = "Something go wrong. Please try again later.";
        if (err.request && err.request.response) {
          message = JSON.parse(err.request.response);
        }
        dispatch(initFlashcardsError(message));
      })
  }
}

export const ADD_FLASHCARD = "ADD_FLASHCARD";
export function addFlashcard(flashcard) {
  return {
    type: ADD_FLASHCARD,
    flashcard
  }
}

export const REMOVE_FLASHCARD = "REMOVE_FLASHCARD";
export function removeFlashcard(flashcardId) {
  return {
    type: REMOVE_FLASHCARD,
    flashcardId
  }
}
