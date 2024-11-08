import "../styles/globals.css";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../reducer";
import { auth, db } from "../utils/Firebase";
import { wrapper, store } from "../reducer/user";
import { Provider } from "react-redux";
import React from "react";
function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await db
          .collection("users")
          .doc(user.email)
          .get()
          .then((doc) => {
            if (doc && doc.exists) {
              var separatedString1 = doc.data();
              dispatch(
                loginSuccess({
                  name: separatedString1.name,
                  email: separatedString1.email,
                  url: separatedString1.url,
                  date: separatedString1.date,
                  role: separatedString1.role,
                })
              );
            } else {
              dispatch(loginSuccess({}));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
