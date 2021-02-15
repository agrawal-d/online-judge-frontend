import React from "react";
import axios from "axios";
import { Router } from "@reach/router";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";

import config from "./config";

axios.defaults.baseURL = config.apiBase;
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
      <Router>
        <Home path="/" />
        <Dashboard path="/dashboard" />
      </Router>
    </div>
  );
}

export default App;
