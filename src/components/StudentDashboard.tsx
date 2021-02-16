import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
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
            <h3>Your classes</h3>
            <hr />
            <p>Coming soon.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
