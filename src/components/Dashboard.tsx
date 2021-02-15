import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
import { Counter } from "../features/demo/Counter";
import config from "../config";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from "./Loading";

export default function Dashboard(props: RouteComponentProps) {
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

  const logout = () => {
    axios.post("/auth/logout");
    dispatch(setUser(null));
    navigate("/");
  };

  if (!user) {
    return <Loading />;
  } else {
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
}
