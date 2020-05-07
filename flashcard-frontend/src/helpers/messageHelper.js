export const SUCCESSFULLY_ADDED = "Successfully added!";
export const SUCCESSFULLY_DELETED = "Successfully deleted!";
export const STH_GO_WRONG = 'Something go wrong. Please try again later.';

export function getErrorMessage(errRequest) {
  let message = STH_GO_WRONG;
  if (errRequest.request && errRequest.request.response) {
    const response = JSON.parse(errRequest.request.response);
    if (response instanceof String) {
      message = response;
    } else if (response instanceof Object && response.message) {
      message = response.message;
    }
  }
  return message;
}