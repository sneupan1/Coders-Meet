import AuthActionTypes from "./auth.types";

const INITIAL_STATE = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case AuthActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case AuthActionTypes.REGISTER_SUCCESS:
    case AuthActionTypes.LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case AuthActionTypes.REGISTER_FAIL:
    case AuthActionTypes.AUTH_ERROR:
    case AuthActionTypes.LOGIN_FAIL:
    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};
