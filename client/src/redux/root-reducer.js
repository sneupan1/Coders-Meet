import { combineReducers } from "redux";
import alertReducer from "./alert/alert.reducer";
import authReducer from "./auth/auth.reducer";

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
});
