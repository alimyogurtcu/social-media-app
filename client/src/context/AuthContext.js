import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

var INITIAL_STATE = {
  user: null,
  isFecthing: false,
  error: false,
};

var localUser = localStorage.getItem("user");

if (localUser) {
  INITIAL_STATE.user = JSON.parse(localStorage.getItem("user"));
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFecthing: state.isFecthing,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};