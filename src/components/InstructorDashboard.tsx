import { RouteComponentProps } from "@reach/router";
import React from "react";
import {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container,Row,Col,Card ,Form,Button,InputGroup, FormControl} from "react-bootstrap";
import NavBar from "./NavBar";
import assignments from "./Assignments";
import axios from "axios";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
export default function InstructorDashboard(props: RouteComponentProps){
    const dispatch = useDispatch();
    const [newTAEmail,setNewTAEmail] = useState<string>("");
    function addTA(){
        if(!newTAEmail){
            return;
        }

        axios
        .post("/users/check-ta", {ta_id : newTAEmail})
        .then((res) =>{
            const data = res.data;
            console.log(data);
            if(data.errors){
                dispatch(setGlobalErrors(data.errors));
                return;
            }
            setNewTAEmail("");
        })
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
                            <Form.Control type = "text" required/>
                        </Form.Group>
                        <Form.File 
                        id="custom-file"
                        label="List of Students"
                        custom
                       />
                   <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Add TA by Email</InputGroup.Text>
                  </InputGroup.Prepend>
                <FormControl 
                placeholder = "example@hyderabad.bits-pilani.ac.in"
                value = {newTAEmail}
                type = "email"
                onChange={(e) => setNewTAEmail(e.target.value)}
                >

                </FormControl>
                  </InputGroup>
                         <Button variant="primary">
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