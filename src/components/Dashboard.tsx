import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
import { Counter } from "../features/demo/Counter";
import config from "../config";
import { Container, Row, Col, Button } from "react-bootstrap";
import { User } from "../types";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const dispatch = useDispatch();

  const logout = () => {
    axios.post("/auth/logout");
    dispatch(setUser(null));
    navigate("/");
  };

  if (user.is_admin) {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
}
