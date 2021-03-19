import { RouteComponentProps } from "@reach/router";
import React from "react";
import {useState,useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container,Row,Col,Card ,Form,Button,InputGroup, FormControl} from "react-bootstrap";
import NavBar from "./NavBar";
import assignments from "./Assignments";
import axios from "axios";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
export default function InstructorDashboard(props: RouteComponentProps){
    const dispatch = useDispatch();
    const [newTAEmails,setNewTAEmails] = useState<string>("");
    const [newStudentEmails,setStudentMails] = useState<string>("");
    const [name,setName] = useState<string>("");

    function addAll(){
        var tas = newTAEmails.split(",");
        console.log(tas);

        var students = newStudentEmails.split(",");
        console.log(students);

        console.log(name)
        axios
        .post("/assignments/add-assignment", { ass_name: name, ta_ids:tas , student_ids: students }).then((res) => {
          const data = res.data;
          console.log(data);
          if (data.errors) {
            dispatch(setGlobalErrors(data.errors));
            return;
          }
  
          setNewTAEmails("");
          setStudentMails("");
          setName("");
        });
    }
    return (
        <>
        <div className="home">
            <Container>
                <NavBar />
                <Row>
                    <Col>
                    <Card body>
                        <Form>
                        <Form.Group id = "name">
                        <Form.Label>Name</Form.Label>
                            <Form.Control type = "text" value = {name} onChange = {(e) => setName(e.target.value)} required/>
                        </Form.Group>
                   <InputGroup className="mb-3">

                  <InputGroup.Prepend>
                    <InputGroup.Text>Add TA by Email</InputGroup.Text>
                  </InputGroup.Prepend>
                <FormControl 
                placeholder = "example@hyderabad.bits-pilani.ac.in"
                value = {newTAEmails}
                type = "email"
                onChange={(e) => setNewTAEmails(e.target.value)}
                />
                  </InputGroup>


                  <InputGroup className="mb-3">

                        <InputGroup.Prepend>
                        <InputGroup.Text>Add Students by Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl 
                        placeholder = "example@hyderabad.bits-pilani.ac.in"
                        value = {newStudentEmails}
                        type = "email"
                        onChange={(e) => setStudentMails(e.target.value)}
                        />
                        </InputGroup>
                         <Button variant="primary" onClick = {addAll}>
                            Submit
                        </Button>
                        </Form>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        </>
    );
}