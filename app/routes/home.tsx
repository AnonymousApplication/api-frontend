import type { Route } from "./+types/home";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFormattedDate } from "../root";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

// JS Tour
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

import { type Task } from '../types';


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Task Management - Home Screen" },
        { name: "description", content: "A simple app to manage tasks" },
    ];
}


export default function Home() {

    const navigate = useNavigate();
    const api_url: string = import.meta.env.VITE_APP_URL;
    const [task_data, setTasks] = useState([]);

    // set pagination links
	const [first_link, setFirstLink] = useState("");
	const [last_link, setLastLink] = useState("");
	const [previous_link, setPreviousLink] = useState("");
	const [next_link, setNextLink] = useState("");

    const fetchTasks = async (pagination: string) => {

		try {
			const response = await fetch(api_url+pagination, {credentials: "include"})
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

			const tasks = await response.json();

			setTasks(tasks.items);

			// set pagination links
			setFirstLink(tasks.links.first);
			setLastLink(tasks.links.last);
			setPreviousLink(tasks.links.prev);
			setNextLink(tasks.links.next);
		}
		catch(error) {
            if(error instanceof Error) {
			    console.error(error.message);
            }
		}
	}

    useEffect(() => {
		fetchTasks("");
	}, []);

    return (
        <Container className="p-3" fluid>
            <Row>
                <Col>
                    <Navbar>
                        <Nav.Link href="" onClick={() => introJs.tour().start() } aria-label="Page tour button" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </Nav.Link>
                        <Navbar.Brand className="ms-2">
                            Task Manager
                        </Navbar.Brand>
                        <Pagination aria-label="Task pagination" className="mb-0 ms-auto" data-intro="Navigate through the pages of tasks with these controls." data-step="2">
                            {first_link && 
                            <Pagination.First aria-label="First page" onClick={() => fetchTasks(first_link) } /> 
                            }
                            {previous_link &&
                            <Pagination.Prev aria-label="Previous page" onClick={() => fetchTasks(previous_link) } />
                            }
                            {next_link && 
                            <Pagination.Next aria-label="Next page" onClick={() => fetchTasks(next_link) } />
                            }
                            {last_link && 
                            <Pagination.Last aria-label="Last page" onClick={() => fetchTasks(last_link) } />
                            }
                        </Pagination>
                    </Navbar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table data-intro="Your tasks. Select a row to edit a task." data-step="1" aria-label="table of tasks" hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Due</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {task_data.map((task: Task) => (
                            <tr key={task.id} style={{ cursor: "pointer" }} onClick={() => navigate('/task?task_id=' + task.id)}>
                                <td>{task.task_title}</td>
                                <td>{getFormattedDate(task.due)}</td>
                                <td>{task.task_status.status_desc}</td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Nav.Link href="task" data-intro="Add a new task." data-step="3" className="d-grid">
                        <Button aria-label="Add button">Add new task</Button>
                    </Nav.Link>  
                </Col>
            </Row>
        </Container>
    );
}
