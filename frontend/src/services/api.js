import axios from "axios";

const API = axios.create({
  baseURL: "https://sentinelai-pro.onrender.com",
});

export default API;