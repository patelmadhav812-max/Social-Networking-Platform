import { getAboutUser } from "@/config/redux/action/authAction";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function Index() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState({});
  const [isChange, setisChange] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  // Work modal
  const [isModalOpen, setisModalOpen] = useState(false);

  // Education modal
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  // Work input
  const [isInput, setisInput] = useState({
    company: "",
    position: "",
    years: "",
  });

  // Education input
  const [educationInput, setEducationInput] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  // ================= GET USER + POSTS =================

  useEffect(() => {
    dispatch(getAboutUser());
    dispatch(getAllPosts());
  }, [dispatch]);

  // ================= SET USER PROFILE =================

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);

      const posts = postReducer.posts.filter((post) => {
        return post?.userId?.username === authState.user?.userId?.username;
      });

      setUserPosts(posts);
    }
  }, [authState.user, postReducer.posts]);

  // ================= WORK INPUT =================

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;

    setisInput({
      ...isInput,
      [name]: value,
    });
  };

  // ================= EDUCATION INPUT =================

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;

    setEducationInput({
      ...educationInput,
      [name]: value,
    });
  };

  // ================= UPDATE PROFILE PICTURE =================

  const updateProfilePicture = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("profile_picture", file);

      const token = localStorage.getItem("token");

      const response = await clientServer.post(
        "/update_profile_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      dispatch(getAboutUser());
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= UPDATE PROFILE DATA =================

  const updateProfileData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Update User
      await clientServer.post(
        "/update_user",
        {
          name: userProfile.userId.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update Profile
      await clientServer.post(
        "/update_profile_data",
        {
          bio: userProfile.bio,
          currentPost: userProfile.currentPost,
          pastWork: userProfile.pastWork,
          education: userProfile.education,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Get updated profile
      await dispatch(getAboutUser());

      setisChange(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= ADD WORK =================

  const addWork = () => {
    if (!isInput.company || !isInput.position) {
      return;
    }

    setUserProfile({
      ...userProfile,
      pastWork: [...(userProfile.pastWork || []), isInput],
    });

    setisChange(true);

    setisModalOpen(false);

    setisInput({
      company: "",
      position: "",
      years: "",
    });
  };

  // ================= ADD EDUCATION =================

  const addEducation = () => {
    if (
      !educationInput.school ||
      !educationInput.degree ||
      !educationInput.fieldOfStudy
    ) {
      return;
    }

    setUserProfile({
      ...userProfile,
      education: [...(userProfile.education || []), educationInput],
    });

    setisChange(true);

    setIsEducationModalOpen(false);

    setEducationInput({
      school: "",
      degree: "",
      fieldOfStudy: "",
    });
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            {/* ================= PROFILE PICTURE ================= */}

            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop_overlay}
              >
                <p>Edit</p>
              </label>

              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                hidden
                type="file"
                id="profilePictureUpload"
              />

              <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="Profile"
              />
            </div>

            {/* ================= PROFILE DETAILS ================= */}

            <div className={styles.profileContainer_details}>
              {/* TOP SECTION */}

              <div className={styles.profileTop}>
                {/* LEFT SIDE */}

                <div className={styles.profileTopLeft}>
                  {/* NAME + USERNAME */}

                  <div className={styles.nameContainer}>
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,

                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });

                        setisChange(true);
                      }}
                    />

                    <p className={styles.username}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  {/* BIO */}

                  <div>
                    <textarea
                      value={userProfile.bio || ""}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          bio: e.target.value,
                        });

                        setisChange(true);
                      }}
                      rows={Math.max(
                        3,
                        Math.ceil((userProfile.bio || "").length / 80),
                      )}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE */}

                <div className={styles.profileTopRight}>
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
                            />
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= WORK HISTORY ================= */}

              <div className={styles.workHistory}>
                <h4>Work History</h4>

                <div className={styles.workHistoryContainer}>
                  {userProfile.pastWork?.map((work, index) => (
                    <div
                      key={work._id || index}
                      className={styles.workHistoryCard}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>

                      <p>{work.years}</p>
                    </div>
                  ))}

                  <button
                    className={styles.addWorkBtn}
                    onClick={() => {
                      setisModalOpen(true);
                    }}
                  >
                    Add Work
                  </button>
                </div>
              </div>

              {/* ================= EDUCATION ================= */}

              <div className={styles.workHistory}>
                <h4>Education</h4>

                <div className={styles.workHistoryContainer}>
                  {userProfile.education?.map((education, index) => (
                    <div
                      key={education._id || index}
                      className={styles.workHistoryCard}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {education.school}
                      </p>

                      <p>
                        {education.degree} - {education.fieldOfStudy}
                      </p>
                    </div>
                  ))}

                  <button
                    className={styles.addWorkBtn}
                    onClick={() => {
                      setIsEducationModalOpen(true);
                    }}
                  >
                    Add Education
                  </button>
                </div>
              </div>

              {/* ================= UPDATE BUTTON ================= */}

              {isChange && (
                <div
                  onClick={() => {
                    updateProfileData();
                  }}
                  className={styles.connectBtn}
                >
                  Update Profile
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= WORK MODAL ================= */}

        {isModalOpen && (
          <div
            onClick={() => {
              setisModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleWorkInputChange}
                type="text"
                className={styles.inputField}
                name="company"
                value={isInput.company}
                placeholder="Enter Company"
              />

              <input
                onChange={handleWorkInputChange}
                type="text"
                className={styles.inputField}
                name="position"
                value={isInput.position}
                placeholder="Enter Position"
              />

              <input
                onChange={handleWorkInputChange}
                type="text"
                className={styles.inputField}
                name="years"
                value={isInput.years}
                placeholder="Enter Years"
              />

              <div onClick={addWork} className={styles.connectBtn}>
                Add Work
              </div>
            </div>
          </div>
        )}

        {/* ================= EDUCATION MODAL ================= */}

        {isEducationModalOpen && (
          <div
            onClick={() => {
              setIsEducationModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleEducationInputChange}
                type="text"
                className={styles.inputField}
                name="school"
                value={educationInput.school}
                placeholder="Enter School / College"
              />

              <input
                onChange={handleEducationInputChange}
                type="text"
                className={styles.inputField}
                name="degree"
                value={educationInput.degree}
                placeholder="Enter Degree"
              />

              <input
                onChange={handleEducationInputChange}
                type="text"
                className={styles.inputField}
                name="fieldOfStudy"
                value={educationInput.fieldOfStudy}
                placeholder="Enter Field of Study"
              />

              <div onClick={addEducation} className={styles.connectBtn}>
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
