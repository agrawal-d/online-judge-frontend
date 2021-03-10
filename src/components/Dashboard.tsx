import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../reducers/userReducer";
import { navigate, RouteComponentProps } from "@reach/router";
import { User } from "../types";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;

  useEffect(() => {
    if (user.he_client_id === "" || user.he_client_secret === "") {
      navigate("/user-setup");
    }
  });

  if (user.is_admin) {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
}
