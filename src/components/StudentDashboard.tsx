import axios from "axios";
import React,{ ReactElement,useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import { Container, Row, Col,Alert,Card, InputGroup,FormControl } from "react-bootstrap";
import { User } from "../types";
import NavBar from "./NavBar";
import Loading from "./Loading";

export default function StudentDashboard(props: RouteComponentProps) {
  const [allAssignments,setAllAssignments] = useState<[] | undefined>(undefined);


  function updateAllAssignments(){
    axios.get("/users/get-my-assignments").then((res) => {
      const data = res.data;
      if(data.error || data.errors){
        console.error(data);
      }
      setAllAssignments(data);
    });
  }

  useEffect(() => {
    if(allAssignments){
      return;
    }
    updateAllAssignments();
  });

  const renderAssignmentsList = () => {
    if(!allAssignments){
      return <Loading/>;
    }

    const p: ReactElement[] = [];

    if(allAssignments.length  === 0){
      p.push(<Alert variant = "primary">No Assignments yet.</Alert>);
    }

    allAssignments.forEach((assignment) => {
      p.push(
        <div className = "p-1" key = {assignment}>
          <Row>
            <Col md = "auto">
              <h4>{assignment} </h4>
            </Col>
          </Row>
        </div>
      )
    })

    return (
      <>
      <h3> Your Assignments</h3>
      {p}
      </>
    )

  }


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
