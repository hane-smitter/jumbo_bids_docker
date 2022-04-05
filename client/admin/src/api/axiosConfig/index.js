import axios from "axios";
import { AuthService } from "../AuthService";

const instance = axios.create({});
const fallbackURL = `${
	process.env.NODE_ENV === "development"
		? "http://localhost:5000"
		: "https://raw-jumbobids.herokuapp.com"
}/api/a`;

instance.interceptors.request.use(
	config => {
		const token = AuthService.getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		config.baseURL = axios.defaults.baseURL || fallbackURL;
		return config;
	},
	error => Promise.reject(error)
);

export default instance;
