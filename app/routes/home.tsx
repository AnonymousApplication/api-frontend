import type { Route } from "./+types/home";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

// JS Tour
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

import { type Task, type Task_Status } from '../types';


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Task Management - Home Screen" },
        { name: "description", content: "A simple app to manage tasks" },
    ];
}


function getFormattedDate(input_date: string) {

	const date = new Date(input_date);

	const timeFormat: Intl.DateTimeFormatOptions = { 
        timeZone: 'GMT',
        year: 'numeric', 
        month: 'long', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false, 
        day: 'numeric' 
    };
	let formatted_date: string = date.toLocaleDateString("en-GB", timeFormat);

	return formatted_date;
}


export async function clientLoader() {
    const api_url: string = import.meta.env.VITE_APP_URL;

    const status_res = await fetch(api_url + "/statuses/", {credentials: "include"});
    const status_data = await status_res.json();
    
    return {status_data, api_url};
}


export default function Home({
  loaderData
}: Route.ComponentProps) {

    const navigate = useNavigate();
    const {status_data, api_url} = loaderData;
    const [message, setMessage] = useState("");
    const [task_data, setTasks] = useState([]);

    // set pagination links
	const [first_link, setFirstLink] = useState("");
	const [last_link, setLastLink] = useState("");
	const [previous_link, setPreviousLink] = useState("");
	const [next_link, setNextLink] = useState("");

    // delete confirmation
    const [show, setShow] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const handleNo = () => {
        setShow(false);
        setDeleteId(0);
    }
    const handleYes = () => {
        setShow(false);
        deleteTask();
    }
    const handleShow = (task_id: number) => {
        setShow(true);
        setDeleteId(task_id);
    }

    const fetchTasks = async (pagination: string) => {

		try {
			const response = await fetch(api_url+pagination, {credentials: "include"})
			const tasks = await response.json();

			setTasks(tasks.items);

			// set pagination links
			setFirstLink(tasks.links.first);
			setLastLink(tasks.links.last);
			setPreviousLink(tasks.links.prev);
			setNextLink(tasks.links.next);
		}
		catch(error) {
			console.log('There was an error', error);
			navigate("/");
			return;
		}
	}

    const changeStatus = async (task_id: number, status_value: string) => {
        const update_response = await fetch(`${api_url}/tasks/${task_id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                {
                    status_id: status_value,
                }
            )
        });
        const result = await update_response.json();

        if (update_response.status >= 200 && update_response.status <= 299) {
			setMessage("Status updated for task with title: '" + result.task_title + "'");
		} 
        else {
            setMessage("There was a problem updating the status.");
        }
    }

    const deleteTask = async () => {
        const delete_response = await fetch(`${api_url}/tasks/${deleteId}`, {
            method: "DELETE",
            credentials: "include",
        });
        setDeleteId(0);

        if (delete_response.status >= 200 && delete_response.status <= 299) {
            window.location.reload();
		} 
        else {
            setMessage("There was a problem deleting the task.");
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
                        <Nav.Link href="" onClick={() => introJs.tour().start() }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </Nav.Link>
                        <Navbar.Brand className="ms-2">
                            Task Management
                        </Navbar.Brand>
                        <Pagination aria-label="Task pagination" className="mb-0" data-intro="Navigate through the pages of tasks with these controls" data-step="2">
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
                        <Nav.Link href="task" className="ms-auto">
                            <Button>Add a task</Button>
                        </Nav.Link>
                    </Navbar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table data-intro="A table with all the tasks" data-step="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Task title</th>
                                <th>Task description</th>
                                <th>Task status</th>
                                <th>Due</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {task_data.map((task: Task) => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.task_title}</td>
                                <td>{task.task_desc}</td>
                                <td>
                                    <Form.Select 
                                        aria-label="task status" size="sm" 
                                        defaultValue={task.status_id} 
                                        onChange={
                                            e => {
                                                changeStatus(task.id, e.target.value);
                                        }}
                                    >
                                    {status_data.map((task_status: Task_Status) => (
                                        <option value={task_status.id} key={task_status.id}>{task_status.status_desc}</option>
                                    ))}
                                    </Form.Select>
                                </td>
                                <td>{getFormattedDate(task.due)}</td>
                                <td className="me-0">
                                    <Button variant="danger" onClick={() => handleShow(task.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body className="text-muted" data-intro="Status messages will appear here" data-step="3">{message}</Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={show} onHide={handleNo}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleNo}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleYes}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
