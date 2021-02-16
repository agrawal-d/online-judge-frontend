import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate } from "@reach/router";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from "./Loading";
import { User } from "../types";
import NavBar from "./NavBar";

export default function AdminDashboard() {
  const user = useSelector(selectUser) as User;
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allUsers) {
      return;
    }
    axios.get("/users").then((res) => {
      const data = res.data;
      if (data.error || data.errors) {
        console.error(data);
      }
      setAllUsers(data);
    });
  }, [allUsers]);

  const renderUsersList = () => {
    if (!allUsers) {
      return <Loading />;
    }

    const p: ReactElement[] = [];
    allUsers.forEach((user) => {
      p.push(
        <div className="p-1" key={user.google_id}>
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
          <NavBar />

          <Row>
            <Col>{renderUsersList()}</Col>
            <Col>
              <h3>Admin actions</h3>
              <ul>
                <li>
                  <Link to="/user-setup">Setup Hacker Earth Credentials</Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
