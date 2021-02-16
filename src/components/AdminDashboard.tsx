import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { navigate } from "@reach/router";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from "./Loading";
import { User } from "../types";

export default function AdminDashboard() {
  const user = useSelector(selectUser) as User;
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("/users").then((res) => {
      const data = res.data;
      if (data.error || data.errors) {
        console.error(data);
      }
      setAllUsers(data);
    });
  });

  const logout = () => {
    axios.post("/auth/logout");
    dispatch(setUser(null));
    navigate("/");
  };

  const renderUsersList = () => {
    if (!allUsers) {
      return <Loading />;
    }

    const p: ReactElement[] = [];
    allUsers.forEach((user) => {
      p.push(
        <div className="p-1">
          <Row>
            <Col md="auto">
              <img
                src={user.picture}
                className="d-block"
                alt="Profile"
                width="40"
              />
            </Col>
            <Col>{user.name}</Col>
            <Col>{user.email}</Col>
          </Row>
          <hr />
        </div>
      );
    });

    return (
      <>
        <h3>Users in the system</h3>
        {p}
      </>
    );
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
              <h3 className="text-right">
                Welcome, Administrator {user.name}{" "}
              </h3>
              <Button className="float-right" onClick={logout}>
                Logout
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>{renderUsersList()}</Col>
            <Col>
              <h3>Admin actions</h3>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
