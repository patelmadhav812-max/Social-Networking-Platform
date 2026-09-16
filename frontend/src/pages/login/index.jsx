import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Clear message when changing Sign Up / Sign In
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  // Redirect after successful login/register
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  // Check token when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !authState.loggedIn) {
      router.push("/dashboard");
    }
  }, []);

  const handleRegister = () => {
    console.log("....register");

    dispatch(
      registerUser({
        username,
        password,
        name,
        email,
      }),
    );
  };

  const handleLogin = () => {
    console.log("login");

    dispatch(
      loginUser({
        email,
        password,
      }),
    );
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? "Sign in" : "Sign up"}
            </p>

            <p
              style={{
                color: authState.isError ? "red" : "green",
              }}
            >
              {authState.message?.message}
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className={styles.inputField}
                    name="username"
                    placeholder="username"
                  />

                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className={styles.inputField}
                    name="name"
                    placeholder="name"
                  />
                </div>
              )}

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={styles.inputField}
                name="password"
                placeholder="password"
              />

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                type="email"
                className={styles.inputField}
                name="email"
                placeholder="email"
              />

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            <div>
              {userLoginMethod ? (
                <p>Don't have an Account?</p>
              ) : (
                <p>Already have an Account</p>
              )}

              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                style={{
                  color: "black",
                  textAlign: "center",
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
