import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, navigate, RouteComponentProps } from '@reach/router';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { setGlobalErrors } from '../reducers/globalErrorsReducer';

export default function AddQuestion(props: RouteComponentProps) {
	interface testCase {
		input: string;
		output: string;
		isVisible: boolean;
	}
	const dispatch = useDispatch();
	const assignmentID = '60549cef9e82930fb06e13d1';
	const langs = new Set<string>();
	const languagesList: Array<string> = [ 'C++', 'Java', 'Python', 'Go', 'JS', 'Rust' ];
	const [ problemName, setProblemName ] = useState<string>('');
	const [ problemStatement, setProblemStatement ] = useState<string>('');
	const [ languagesAllowed, setLanguagesAllowed ] = useState<Array<string>>([]);
	const [ timeLimit, setTimeLimit ] = useState<number>(0);
	const [ memoryLimit, setMemoryLimit ] = useState<number>(0);
	const [ error, setError ] = useState('');
	const [ testCases, setTestCases ] = useState<Array<testCase>>([]);

	function addTestCase() {
		let input = '';
		let output = '';
		let isVisible = false;
		setTestCases([ ...testCases, { input, output, isVisible } ]);
	}

	function removeTestCase(index: number) {
		setTestCases((testCases) => {
			testCases.splice(index, 1);
			return testCases;
		});
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const target = e.target;
		if (target.checked) {
			langs.add(target.value);
		} else {
			langs.delete(target.value);
		}
	}

	function toggleVisibility(index: number) {
		setTestCases((testCases) => {
			testCases[index].isVisible = !testCases[index].isVisible;
			return testCases;
		});
	}

	function createNewQuestion() {
		if (!problemName) {
			setError('Set problem name!');
			return;
		}
		if (!problemStatement) {
			setError('Problem statement empty!');
			return;
		}
		if (langs.size == 0) {
			setError('Select languages allowed!');
			return;
		}
		if (!timeLimit) {
			setError('Set time limit!');
			return;
		}
		if (!memoryLimit) {
			setError('Set memory limit!');
			return;
		}
		if (timeLimit <= 0) {
			setError('Invalid time limit!');
			return;
		}
		if (memoryLimit <= 0) {
			setError('Invalid memory limit!');
			return;
		}
		if (testCases.length == 0) {
			setError('Add test cases!');
			return;
		}
		testCases.forEach((tc, id) => {
			if (tc.input == '' || tc.output == '') {
				id++;
				setError('Input/Output missing in test case' + id + '!');
				return;
			}
		});

		const langAll = new Array<string>();
		langs.forEach((e) => langAll.push(e));
		setLanguagesAllowed(langAll);

		// console.log(assignmentID);
		// console.log(problemName);
		// console.log(problemStatement);
		// languagesAllowed.forEach((l) => {
		// 	console.log(l);
		// });
		// console.log(timeLimit);
		// console.log(memoryLimit);
		// testCases.forEach((t) => {
		// 	console.log(t.input);
		// 	console.log(t.output);
		// 	console.log(t.isVisible);
		// });
		// ?assignmentId=${assignmentID}
		axios
			.post('/assignments/add-question', {
				assigment_id: assignmentID,
				name: problemName,
				problem_statement: problemStatement,
				languages_allowed: languagesAllowed,
				time_limit: timeLimit,
				memory_limit: memoryLimit,
				testcases: testCases
			})
			.then((res) => {
				const data = res.data;
				console.log(data);
				if (data.errors) {
					dispatch(setGlobalErrors(data.errors));
					return;
				}
				setError('');
			});
	}

	return (
		<div className="home">
			<Container>
				<Row>
					<Col>
						<div>
							<h3>Add a question</h3>
							<hr />
							<div>{error && <Alert variant="danger">{error}</Alert>}</div>
							<Form>
								<Form.Label>Problem Name</Form.Label>
								<Form.Control
									type="string"
									value={problemName}
									onChange={(e) => setProblemName(e.target.value)}
								/>
								<br />
								<Form.Group controlId="exampleForm.ControlTextarea1">
									<Form.Label>Problem Statement</Form.Label>
									<Form.Control
										type="string"
										value={problemStatement}
										onChange={(e) => setProblemStatement(e.target.value)}
										as="textarea"
										rows={10}
									/>
								</Form.Group>

								<div className="form-row">
									<div className="form-group col-md-6">
										<label>Languages Allowed:</label>
										<br />
										{languagesList.map((language, id) => (
											<div className="form-check form-check-inline">
												<input
													className="form-check-input"
													type="checkbox"
													id="inlineCheckboxh1"
													value={language}
													onChange={(e) => handleInputChange(e)}
												/>
												<label className="form-check-label" htmlFor="inlineCheckboxh1">
													{language}
												</label>
											</div>
										))}
									</div>
								</div>

								<Row>
									<Col xs="auto">
										<Form.Label htmlFor="inlineFormInput">Time Limit (in s)</Form.Label>
										<Form.Control
											onChange={(e) => setTimeLimit(parseInt(e.target.value))}
											className="mb-2"
											id="inlineFormInput"
										/>
									</Col>
									<Col xs="auto">
										<Form.Label htmlFor="inlineFormInput">Memory Limit (in MB)</Form.Label>
										<Form.Control
											onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
											className="mb-2"
											id="inlineFormInput"
										/>
									</Col>
								</Row>
								{testCases.map((tc, id) => (
									<div className="center">
										<Row>
											<Form.Label>Test case </Form.Label>
											{id + 1}
											<Col xs="auto">
												<Form.Group controlId="exampleForm.ControlTextarea1">
													<Form.Control
														type="string"
														onChange={(e) => (testCases[id].input = e.target.value)}
														as="textarea"
														rows={5}
														cols={30}
														placeholder="Input"
													/>
												</Form.Group>
											</Col>
											<Col xs="auto">
												<Form.Group controlId="exampleForm.ControlTextarea1">
													<Form.Control
														type="string"
														onChange={(e) => (testCases[id].output = e.target.value)}
														as="textarea"
														rows={5}
														cols={30}
														placeholder="Expected Output"
													/>
												</Form.Group>
											</Col>
											<Col xs="auto">
												<input
													className="form-check-input visible"
													type="checkbox"
													id="inlineCheckboxh2"
													value="visible"
													onChange={(e) => toggleVisibility(id)}
												/>
												<label className="form-check-label" htmlFor="inlineCheckboxh1">
													Visible
												</label>
											</Col>
											<Col xs="auto">
												<Button variant="dark" onClick={() => removeTestCase(id)}>
													X
												</Button>
											</Col>
										</Row>
									</div>
								))}
								<Button variant="info" onClick={addTestCase}>
									Add test case
								</Button>
								<br />
								<br />
								<Button variant="primary" type="submit" onClick={createNewQuestion}>
									Submit
								</Button>
							</Form>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
