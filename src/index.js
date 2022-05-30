import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import axios from "axios";
import thunk from "redux-thunk";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import reducers from "./reducers";
import App from "./App";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
axios.defaults.baseURL = `${
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://raw-jumbobids.herokuapp.com"
}/api/a`;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
