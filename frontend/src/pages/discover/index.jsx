import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";
import { useRouter } from "next/router";
export default function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.discoverContainer}>
          <h1>Discover</h1>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_Users
                .filter((user) => {
                  return (
                    user.userId.username !== authState.user?.userId?.username
                  );
                })
                .map((user) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      key={user._id}
                      className={styles.UserCard}
                    >
                      <img
                        className={styles.UserCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                      <div>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
