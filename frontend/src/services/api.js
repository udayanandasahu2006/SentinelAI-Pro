import axios from "axios";

const API = axios.create({
  baseURL: "https://sentinel-ai-pro.onrender.com",
});

export default API;