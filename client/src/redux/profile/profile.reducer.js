import { ProfileActionTypes } from "./profile.types.js";
const {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  CLEAR_PROFILES,
  UPDATE_PROFILE,
  GET_REPOS,
  GET_PROFILE_BY_ID,
  CLEAR_PROFILE_BY_ID,
  FETCH_PROFILES_START,
  FETCH_PROFILES_SUCCESS,
  FETCH_PROFILE_START,
  FETCH_PROFILE_SUCCESS,
} = ProfileActionTypes;

const INITIALSTATE = {
  profile: null,
  profileById: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
  isFetching: false,
};

export default function (state = INITIALSTATE, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_PROFILE_SUCCESS:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
        isFetching: false,
      };
    case FETCH_PROFILE_START:
    case FETCH_PROFILES_START:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: payload,
        loading: false,
        isFetching: false,
      };
    case GET_PROFILE_BY_ID:
      return {
        ...state,
        profileById: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
        profileById: null,
        isFetching: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    case CLEAR_PROFILE_BY_ID:
      return {
        ...state,
        profileById: null,
        loading: false,
      };
    case CLEAR_PROFILES:
      return {
        ...state,
        profiles: [],
        loading: false,
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      };

    default:
      return state;
  }
}
