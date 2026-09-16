import Router from "express";

import {
  register,
  login,
  updateProfilePicture,
  updateUserProfile,
  getUserProfile,
  updateprofiledate,
  getAllUser,
  downloadProfile,
  sendConnectionReq,
  getMyConnectionsRequests,
  WhaAreMyConnections,
  acceptConnectionRequest,
  getUserBytheirProfilePicture,
} from "../controller/user.controller.js";

import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// PUBLIC ROUTES
// Create User Route
router.route("/register").post(register);
// Login User Route
router.route("/login").post(login);
// Get All user Route
router.route("/get_all_User").get(getAllUser);
// Get download Resume Route
router.route("/user/download_resume").get(downloadProfile);
// Get user By their profilePicture
router
  .route("/user/get_profile_based_on_username")
  .get(getUserBytheirProfilePicture);

// PROTECTED ROUTES

// Profile Picture Route
router
  .route("/update_profile_picture")
  .post(authMiddleware, upload.single("profile_picture"), updateProfilePicture);

// Update User Route
router.route("/update_user").post(authMiddleware, updateUserProfile);

// Get Own Profile Route
router.route("/get_user_profile").get(authMiddleware, getUserProfile);

// Update Profile Data Route
router.route("/update_profile_data").post(authMiddleware, updateprofiledate);

// Send Connection Request Route
router
  .route("/user/send_connection_request")
  .post(authMiddleware, sendConnectionReq);

// Get Connection Requests Route
router
  .route("/user/getConnectionRequests")
  .get(authMiddleware, getMyConnectionsRequests);

// Get My Connections Route
router
  .route("/user/user_connection_request")
  .get(authMiddleware, WhaAreMyConnections);

// Accept Connection Request Route
router
  .route("/user/accept_connection_request")
  .post(authMiddleware, acceptConnectionRequest);

export default router;
