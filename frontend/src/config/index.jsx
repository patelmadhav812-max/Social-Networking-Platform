const { default: axios } = require("axios");
// Connection to DataBase
export const BASE_URL = "https://social-networking-platform-3.onrender.com/";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
