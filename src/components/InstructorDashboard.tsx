import { Link, RouteComponentProps } from "@reach/router";
import React, { ReactElement, useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Alert,
  Collapse,
  Tab,
  Tabs,
} from "react-bootstrap";
import NavBar from "./NavBar";
import axios from "axios";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
import Datetime from "react-datetime";
import { AssignmentDetails } from "../types";
import ProblemCreator from "./ProblemCreator";
import Loading from "./Loading";

export default function InstructorDashboard(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const [newTAEmails, setNewTAEmails] = useState<string>("");
  const [newStudentEmails, setStudentMails] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [myAssignments, setMyAssignments] = useState<
    AssignmentDetails[] | null
  >(null);
  const [currAssignmentIdx, setCurrAssignmentIdx] = useState<number>(0);

  useEffect(() => {
    if (!myAssignments) {
      updateInsAssignments();
    }
  });

  async function updateInsAssignments() {
    const res = await axios.get("/users/get-instructor-assignments");

    if (res.data.errors) {
      return setGlobalErrors(res.data.errors);
    }

    const assignments: AssignmentDetails[] = res.data;
    setMyAssignments(assignments);
  }

  function addAll() {
    if (!name) {
      setError("Assignment Name Empty");
      return;
    }
    if (!newTAEmails) {
      setError("No TA Assigned");
      return;
    }
    if (!newStudentEmails) {
      setError("No student Added");
      return;
    }
    if (!startDateTime) {
      setError("Set Start Time");
    }
    if (!endDateTime) {
      setError("set End Time");
    }
    if (startDateTime > endDateTime) {
      setError("Start Time is After End Time");
      return;
    }
    let tas = newTAEmails.split(",");

    let students = newStudentEmails.split(",");

    axios
      .post("/assignments/add-assignment", {
        ass_name: name,
        ta_ids: tas,
        student_ids: students,
        start: startDateTime,
        end: endDateTime,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.errors) {
          dispatch(setGlobalErrors(data.errors));
          return;
        }

        setNewTAEmails("");
        setStudentMails("");
        setName("");
        setError("");
        updateInsAssignments();
      });
  }

  function renderProblemCreator() {
    if (!myAssignments || myAssignments.length === 0) {
      return <h4>Create an assignment to add problems to it</h4>;
    }

    const options: React.ReactElement[] = [];

    for (let idx = 0; idx < myAssignments.length; idx++) {
      options.push(<option value={idx} label={myAssignments[idx].name} />);
    }

    return (
      <div>
        <h4>Add problem to &nbsp;</h4>
        <select
          className="form-control"
          onChange={(e) => {
            setCurrAssignmentIdx(parseInt(e.target.value));
          }}
        >
          {options}
        </select>
        <hr />
        <ProblemCreator assignment={myAssignments[currAssignmentIdx]} />
      </div>
    );
  }

  function renderAssignmentCreator() {
    return (
      <div>
        <p>
          Create a new assignment here. You can add problem statements and
          testcases later.
        </p>
        <div>{error && <Alert variant="danger">{error}</Alert>}</div>
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Assignment Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Something Interesting"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Add TA by Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="example@hyderabad.bits-pilani.ac.in"
              value={newTAEmails}
              type="email"
              onChange={(e) => setNewTAEmails(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Add Students by Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="example@hyderabad.bits-pilani.ac.in"
              value={newStudentEmails}
              type="email"
              onChange={(e) => setStudentMails(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Start Date</InputGroup.Text>
            </InputGroup.Prepend>
            <Datetime
              value={startDateTime}
              onChange={(e) => {
                if (typeof e !== "string") {
                  setStartDateTime(e.toISOString());
                }
              }}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>End Date</InputGroup.Text>
            </InputGroup.Prepend>
            <Datetime
              value={endDateTime}
              onChange={(e) => {
                if (typeof e !== "string") {
                  setEndDateTime(e.toISOString());
                }
              }}
            />
          </InputGroup>

          <Button variant="primary" onClick={addAll}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }

  const renderAssignments = () => {
    if (!myAssignments) {
      return <Loading />;
    }

    const p: React.ReactNode[] = [];

    if (myAssignments.length === 0 || myAssignments[0] === null) {
      p.push(<Alert variant="primary">No Assignments yet.</Alert>);
      return p;
    }

    console.log(myAssignments);
    myAssignments.forEach((assignment) => {
      p.push(
        <>
          <Card body className="p-1" key={assignment._id}>
            <Row>
              <Col>
                <h5>{assignment.name}</h5>
                Finishes {new Date(assignment.end).toLocaleString()}
                <hr />
                <Link to={"/results/" + assignment._id}>
                  <Button variant="info">View results</Button>
                </Link>
              </Col>
            </Row>
          </Card>
          <br />
        </>
      );
    });

    return <>{p}</>;
  };

  return (
    <>
      <div className="home">
        <Container>
          <NavBar />
          <Row>
            <Col>
              <h2>Assignment Management</h2>
              <hr />
              <Tabs defaultActiveKey="add-assign">
                <Tab eventKey="add-assign" title="Create assignment">
                  <Col>{renderAssignmentCreator()}</Col>
                </Tab>
                <Tab eventKey="profile" title="Add problems">
                  <Col>{renderProblemCreator()}</Col>
                </Tab>
                <Tab eventKey="contact" title="Contact" disabled>
                  <Loading />
                </Tab>
              </Tabs>
            </Col>
            <Col>
              <h2>Results Management</h2>
              <hr />
              <p>
                View the performance of your students in various assignments
                created by you.
              </p>
              {renderAssignments()}
              <hr />
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
    </>
  );
}
