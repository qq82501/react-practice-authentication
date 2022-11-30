import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const navigate = useNavigate();
  const refNewPassword = useRef();
  const { token } = useContext(AuthContext);

  const changePasswordHandler = async function (e) {
    e.preventDefault();
    const enteredNewPassword = refNewPassword.current.value;
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAzl3rnwH88H4_LdcRZeNfL3mwf60AwjQQ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: token,
            password: enteredNewPassword,
            returnSecureToken: true,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        navigate("/");
      } else {
        throw new Error(data.error.message);
      }
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={refNewPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
