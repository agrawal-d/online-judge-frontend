import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
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
} from "react-bootstrap";
import NavBar from "./NavBar";
import axios from "axios";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
import Datetime from "react-datetime";

export default function InstructorDashboard(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const [newTAEmails, setNewTAEmails] = useState<string>("");
  const [newStudentEmails, setStudentMails] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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
      });
  }

  return (
    <>
      <div className="home">
        <Container>
          <NavBar />
          <Row>
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              Add Assignment
            </Button>
          </Row>

          <Row>
            <Col>
              <Collapse in={open}>
                <div>
                  <Row>
                    <div>
                      {error && <Alert variant="danger">{error}</Alert>}
                    </div>
                  </Row>

                  <Row>
                    <Col>
                      <Card.Header></Card.Header>
                      <Card body>
                        <Form>
                          <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </Form.Group>
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
                              <InputGroup.Text>
                                Add Students by Email
                              </InputGroup.Text>
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
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Collapse>
            </Col>
            <Col>
              <Col>
                <h3>Admin actions</h3>
                <ul>
                  <li>
                    <Link to="/user-setup">Setup Hacker Earth Credentials</Link>
                  </li>
                </ul>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
