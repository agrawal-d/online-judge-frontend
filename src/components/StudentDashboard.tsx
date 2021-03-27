import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  Button as div,
  InputGroup,
  FormControl,
  Badge,
} from "react-bootstrap";
import { AssignmentDetails, User } from "../types";
import NavBar from "./NavBar";
import Loading from "./Loading";

export default function StudentDashboard(props: RouteComponentProps) {
  const [allAssignments, setAllAssignments] = useState<
    AssignmentDetails[] | null
  >(null);

  function updateAllAssignments() {
    axios.get("/users/get-student-assignments").then((res) => {
      const data = res.data;
      if (data.error || data.errors) {
        console.error(data);
      }
      setAllAssignments(data);
    });
  }

  useEffect(() => {
    if (allAssignments) {
      return;
    }
    updateAllAssignments();
  });

  const renderAssignmentsList = () => {
    if (!allAssignments) {
      return <Loading />;
    }

    const p: ReactElement[] = [];

    if (allAssignments.length === 0) {
      p.push(<Alert variant="primary">No Assignments yet.</Alert>);
      return p;
    }

    console.log(allAssignments);

    allAssignments.forEach((assignment) => {
      p.push(
        <>
          <Card body className="p-1" key={assignment._id}>
            <Row>
              <Col md="auto">
                <h5>{assignment.name}</h5>
                <Badge variant="primary">
                  Starts {new Date(assignment.start).toLocaleString()}
                </Badge>{" "}
                <Badge variant="warning">
                  Finishes {new Date(assignment.end).toLocaleString()}
                </Badge>
              </Col>
            </Row>
          </Card>
          <br />
        </>
      );
    });

    return (
      <>
        <h3> Your Assignments</h3>
        {p}
      </>
    );
  };

  return (
    <div className="home">
      <Container>
        <NavBar />
        <Row>
          <Col>
            <Card body>{renderAssignmentsList()}</Card>
            <br />
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
