import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ================= LOGIN =================

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(`/login`, {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "Token not provided",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data || { message: "Login failed" },
      );
    }
  },
);

// ================= REGISTER =================

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const request = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return request.data.message;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data || { message: "Registration failed" },
      );
    }
  },
);

// ================= GET ABOUT USER =================

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "Token not found",
        });
      }

      const response = await clientServer.get("/get_user_profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data || { message: "Unable to get user profile" },
      );
    }
  },
);

// ================= GET ALL USERS =================

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_all_User");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data || { message: "Unable to get users" },
      );
    }
  },
);

// ================= SEND CONNECTION REQUEST =================

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          connectionId: user.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      thunkAPI.dispatch(getConnectionsRequest());

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Connection request failed" },
      );
    }
  },
);

// ================= GET CONNECTION REQUESTS =================

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.get("/user/getConnectionRequests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to get connection requests",
      );
    }
  },
);

// ================= GET MY CONNECTION REQUESTS =================

export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.get("/user/user_connection_request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to get my connection requests",
      );
    }
  },
);

// ================= ACCEPT CONNECTION =================

export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          requestId: user.connectionId,
          action_type: user.action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      thunkAPI.dispatch(getConnectionsRequest());
      thunkAPI.dispatch(getMyConnectionRequests());

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to accept connection",
      );
    }
  },
);
