import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser, updateHE } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
import { Counter } from "../features/demo/Counter";
import {
  Container,
  Row,
  Col,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { User } from "../types";
import NavBar from "./NavBar";

export default function UserSetup(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();

  const [he, setHe] = useState<{
    he_client_id: string;
    he_client_secret: string;
  }>({
    he_client_id: user.he_client_id,
    he_client_secret: user.he_client_secret,
  });

  const saveHe = async () => {
    await dispatch(updateHE(he));
    await navigate("/dashboard");
  };

  return (
    <Container>
      <NavBar />
      <Row>
        <Col>
          <h3>We need to set up your account first.</h3>
          <p>
            Please set up your HackerEarth API credentials. Go to{" "}
            <a href="https://www.hackerearth.com/api/register/">
              https://www.hackerearth.com/api/register/
            </a>{" "}
            and create a new client. For client name, use anything you like. For
            hostname, enter <code>https://bits-judge.herokuapp.com</code>. Then,
            paste the generated Client ID and Client Secret below.
          </p>
          <hr />
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Client ID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Client ID"
              value={he.he_client_id}
              onChange={(e) => setHe({ ...he, he_client_id: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Client Secret</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Client Secret"
              value={he.he_client_secret}
              onChange={(e) =>
                setHe({ ...he, he_client_secret: e.target.value })
              }
            />
          </InputGroup>
          <Button onClick={saveHe}>Save</Button>
        </Col>
      </Row>
    </Container>
  );
}
