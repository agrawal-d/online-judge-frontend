import axios from "axios";
import React,{ ReactElement,useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import { Container, Row, Col,Alert,Card } from "react-bootstrap";
import { User } from "../types";
import NavBar from "./NavBar";
import Loading from "./Loading";

export default function StudentDashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();
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

      // allAssignments.map((d) => <li key={d.name}>{d.name}</li>)
    
    allAssignments.forEach((assignment) => {
      p.push(
        <div className = "p-1" key = {assignment}>
          <Row>
            <Col md = "auto">
              {assignment}
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
          <Card body>
            <h3> Add a new Assignment</h3>

          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
