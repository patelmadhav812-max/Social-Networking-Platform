import React from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <p>Hey {authState.user.userId.name}</p>
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Profile
              </p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Logout
              </p>
            </div>
          )}
          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
