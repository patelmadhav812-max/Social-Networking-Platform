import { BASE_URL, clientServer } from "@/config";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function viewProfilePage({ userProfile }) {
  const router = useRouter();
  const searchParamers = useSearchParams();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.post);
  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setisConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());

    await dispatch(
      getConnectionsRequest({
        token: localStorage.getItem("token"),
      }),
    );
    await dispatch(
      getMyConnectionRequests({ token: localStorage.getItem("token") }),
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);
  useEffect(() => {
    const profileUserId = userProfile.userId._id;

    // Request that CURRENT USER sent to profile user
    const sentConnection = authState.connections.find(
      (connection) => connection.connectionId?._id === profileUserId,
    );

    // Request that PROFILE USER sent to current user
    const receivedConnection = authState.connectionRequest.find(
      (connection) => connection.userId?._id === profileUserId,
    );

    const connection = sentConnection || receivedConnection;

    console.log("sentConnection:", sentConnection);
    console.log("receivedConnection:", receivedConnection);
    console.log("final connection:", connection);

    if (!connection) {
      setIsCurrentUserInConnection(false);
      setisConnectionNull(true);
      return;
    }

    setIsCurrentUserInConnection(true);

    if (connection.status_accepted === true) {
      setisConnectionNull(false);
    } else {
      setisConnectionNull(true);
    }
  }, [
    authState.connections,
    authState.connectionRequest,
    userProfile.userId._id,
  ]);
  useEffect(() => {
    getUsersPost();
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              {/* LEFT SIDE */}
              <div style={{ flex: "0.7" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>

                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectecdButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          }),
                        );
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`,
                      );
                      window.open(`${BASE_URL}/${response.data}`, "_blank");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2rem" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <p>{userProfile.bio}</p>
                {console.log(userProfile.bio)}
              </div>

              {/* RIGHT SIDE */}
              <div style={{ flex: "0.3" }}>
                <h3>Recent Activity</h3>

                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card__profileContainer}>
                        {post.media !== "" ? (
                          <img src={`${BASE_URL}/${post.media}`} alt="" />
                        ) : (
                          <div
                            style={{
                              width: "3.4rem",
                              height: "3.4rem",
                            }}
                          ></div>
                        )}
                      </div>

                      <p>{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );
  const response = await request.data;
  return { props: { userProfile: request.data.profile } };
}
