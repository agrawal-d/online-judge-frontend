import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate } from "@reach/router";
import { Row, Col, Button } from "react-bootstrap";
import { User } from "../types";

export default function Navbar() {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();

  const logout = () => {
    axios.post("/auth/logout");
    dispatch(setUser(null));
    navigate("/");
  };

  const getName = () => {
    if (user.is_admin) {
      return "Admin " + user.name;
    } else if (user.is_ta) {
      return "TA " + user.name;
    }

    return user.name;
  };

  return (
    <div className="dash-navbar">
      <Row className="align-items-center">
        <Col>
          <img src={user.picture} className="b" alt="profile" />
        </Col>
        <Col>
          <h3 className="text-right">Welcome, {getName()} </h3>
          <p className="text-right">
            <Link to="/dashboard">
              <Button className="">Dashboard</Button>
            </Link>
            <Button className="btn-danger" onClick={logout}>
              Logout
            </Button>
          </p>
        </Col>
      </Row>
    </div>
  );
}
