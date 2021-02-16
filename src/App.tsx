import React, { useEffect } from "react";
import axios from "axios";
import { navigate, Router } from "@reach/router";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";

import config from "./config";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./reducers/userReducer";

axios.defaults.baseURL = config.apiBase;
axios.defaults.withCredentials = true;

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Getting user", user);
    if (!user) {
      axios
        .get("/users/me")
        .then((res) => {
          const data = res.data;
          if (data.error) {
            navigate("/");
          }
          dispatch(setUser(data));
        })
        .catch((error) => {
          navigate("/");
        });
    }
  });

  if (!user) {
    return (
      <div className="App logged_out">
        <Home path="/" />
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Home path="/" default />
        <Dashboard path="/dashboard" />
      </Router>
    </div>
  );
}

export default App;
