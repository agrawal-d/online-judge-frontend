import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate } from "@reach/router";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Loading from "./Loading";
import { User } from "../types";
import NavBar from "./NavBar";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";

export default function AdminDashboard() {
  const user = useSelector(selectUser) as User;
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [newInstructorEmail, setNewInstructorEmail] = useState<string>("");

  const dispatch = useDispatch();

  function updateAllUsers() {
    axios.get("/users/instructors").then((res) => {
      const data = res.data;
      if (data.error || data.errors) {
        console.error(data);
      }
      setAllUsers(data);
    });
  }

  function createNewInstructor() {
    if (!newInstructorEmail) {
      return;
    }

    axios
      .post("/admin/make-instructor", { email: newInstructorEmail })
      .then((res) => {
        const data = res.data;
        if (data.errors) {
          dispatch(setGlobalErrors(data.errors));
          return;
        }

        setNewInstructorEmail("");
        updateAllUsers();
      });
  }

  useEffect(() => {
    if (allUsers) {
      return;
    }
    updateAllUsers();
  });

  const renderUsersList = () => {
    if (!allUsers) {
      return <Loading />;
    }

    const p: ReactElement[] = [];

    if (allUsers.length === 0) {
      p.push(<Alert variant="primary">No instructors yet.</Alert>);
    }

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
        </div>
      );
    });

    return (
      <>
        <h3>Instructors in the system</h3>
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
            <Col>
              <Card body>{renderUsersList()}</Card>
              <br />
              <Card body>
                <h3>Add a new instructor</h3>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Email</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder="example@hyderabad.bits-pilani.ac.in"
                    value={newInstructorEmail}
                    type="email"
                    onChange={(e) => setNewInstructorEmail(e.target.value)}
                  />
                </InputGroup>
                <Button onClick={createNewInstructor}>Save</Button>
              </Card>
            </Col>
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
