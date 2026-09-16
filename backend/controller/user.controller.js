// import Post from "../models/posts.model.js";
// import User from "../models/users.models.js";
// import Connection from "../models/connection.models.js";
// import { Profile } from "../models/profile.models.js";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// /* =========================
//    CONVERT USER DATA TO PDF
// ========================= */
// const convertUserDataTOPDF = async (userData) => {
//   const doc = new PDFDocument();
//   const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
//   const stream = fs.createWriteStream("uploads/" + outputPath);

//   doc.pipe(stream);

//   /* PROFILE PICTURE */
//   const profilePicture = userData.userId.profilePicture || "defaultProfile.png";
//   const imagePath = path.join(process.cwd(), "uploads", profilePicture);

//   try {
//     if (fs.existsSync(imagePath)) {
//       doc.image(imagePath, { align: "center", width: 100 });
//       doc.moveDown();
//     } else {
//       console.log("Image not found, skipping:", imagePath);
//     }
//   } catch (err) {
//     console.log("Invalid image format, skipping:", imagePath, err.message);
//   }
//   /* =========================
//      USER INFORMATION
//   ========================= */

//   doc.fontSize(14).text(`Name: ${userData.userId.name}`);

//   doc.fontSize(14).text(`Email: ${userData.userId.email}`);

//   doc.fontSize(14).text(`Bio: ${userData.bio}`);

//   doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

//   doc.moveDown();

//   /* =========================
//      PAST WORK
//   ========================= */

//   doc.fontSize(16).text("Past Work:");

//   doc.moveDown();

//   if (userData.pastWork && userData.pastWork.length > 0) {
//     userData.pastWork.forEach((work) => {
//       doc.fontSize(14).text(`Company: ${work.company}`);

//       doc.fontSize(14).text(`Position: ${work.position}`);

//       doc.fontSize(14).text(`Year: ${work.years}`);

//       doc.moveDown();
//     });
//   } else {
//     doc.fontSize(14).text("No past work information");

//     doc.moveDown();
//   }

//   /* =========================
//      EDUCATION
//   ========================= */

//   doc.fontSize(16).text("Education:");

//   doc.moveDown();

//   if (userData.education && userData.education.length > 0) {
//     userData.education.forEach((education) => {
//       doc.fontSize(14).text(`School: ${education.school}`);

//       doc.fontSize(14).text(`Degree: ${education.degree}`);

//       doc.fontSize(14).text(`Field of Study: ${education.fieldOfStudy}`);

//       doc.moveDown();
//     });
//   } else {
//     doc.fontSize(14).text("No education information");
//   }

