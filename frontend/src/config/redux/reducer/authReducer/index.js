import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionRequests,
  loginUser,
  registerUser,
} from "../../action/authAction";
// read about createSlice
const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isToken: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_profiles_fetched: false,
  all_Users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    reset: () => initialState,

    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isToken = true;
    },
    setTokenIsNotThere: (state) => {
      state.isToken = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        ((state.loggedIn = true), (state.message = "Login is Successfull"));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      // right now change
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = {
          message: "Registration is Successful , Please Login to Continue",
        };
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_Users = action.payload.profile;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        console.log("PAYLOAD:", action.payload);
        console.log("IS ARRAY:", Array.isArray(action.payload));

        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;

export default authSlice.reducer;
