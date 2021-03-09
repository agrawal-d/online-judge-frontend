import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import { Container, Row, Col } from "react-bootstrap";
import { User } from "../types";
import NavBar from "./NavBar";
import { time } from "node:console";



export default function StudentDashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();
  // const assignments = props.assignments;
  const assignments = [
    { name: 'Assign1' , ques: 2  },
    { name: 'Assign2' , ques: 5 },
    { name: 'Assign3' , ques: 3 },
    { name: 'Assign4' , ques: 4 },
    { name: 'Assign5' , ques: 3 },
    { name: 'Assign6', ques: 2 }
  ];
  return (

    <div className="home">
      <Container>
        <NavBar />
        <Row >
          <Col>
            <h3>Your assignments</h3>

            <hr />
            { <ul className="assign_link list-group">
              {assignments.map(person => (
                <li id={person.name} className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between align-items-center" >
                <a href="#"> {person.name} {}</a>
                <span className="badge bg-light rounded-pill">{person.ques}</span>
              </li>
      ))}
            
                
              
            </ul> }
          </Col>
          <Col>
            <h3>Available Actions</h3>
            <hr />
            <ul>
              <li>
                <Link to="/user-setup" >Setup Hackerearth Credentials</Link >
              </li>
            </ul>


          </Col>
        </Row>
      </Container>
    </div>
  );
}
