import React, { useState, useEffect } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

let autoLogout;

// calculate remaining time to token expires
const calculateRemainTime = function (expirationTime) {
  const currentTimestamp = new Date().getTime();
  const expirationTimestamp = new Date(expirationTime).getTime();
  const remainingTimestamp = expirationTimestamp - currentTimestamp;
  return remainingTimestamp;
};

// whenever reload page, get token and token expiration time.
const retrieveStoredToken = function () {
  const storedToken = localStorage.getItem("token");
  const storedExpiration = localStorage.getItem("expirationTime");
  if (storedToken) {
    const remainingTimestamp = calculateRemainTime(storedExpiration);
    // if token goes to expire with 1 sec, deleting token & expirationTime in localstorage
    if (remainingTimestamp < 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      return null;
      // if token is not about to expire, return token and remaining time.
    } else {
      return { token: storedToken, expirationTime: remainingTimestamp };
    }
  }
};

export const AuthContextProvider = function (props) {
  // go to get current token data and remaining time once website loaded.
  const tokenData = retrieveStoredToken();

  //***** this part just little test for javascript API, WORKS!*/
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAzl3rnwH88H4_LdcRZeNfL3mwf60AwjQQ",
  //   projectId: "authentication-9b929",
  // };
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  //***** triggerd once idToken changed (login, logout, refresh)*/
  // auth.onIdTokenChanged(() => {
  //   console.log("changeeeee");
  // });

  const logoutHandler = function () {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    clearTimeout(autoLogout);
  };

  const [token, setToken] = useState(tokenData ? tokenData.token : null);

  useEffect(() => {
    // if there is valid token, continue its auto-logout count down.
    if (tokenData) {
      autoLogout = setTimeout(logoutHandler, tokenData.expirationTime);
    }
  }, [tokenData]);

  const isUserLoggedIn = !!token;

  const loginHandler = function (token, expirationTime) {
    const remainingTimestamp = calculateRemainTime(expirationTime);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    setToken(token);
    autoLogout = setTimeout(logoutHandler, remainingTimestamp);
  };
  const contextValue = {
    token,
    isLoggedIn: isUserLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
