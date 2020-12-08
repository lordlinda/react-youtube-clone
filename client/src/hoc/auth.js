import React, { useEffect } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

export default function (ComposedClass, reload, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(async (response) => {
        /**this means ur not authentcated */
        if (await !response.payload.isAuth) {
          /**if true */
          /**reload determines if u can acess the function
           * if null,it means  u can access wthout authentication
           * if false means u cant access after auth
           * if true means u can acess after auth
           */
          if (reload) {
            props.history.push("/register_login");
          }
          /**this runs if someone is authenticated
           * so it reload can be false
           */
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            /**when ur auth u cant acess this page */
            if (reload === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, [dispatch, props.history, user.googleAuth]);

    return <ComposedClass {...props} user={user} />;
  }
  return AuthenticationCheck;
}
