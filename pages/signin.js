import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginSuccess } from "../reducer";
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";
import { auth, db } from "../utils/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
const Signin = () => {
  const { user } = useSelector((state) => state.user);
  React.useEffect(() => {
    if (user && user?.email) {
      window.location.href = "/";
    } else {
      return;
    }
  }, [user]);
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const reduxDispatch = useDispatch();
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.signInWithPopup(googleProvider);
      const user = res.user;
      const idTokenResult = await user.getIdTokenResult();
      const date = new Date();
      await db
        .collection("users")
        .doc(user.email)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            var separatedString = doc.data();
            reduxDispatch(
              loginSuccess({
                name: separatedString.name,
                email: separatedString.email,
                role: separatedString.role,
                date: separatedString.date,
              })
            );

            router.push("/");
          } else {
            await db
              .collection("users")
              .doc(user.email)
              .set({
                name: user.email.split("@")[0],
                role: "user",
                date: date.toDateString(),
                url:
                  user.photoURL ??
                  "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                email: user.email,
              })
              .then(() => {
                reduxDispatch(
                  loginSuccess({
                    name: user.email.split("@")[0],
                    email: user.email,
                    date: date.toDateString(),
                    role: "user",
                    url:
                      user.photoURL ??
                      "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
                  })
                );

                router.push("/");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .then(() => {
          toast.success("successfully login");
        });
    } catch (err) {
      console.error(err);
      //toast.error(err.message);
    }
  };
  return (
    <>
      <div className="techwave_fn_sign">
        <div className="sign__content">
          <h1 className="logo">Designed by Frenify</h1>
          <form className="login">
            <div className="form__content">
              <div className="form__title">Sign In</div>
              <div className="form__username">
                <label for="user_login">Username or Email</label>
                <input
                  type="text"
                  className="input"
                  id="user_login"
                  autocapitalize="off"
                  autocomplete="username"
                  aria-describedby="login-message"
                />
              </div>
              <div className="form__pass">
                <div className="pass_lab">
                  <label for="user_password">Password</label>
                  <Link href="/">Forget Password?</Link>
                </div>
                <input
                  type="password"
                  id="user_password"
                  autocomplete="current-password"
                  spellcheck="false"
                />
              </div>
              <div className="form__submit">
                <label className="fn__submit">
                  <input type="submit" name="submit" value="Sign In" />
                </label>
              </div>
              <div className="form__alternative">
                <div className="fn__lined_text">
                  <div className="line"></div>
                  <div className="text">Or</div>
                  <div className="line"></div>
                </div>
                <a
                  href=""
                  onClick={signInWithGoogle}
                  className="techwave_fn_button"
                >
                  <span>Sign in with Google</span>
                </a>
              </div>
            </div>
          </form>
          <div className="sign__desc">
            <p>
              Not a member? <a href="sign-up.html">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signin;
