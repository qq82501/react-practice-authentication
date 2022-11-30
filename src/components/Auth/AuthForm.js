import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const refEmail = useRef();
  const refPassword = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    let url;
    const enteredEmail = refEmail.current.value;
    const enteredPasseord = refPassword.current.value;

    if (isLogin) {
      // find a correspoinding endpoint in [https://firebase.google.com/docs/reference/rest/auth#section-api-usage]
      // Login
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAzl3rnwH88H4_LdcRZeNfL3mwf60AwjQQ";
    } else {
      // Sign up
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAzl3rnwH88H4_LdcRZeNfL3mwf60AwjQQ";
    }

    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPasseord,
          returnSecureToken: true,
        }),
      });

      setIsLoading(false);
      const data = await res.json();
      if (res.ok) {
        //create expiration time
        const expirationTime = new Date(
          new Date().getTime() + data.expiresIn * 1000
        );

        // idToken is generated by successful sign in / login HTTP request.
        //login user then automatically logout after expirationTime passed
        authCtx.login(data.idToken, expirationTime);
        navigate("/");
      } else {
        if (data.error && data.error.message) {
          throw new Error(data.error.message);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={refEmail} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={refPassword} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>sending...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;