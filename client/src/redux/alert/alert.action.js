import { v4 as uuidv4 } from "uuid";
import AlertActionTypes from "./alert.types";

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: AlertActionTypes.SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(
    () => dispatch({ type: AlertActionTypes.REMOVE_ALERT, payload: id }),
    5000
  );
};
