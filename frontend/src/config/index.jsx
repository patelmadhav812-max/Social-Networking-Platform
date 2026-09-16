const { default: axios } = require("axios");
// Connection to DataBase
export const BASE_URL = "http://localhost:9090";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
