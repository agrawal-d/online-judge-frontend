import React from "react";

import { RouteComponentProps } from "@reach/router";
import { Container, Col, Row, Button } from "react-bootstrap";
import config from "../config";

export default function Home(props: RouteComponentProps) {
  return (
    <div className="home">
      <Container>
        <Row className="align-items-center">
          <Col>
            <img src="trophy.png" alt="Trophy" className="trophy" />
            <h1>BITS Online Judge</h1>
            <p>
              BITS Online Judge is an automated system that allows instructors
              to create programming assignments, and students to solve them
              online, with automated checking and evaluation.
            </p>
          </Col>
          <Col>
            <h4>Please log in to continue.</h4>
            <hr />
            <a
              href={`${config.apiBase}/auth/google?redirect=${config.root}/dashboard`}
            >
              <Button className="btn-danger">Login using BITSMail</Button>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
