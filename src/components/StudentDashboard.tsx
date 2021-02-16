import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
import { Counter } from "../features/demo/Counter";
import config from "../config";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from "./Loading";
import { User } from "../types";

export default function StudentDashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();

  const logout = () => {
    axios.post("/auth/logout");
    dispatch(setUser(null));
    navigate("/");
  };

  return (
    <div className="home">
      <Container>
        <Row className="align-items-center">
          <Col>
            <img src={user.picture} alt="profile" />
          </Col>
          <Col>
            <h3 className="text-right">Welcome, {user.name} </h3>
            <Button className="float-right" onClick={logout}>
              Logout
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Your classes</h3>
            <hr />
            <p>Coming soon.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
