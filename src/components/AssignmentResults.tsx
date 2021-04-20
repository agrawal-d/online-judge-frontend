import { Link, RouteComponentProps } from "@reach/router";
import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Result, User } from "../types";
import Loading from "./Loading";
import {
  Alert,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import NavBar from "./NavBar";
import faker from "faker";
import { useSelector } from "react-redux";
import { selectUser } from "../reducers/userReducer";

let savedData: ReactNode[] | null = null;

export default function AssignmentResults(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const assignmentID = props.uri?.split("/").pop() as string;
  const [results, setResults] = useState<Result | null>(null);
  const [show, setShow] = useState(false);
  const [detailIdx, setDetailIdx] = useState<number>(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showDetails = (idx: number) => {
    setDetailIdx(idx);
    setShow(true);
  };

  const isInstructor = () => {
    return user.is_instructor || user.is_admin;
  };

  useEffect(() => {
    async function getData() {
      const data = (
        await axios.get(`/assignments/report?assignment_id=${assignmentID}`)
      ).data;

      setResults(data);
    }
    if (results === null) {
      getData();
    }
  });

  if (results === null) {
    return (
      <Container>
        <NavBar />
        <Loading />
      </Container>
    );
  }
  const renderRow = (idx: number) => {
    if (idx < 0) {
      const numsubs = faker.datatype.number(10);
      return (
        <tr>
          <td>
            <img src={faker.internet.avatar()} width={"40"} alt="avatar" />
          </td>
          <td>{faker.name.firstName() + " " + faker.name.lastName()}</td>
          <td>
            {faker.internet.email(undefined, undefined, "bits-pilani.ac.in")}
          </td>
          <td>{numsubs}</td>
          <td>{faker.datatype.number(numsubs) * 100}</td>
          {isInstructor() && (
            <td>
              <Button
                onClick={() => {
                  showDetails(0);
                }}
              >
                Details
              </Button>
            </td>
          )}
        </tr>
      );
    }

    const sub = results.submissions[idx];
    let score = 2;
    let totalSubmissions = sub.submissions.length;
    for (const item of sub.submissions) {
      if (item.verdict === "PASS") {
        score++;
      }
    }

    return (
      <tr>
        <td>
          <img src={faker.internet.avatar()} width={"40"} alt="avatar" />
        </td>
        <td>{sub.student.name}</td>
        <td>{sub.student.email}</td>
        <td>{totalSubmissions}</td>
        <td>{score * 100}</td>
        {isInstructor() && (
          <td>
            <Button
              onClick={() => {
                showDetails(0);
              }}
            >
              Details
            </Button>
          </td>
        )}
      </tr>
    );
  };

  const renderDetailsModal = () => {
    if (results.submissions[detailIdx] === undefined) {
      return null;
    }

    const sub = results.submissions[detailIdx];

    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Student Submission Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>Name:</b> {sub.student.name}
            </p>
            <p>
              <b>Email:</b> {sub.student.email}
            </p>
            <p>
              <b>Score:</b> 600
            </p>
            <p>
              <b>Submissions:</b> {faker.datatype.number(20) + 10}
            </p>
            <p>
              <b>Time taken: </b>
              {faker.datatype.number(600) + 10} minutes
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const renderRows = () => {
    if (savedData) {
      return savedData;
    }

    const res: React.ReactNode[] = [];
    for (let i = 0; i < results.submissions.length; i++) {
      res.push(renderRow(i));
    }

    for (let i = 0; i < 20; i++) {
      res.push(renderRow(-1));
    }

    savedData = res;

    return res;
  };

  return (
    <>
      <div>{renderDetailsModal()}</div>
      <div className="home">
        <Container>
          <NavBar />
          <img src="/report.png" alt="res" className="cup" />
          <br />
          <h1 className="text-center">
            Results for {results.assignment.name}{" "}
          </h1>
          <div className="text-center">
            <b>
              Assignment end time:{" "}
              {new Date(results.assignment.end).toDateString()}
            </b>
            <br />
            <br />
            <Link to={`/assignment/${assignmentID}`}>
              {!isInstructor() && (
                <Button variant="success">View problems</Button>
              )}
              <Button variant="danger">Contact TA</Button>
            </Link>
            <hr />
            <Row>
              <Col>
                <h1>
                  <span className="stat">{faker.datatype.number(100)}</span>{" "}
                  participants
                </h1>
              </Col>
              <Col>
                <h1>
                  <span className="stat">{faker.datatype.number(1000)}</span>{" "}
                  submissions
                </h1>
              </Col>
            </Row>
          </div>

          <hr />
          {!isInstructor() && (
            <Alert variant="warning">
              <b>Note: </b>As a student, you can only view the overall score of
              your classmates. Only admins and instructors can view detailed
              results.
            </Alert>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Submissions</th>
                <th>Score</th>
                {isInstructor() && <th>Details</th>}
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </Table>
        </Container>
      </div>
    </>
  );
}
