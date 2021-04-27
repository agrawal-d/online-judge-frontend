import axios from "axios";
import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../reducers/userReducer";
import { Link } from "@reach/router";
import faker from "faker";

import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  Badge,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Loading from "./Loading";
import { User } from "../types";
import NavBar from "./NavBar";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "January", uv: 400, pv: 2400, amt: 2400 },
  { name: "February", uv: 100, pv: 2400, amt: 2400 },
  { name: "March", uv: 700, pv: 2400, amt: 2400 },
  { name: "April", uv: 900, pv: 2400, amt: 2400 },
];

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const renderLineChart = (
  <div>
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
    <h4 className="text-center">Monthly Usage statistics</h4>
  </div>
);

const renderPieChart = (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        data={pieData}
        outerRadius={80}
        fill="#8884d8"
        label
      />
    </PieChart>
  </ResponsiveContainer>
);

export default function AdminDashboard() {
  const user = useSelector(selectUser) as User;
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [newInstructorEmail, setNewInstructorEmail] = useState<string>("");
  const [newTAEmail, setNewTAEmail] = useState<string>("");

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
        console.log(data);
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
                className="d-block b"
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
              <br />
            </Col>
            <Col>
              <h3>Admin actions</h3>
              <ul>
                <li>
                  <Link to="/user-setup">Setup Hacker Earth Credentials</Link>
                </li>
              </ul>

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
          </Row>
          <h1 className="text-center">Overview</h1>
          <hr />
          <Row>
            <Col>
              <Card body>{renderLineChart}</Card>
            </Col>
            <Col>
              <Card body>
                <img
                  src="pie-chart.png"
                  alt="pie chart"
                  className="pad-10 block"
                />
                <br />
                <h4 className="text-center">User Demographics</h4>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card bg="primary" text="light" body>
                <h1>{faker.datatype.number(10000)}</h1>
                <h4>Users</h4>
              </Card>
            </Col>
            <Col>
              <Card bg="warning" text="light" body>
                <h1>{faker.datatype.number(500)}</h1>
                <h4>Assignments</h4>
              </Card>
            </Col>
            <Col>
              <Card bg="info" text="light" body>
                <h1>{faker.datatype.number(5000)}</h1>
                <h4>Students</h4>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className="he-bg" text="light" body>
                <h1>
                  {faker.datatype.number(10000)}

                  <img
                    src="https://miro.medium.com/max/600/1*_qEyZ2IU41N3LwrWXV43qg.jpeg"
                    alt="he"
                    width={200}
                  />
                </h1>

                <h4>HackerEarth API Calls Usage</h4>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h2>Service Status</h2>
              <hr />
              <Button variant="primary">
                API <Badge variant="light">Online</Badge>
              </Button>
              <Button variant="success">
                HackerEarth <Badge variant="light">Online</Badge>
              </Button>
              <Button variant="warning">
                Client Server <Badge variant="light">Online</Badge>
              </Button>
              <Button variant="info">
                MongoDB Database <Badge variant="light">Online</Badge>
              </Button>
              .
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