//   /* =========================
//      FINISH PDF
//   ========================= */

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => {
//       console.log("PDF created:", outputPath);

//       resolve(outputPath);
//     });

//     stream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };

// /* =========================
//    REGISTER
// ========================= */

// const register = async (req, res) => {
//   console.log(req.body);

//   try {
//     const { username, name, email, password } = req.body;

//     if (!username || !name || !email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const profile = new Profile({
//       userId: newUser._id,
//     });

//     await profile.save();

//     return res.status(201).json({
//       message: "User registered successfully",
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

// /* =========================
//    LOGIN
// ========================= */

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "User does not exist",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(400).json({
//         message: "Invalid password",
//       });
//     }

//     const token = crypto.randomBytes(64).toString("hex");

//     await User.updateOne({ _id: user._id }, { token });

//     return res.json({
//       message: "Login successful",
//       token,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// /* =========================
//    UPDATE PROFILE PICTURE
// ========================= */

// const updateProfilePicture = async (req, res) => {
//   const { token } = req.body;

//   try {
//     const user = await User.findOne({
//       token: token,
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "User does not exist",
//       });
//     }

//     user.profilePicture = req.file.filename;

//     await user.save();

//     return res.status(200).json({
//       message: "Profile picture successfully changed",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// /* =========================
//    UPDATE USER
// ========================= */

// const updateUserProfile = async (req, res) => {
//   try {
//     const { token, ...newUser } = req.body;

//     const user = await User.findOne({
//       token: token,
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User does not exist",
//       });
//     }

//     const { username, email } = newUser;

//     const existingUser = await User.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (existingUser && String(existingUser._id) !== String(user._id)) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     Object.assign(user, newUser);

//     await user.save();

//     return res.status(200).json({
//       message: "User updated",
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

// /* =========================
//    GET USER PROFILE
// ========================= */

// const getUserProfile = async (req, res) => {
//   try {
//     const { token } = req.query;

//     const user = await User.findOne({
//       token,
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const userProfile = await Profile.findOne({
//       userId: user._id,
//     }).populate("userId", "name email username profilePicture");

//     return res.json(userProfile);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// /* =========================
//    UPDATE PROFILE DATA
// ========================= */

// const updateprofiledate = async (req, res) => {
//   try {
//     const { token, ...profileData } = req.body;

//     const user = await User.findOne({
//       token,
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const profile = await Profile.findOne({
//       userId: user._id,
//     });

//     if (!profile) {
//       return res.status(404).json({
//         message: "Profile not found",
//       });
//     }

//     Object.assign(profile, profileData);

//     await profile.save();

//     return res.status(200).json({
//       message: "User profile updated successfully",
//       profile,
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

// /* =========================
//    GET ALL USERS
// ========================= */

// const getAllUser = async (req, res) => {
//   try {
//     const profile = await Profile.find().populate(
//       "userId",
//       "name username email profilePicture",
//     );

//     return res.json({
//       profile,
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

// /* =========================
//    DOWNLOAD PROFILE / RESUME
// ========================= */

// const downloadProfile = async (req, res) => {
//   try {
//     const user_id = req.query.id;

//     // console.log("Requested user ID:", user_id);

//     const userProfile = await Profile.findOne({
//       userId: user_id,
//     }).populate("userId", "name username email profilePicture");

//     if (!userProfile) {
//       return res.status(404).json({
//         message: "Profile not found",
//       });
//     }

//     // console.log("User profile found:", userProfile);

//     const pdfPath = await convertUserDataTOPDF(userProfile);

//     // console.log("Sending PDF:", pdfPath);

//     return res.json(pdfPath);
//   } catch (e) {
//     // console.log("DOWNLOAD ERROR:", e);`

//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };

// export const sendConnectionReq = async (req, res) => {
//   const { token, connectionId } = req.body;
//   try {
//     const user = await User.findOne({ token });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const connectionUser = await User.findOne({ _id: connectionId });
//     if (!connectionUser) {
//       return res.status(404).json({ message: "connection User not found" });
//     }
//     const existingRequest = await Connection.findOne({
//       userId: user._id,
//       connectionId: connectionUser._id,
//     });
//     if (existingRequest) {
//       return res.status(400).json({ message: "Request already sent" });
//     }
//     const request = new Connection({
//       userId: user._id,
//       connectionId: connectionUser._id,
//     });
//     await request.save();
//     return res.status(201).json({
//       message: "Connection request sent successfully",
//       connection: request,
//     });
//   } catch (e) {
//     return res.status(500).json({ message: e.message });
//   }
// };
// export const getMyConnectionsRequests = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await User.findOne({ token });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const connections = await Connection.find({
//       userId: user._id,
//     }).populate("connectionId", "name username email profilePicture");

//     return res.json({ connections });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };
// export const WhaAreMyConnections = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await User.findOne({ token });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const connections = await Connection.find({
//       connectionId: user._id,
//     }).populate("userId", "name username email profilePicture");

//     return res.json({
//       connections,
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };
// export const acceptConnectionRequest = async (req, res) => {
//   const { token, requestId, action_type } = req.body;

//   try {
//     const user = await User.findOne({ token });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const connection = await Connection.findOne({
//       _id: requestId,
//       connectionId: user._id,
//     });

//     if (!connection) {
//       return res.status(404).json({
//         message: "Connection request not found",
//       });
//     }

//     if (action_type === "accept") {
//       connection.status_accepted = true;
//     } else {
//       connection.status_accepted = false;
//     }

//     await connection.save();

//     return res.json({
//       message: "Request Updated",
//     });
//   } catch (e) {
//     return res.status(500).json({
//       message: e.message,
//     });
//   }
// };
// export const getUserBytheirProfilePicture = async (req, res) => {
//   const { username } = req.query;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ message: "User not Found" });
//     }
//     const UserProfile = await Profile.findOne({ userId: user._id }).populate(
//       "userId",
//       "name username email profilePicture",
//     );
//     return res.json({ profile: UserProfile });
//   } catch (e) {
//     return res.status(500).json({ message: e.message });
//   }
// };
// /* =========================
//    EXPORT
// ========================= */

// export {
//   register,
//   login,
//   updateProfilePicture,
//   updateUserProfile,
//   getUserProfile,
//   updateprofiledate,
//   getAllUser,
//   downloadProfile,
// };

import Post from "../models/posts.model.js";
import User from "../models/users.models.js";
import Connection from "../models/connection.models.js";
import { Profile } from "../models/profile.models.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

//  CONVERT USER DATA TO PDF

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  /* PROFILE PICTURE */

  const profilePicture = userData.userId.profilePicture || "defaultProfile.png";

  const imagePath = path.join(process.cwd(), "uploads", profilePicture);

  try {
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, {
        align: "center",
        width: 100,
      });

      doc.moveDown();
    } else {
      console.log("Image not found, skipping:", imagePath);
    }
  } catch (err) {
    console.log("Invalid image format, skipping:", imagePath, err.message);
  }

  //  USER INFORMATION

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);

  doc.fontSize(14).text(`Email: ${userData.userId.email}`);

  doc.fontSize(14).text(`Bio: ${userData.bio}`);

  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.moveDown();

  //  PAST WORK

  doc.fontSize(16).text("Past Work:");

  doc.moveDown();

  if (userData.pastWork && userData.pastWork.length > 0) {
    userData.pastWork.forEach((work) => {
      doc.fontSize(14).text(`Company: ${work.company}`);

      doc.fontSize(14).text(`Position: ${work.position}`);

      doc.fontSize(14).text(`Year: ${work.years}`);

      doc.moveDown();
    });
  } else {
    doc.fontSize(14).text("No past work information");

    doc.moveDown();
  }

  //  EDUCATION

  doc.fontSize(16).text("Education:");

  doc.moveDown();

  if (userData.education && userData.education.length > 0) {
    userData.education.forEach((education) => {
      doc.fontSize(14).text(`School: ${education.school}`);

      doc.fontSize(14).text(`Degree: ${education.degree}`);

      doc.fontSize(14).text(`Field of Study: ${education.fieldOfStudy}`);

      doc.moveDown();
    });
  } else {
    doc.fontSize(14).text("No education information");
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log("PDF created:", outputPath);

      resolve(outputPath);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

//  REGISTER Controller

const register = async (req, res) => {
  console.log(req.body);

  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  LOGIN Controller

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Generate new token

    const token = crypto.randomBytes(64).toString("hex");

    //  Token expires after 24 hours

    const expirytoken = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      {
        token,
        expirytoken,
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      expirytoken,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  Update Profilepicture Controller

const updateProfilePicture = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.status(200).json({
      message: "Profile picture successfully changed",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  Update UserData Controller

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const newUser = {
      ...req.body,
    };

    const { username, email } = newUser;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    Object.assign(user, newUser);

    await user.save();

    return res.status(200).json({
      message: "User updated",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
//  Get UserProfile Controller

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId", "name email username profilePicture");

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//  Updata ProfileData Controller

const updateprofiledate = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const profileData = {
      ...req.body,
    };

    const profile = await Profile.findOne({
      userId: user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    Object.assign(profile, profileData);

    await profile.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      profile,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  Get all User Controller

const getAllUser = async (req, res) => {
  try {
    const profile = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({
      profile,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  Download Profile resume Controller

const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({
      userId: user_id,
    }).populate("userId", "name username email profilePicture");

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const pdfPath = await convertUserDataTOPDF(userProfile);

    return res.json(pdfPath);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  SEND CONNECTION REQUEST Controller

export const sendConnectionReq = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { connectionId } = req.body;

    const connectionUser = await User.findOne({
      _id: connectionId,
    });

    if (!connectionUser) {
      return res.status(404).json({
        message: "Connection User not found",
      });
    }

    const existingRequest = await Connection.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    // Create connection request

    const request = new Connection({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.status(201).json({
      message: "Connection request sent successfully",
      connection: request,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

// Get My Connection Req Controller
export const getMyConnectionsRequests = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const connections = await Connection.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({
      connections,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  GET MY CONNECTIONS Controller

export const WhaAreMyConnections = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const connections = await Connection.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({
      connections,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  ACCEPT CONNECTION REQUEST Controller

export const acceptConnectionRequest = async (req, res) => {
  const { requestId, action_type } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const connection = await Connection.findOne({
      _id: requestId,
      connectionId: user._id,
    });

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({
      message: "Request Updated",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  GET USER BY USERNAME Controller

export const getUserBytheirProfilePicture = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    const UserProfile = await Profile.findOne({
      userId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({
      profile: UserProfile,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

//  EXPORT

export {
  register,
  login,
  updateProfilePicture,
  updateUserProfile,
  getUserProfile,
  updateprofiledate,
  getAllUser,
  downloadProfile,
};
