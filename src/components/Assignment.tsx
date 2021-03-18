import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../reducers/userReducer";
import { Link, navigate, RouteComponentProps } from "@reach/router";
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
      items.push(
        <Card className="tc">
          <Card.Body>
            <h4>Testcase {idx + 1}</h4>
            <p>
              <b>Input</b>
              <pre>
                <code>{tc.input}</code>
              </pre>
              <b>Expected Output</b>
              <pre>
                <code>{tc.output}</code>
              </pre>
            </p>
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
            <Button variant="success" block>
              Run sample testcases
            </Button>
            <Button variant="primary" block>
              Submit problem {problemIdx + 1}
            </Button>
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
