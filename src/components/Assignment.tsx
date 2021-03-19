import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../reducers/userReducer";
import { RouteComponentProps } from "@reach/router";
import {
  Container,
  Row,
  Col,
  Pagination,
  Card,
  Button,
  Alert,
} from "react-bootstrap";
import { AssignmentDetails, User } from "../types";
import NavBar from "./NavBar";
import Loading from "./Loading";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import config from "../config";
import { setGlobalErrors } from "../reducers/globalErrorsReducer";
import classNames from "classnames";
import { toast } from "react-toastify";
import { clone } from "../lib";

export default function Assignment(props: RouteComponentProps) {
  const user = useSelector(selectUser) as User;
  const assignmentID = props.uri?.split("/").pop() as string;
  const dispatch = useDispatch();
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [problemIdx, setProblemIdx] = useState<number>(0);
  const [myCode, setMyCode] = useState<string[]>([]);

  useEffect(() => {
    async function getAssignment(): Promise<AssignmentDetails> {
      return (await axios.get(`/assignments?assignmentId=${assignmentID}`))
        .data;
    }

    if (assignment === null) {
      getAssignment().then((data) => {
        const code = Array(data.problems.length);
        for (let i = 0; i < code.length; i++) {
          code[i] = config.defaultCode;
        }
        setMyCode(code);
        setAssignment(data);
      });
    }
  });

  if (!assignment) {
    return (
      <div className="home">
        <Container>
          <NavBar />
          <Loading />
        </Container>
      </div>
    );
  }

  const problem = () => assignment.problems[problemIdx];

  const runTestcase = async (problemIdx: number, testcaseIdx: number) => {
    const problem = assignment.problems[problemIdx];
    const testcase = problem.testcases[testcaseIdx];

    let ass = clone(assignment);
    ass.problems[problemIdx].testcases[testcaseIdx] = {
      ...testcase,
      verdict: "Running ...",
    };

    setAssignment(ass);

    const res = await axios.post("/assignments/run-testcase", {
      assignment_id: assignment.id,
      problem_id: problem.id,
      testcase_id: testcase.id,
      code: myCode[problemIdx],
      input: testcase.input,
      expected_output: testcase.output,
    });

    const data = res.data;

    if (data.errors) {
      return dispatch(setGlobalErrors(data.errors));
    }

    console.log(data);
    let newAssignment = clone(assignment);
    newAssignment.problems[problemIdx].testcases[testcaseIdx] = {
      ...testcase,
      verdict: data.verdict,
      got_output: data.stdout,
    };

    console.log("Creating new assignment", newAssignment);

    setAssignment(newAssignment);
  };

  function onCodeChange(newValue: string) {
    const newMyCode = myCode.map((val, idx) => {
      if (idx === problemIdx) {
        return newValue;
      } else {
        return val;
      }
    });
    setMyCode(newMyCode);
  }

  const renderPagination = () => {
    let active = problemIdx;
    let items = [];

    for (let number = 0; number < assignment.problems.length; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => setProblemIdx(number)}
        >
          Problem {number + 1}
        </Pagination.Item>
      );
    }

    return (
      <div>
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  const renderTestcases = () => {
    let items: React.ReactNode[] = [];
    problem().testcases.forEach((tc, idx) => {
      const pass = tc.verdict && tc.verdict === "PASS";
      const fail = tc.verdict && tc.verdict === "FAIL";
      const tcClassNames = classNames("tc", {
        pass,
        fail,
      });

      // let variant = "light";
      // if (pass) {
      //   variant = "success";
      // } else {
      //   variant = "danger";
      // }

      items.push(
        <Card className={tcClassNames}>
          <Card.Body>
            <h4>Testcase {idx + 1}</h4>
            <p>
              {tc.verdict && (
                <>
                  <b className="verdict">Status: {tc.verdict}</b>
                  <br />
                </>
              )}
              <b>Input</b>
              <pre>
                <code>{tc.input} </code>
              </pre>
              <b>Expected Output</b>
              <pre>
                <code>{tc.output} </code>
              </pre>
              {tc.got_output !== undefined && (
                <>
                  <b>Received Output</b>
                  <pre>
                    <code>{tc.got_output} </code>
                  </pre>
                </>
              )}
            </p>
            <Button onClick={() => runTestcase(problemIdx, idx)}>
              Run testcase
            </Button>
          </Card.Body>
        </Card>
      );
    });

    return items;
  };

  const renderAssignment = () => {
    console.log(problemIdx, myCode[problemIdx]);
    return (
      <div className="assignment">
        <Row>
          <Col>
            <h1>{assignment.name}</h1>
            <Alert variant="warning">
              The assignment will end at{" "}
              <b>{new Date(assignment.end).toDateString()}</b>
            </Alert>

            {renderPagination()}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>{problem().name}</h3>
            <div
              dangerouslySetInnerHTML={{ __html: problem().statement }}
            ></div>
          </Col>
          <Col>
            <AceEditor
              height="100%"
              width="100%"
              fontSize={15}
              mode="c_cpp"
              className="code-editor"
              theme="github"
              onChange={onCodeChange}
              name="102400"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
              value={myCode[problemIdx]}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <h3>Sample Testcases</h3>
            {renderTestcases()}
          </Col>
          <Col>
            <Button variant="success" size="lg" block>
              Submit Problem {problemIdx + 1}
            </Button>
            <hr />
            <p>
              If you submit, your code will run against a set of additional,
              hidden testcases.
            </p>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="home">
      <Container>
        <NavBar />
        {assignment ? renderAssignment() : <Loading />}
      </Container>
    </div>
  );
}
