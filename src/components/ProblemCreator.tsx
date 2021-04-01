import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Alert,
  Collapse,
} from "react-bootstrap";
import axios from "axios";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
import Datetime from "react-datetime";
import { AssignmentDetails, Problem, Testcase } from "../types";
import { clone } from "../lib";
import { toast } from "react-toastify";

const initialState = {
  name: "",
  _id: "-1",
  problem_statement: "",
  language: "C",
  testcases: [],
};

export default function ProblemCreator(props: {
  assignment: AssignmentDetails;
}) {
  const dispatch = useDispatch();

  const assignment = props.assignment;
  const [numTcs, setNumTcs] = useState<number>(0);
  const [problem, setProblem] = useState<Problem>(initialState);

  const updateBlankTcs = (count: number) => {
    const tcs: Testcase[] = [];
    for (let i = 0; i < count; i++) {
      tcs.push({
        input: "",
        output: "",
        visible: true,
        _id: "",
      });
    }
    const newProblem = clone(problem);
    newProblem.testcases = tcs;
    setProblem(newProblem);
  };

  const saveProblem = async () => {
    const data = {
      assignment_id: assignment._id,
      name: problem.name,
      time_limit: 100,
      memory_limit: 1024,
      problem_statement: problem.problem_statement,
      languages_allowed: ["C"],
      testcases: problem.testcases,
    };

    const res = await axios.post("/assignments/add-problem", data);
    if (!res.data) {
      return toast("An error occurred");
    }
    if (res.data.errors) {
      return dispatch(setGlobalErrors(res.data.errors));
    }

    toast("Problem added to assignment");
    // setProblem(clone(initialState));
  };

  const renderTcs = () => {
    const ret: React.ReactElement[] = [];
    console.log(numTcs);
    for (let i = 0; i < problem.testcases.length; i++) {
      ret.push(
        <div key={i}>
          <fieldset>
            <legend>
              <h4>Testcase {i + 1}</h4>
            </legend>
            <Form.Control
              placeholder="Input"
              value={problem.testcases[i].input}
              as="textarea"
              rows={2}
              onChange={(e) => {
                const newProblem = clone(problem);
                newProblem.testcases[i].input = e.target.value;
                setProblem(newProblem);
              }}
            />
            <br />
            <Form.Control
              placeholder="Expected Output"
              value={problem.testcases[i].output}
              as="textarea"
              rows={2}
              onChange={(e) => {
                const newProblem = clone(problem);
                newProblem.testcases[i].output = e.target.value;
                setProblem(newProblem);
              }}
            />
            <br />
            Testcase visible to candidates{" "}
            <input
              type="checkbox"
              checked={problem.testcases[i].visible}
              onChange={(e) => {
                const newProblem = clone(problem);
                newProblem.testcases[i].visible = !newProblem.testcases[i]
                  .visible;
                setProblem(newProblem);
              }}
            />
          </fieldset>
          <hr />
        </div>
      );
    }

    return ret;
  };

  return (
    <div>
      <Form.Control
        placeholder="Problem name"
        value={problem.name}
        onChange={(e) => {
          setProblem({
            ...problem,
            name: e.target.value,
          });
        }}
      />
      <br />
      <Form.Control
        placeholder="Problem statement. HTML is allowed."
        value={problem.problem_statement}
        as="textarea"
        rows={10}
        onChange={(e) => {
          setProblem({
            ...problem,
            problem_statement: e.target.value,
          });
        }}
      />
      <br />
      <Form.Control
        type="number"
        placeholder="Number of testcases"
        value={numTcs}
        onChange={(e) => {
          let num = parseInt(e.target.value);
          if (num <= 0) {
            num = 1;
          }
          updateBlankTcs(num);
          setNumTcs(num);
        }}
      />
      <br />
      {renderTcs()}
      <Button onClick={saveProblem}>Save problem</Button>
    </div>
  );
}
