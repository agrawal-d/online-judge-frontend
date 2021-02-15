import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import config from "./config";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = config.apiBase;
axios.defaults.validateStatus = () => true;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
