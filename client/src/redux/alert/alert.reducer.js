import AlertActionTypes from "./alert.types";
const INITIAL_STATE = [];

const alertReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case AlertActionTypes.SET_ALERT:
      state = state.filter((alert) => alert.msg !== payload.msg);
      return [...state, payload];
    case AlertActionTypes.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export default alertReducer;
