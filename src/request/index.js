import axios from "axios";
// import { authService } from "../api/authService";

const request = axios.create({
  baseURL: `${
    process.env.NODE_ENV === "development"
      ? /* "http://localhost:8000" */ "https://dock-jumbobids.herokuapp.com"
      : "https://dock-jumbobids.herokuapp.com"
  }/api/u`,
});

/* request.interceptors.request.use((req) => {
  if (authService.getProfile()) {
    req.headers.Authorization = `Bearer ${authService.getProfile().token}`;
  }

  return req;
}); */

export default request;
