import React, { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { navigate, Router } from "@reach/router";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UserSetup from "./components/UserSetup";

import config from "./config";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./reducers/userReducer";
import {
  selectGlobalErrors,
  setGlobalErrors,
} from "./reducers/globalErrorsReducer";

import { Button, Modal } from "react-bootstrap";
import { GlobalError } from "./types";
import Assignment from "./components/Assignment";

axios.defaults.baseURL = config.apiBase;
axios.defaults.withCredentials = true;

function App() {
  const user = useSelector(selectUser);
  const globalErrors = useSelector(selectGlobalErrors);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    dispatch(setGlobalErrors([]));
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    console.log("Getting user", user);
    if (!user || !user.email || !user.google_id) {
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

  useEffect(() => {
    if (globalErrors.length > 0) {
      handleShow();
    }
  }, [globalErrors]);

  function renderErrors() {
    const list: ReactNode[] = [];

    globalErrors.forEach((error: GlobalError) => {
      if (error.msg) {
        list.push(
          <li>
            {error.msg} for {error.param}. ( Given "{error.value}" )
          </li>
        );
      } else {
        list.push(<li>{error.message}</li>);
      }
    });

    return <ul>{list}</ul>;
  }

  if (!user) {
    return (
      <div className="App logged_out">
        <Home path="/" />
      </div>
    );
  }

  return (
    <div className="App">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Oops! Check out these errors</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderErrors()}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="float-left"
            onClick={() => window.location.reload()}
          >
            Reload app
          </Button>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Router>
        <Home path="/" default />
        <Dashboard path="/dashboard" />
        <UserSetup path="/user-setup" />
        <Assignment path="/assignment/:assignmentId" />
      </Router>
    </div>
  );
}

export default App;
