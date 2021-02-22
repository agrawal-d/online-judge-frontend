import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import { Container, Row, Col } from "react-bootstrap";
import { User } from "../types";
import NavBar from "./NavBar";

export default function StudentDashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();

  return (
    <div className="home">
      <Container>
        <NavBar />
        <Row>
          <Col>
            <h3>Your assignments</h3>
            <hr />
            <p>Coming soon.</p>
          </Col>
          <Col>
            <h3>Available Actions</h3>
            <hr />
            <ul>
              <li>
                <Link to="/user-setup">Setup Hackerearth Credentials</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
