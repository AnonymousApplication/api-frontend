import type { Route } from "./+types/task";
import { Form, redirect } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getFormattedDate } from "../root";

import Card from 'react-bootstrap/Card';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormSelect from 'react-bootstrap/FormSelect';
import FormText from 'react-bootstrap/FormText';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

import { type Task_Status } from '../types';


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Task Management - Task Screen" },
        { name: "description", content: "Add/Edit/Delete a task" },
    ];
}


export async function clientLoader({ 
	request,
}: Route.ClientLoaderArgs) {

    const api_url: string = import.meta.env.VITE_APP_URL;

    const [,searchParams] = request.url.split("?");
	const task_id: string | null = new URLSearchParams(searchParams).get("task_id");

    let task_data = {
        id: 0,
        task_title: undefined,
        task_desc: undefined,
        status_id: undefined,
        task_date: undefined,
        due: ""
    }
    if(task_id) {
        const task_res = await fetch(api_url + "/tasks/"+task_id, { credentials: "include" });
        task_data = await task_res.json();
    }

    const status_res = await fetch(api_url + "/statuses/", { credentials: "include" });
    const status_data = await status_res.json();

    return { status_data, task_data, api_url }
}


export async function clientAction({
    request
}: Route.ClientActionArgs) {

    const api_url: string = import.meta.env.VITE_APP_URL;

    let formData = await request.formData();

    let save_response = undefined;
    if(request.method === "POST") {
        const task_title = formData.get("task_title") as String;
        const task_desc = formData.get("task_desc") as String;
        const task_status = formData.get("task_status") as String;
        const task_date = formData.get("task_date") as String;
        const task_time = formData.get("task_time") as String;

        const due = task_date + "T" + task_time + ":00.000Z";

        save_response = await fetch(`${api_url}/tasks/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                {
                    task_title: task_title,
                    task_desc: task_desc,
                    status_id: task_status,
                    due: due,
                }
            )
        })
    }
    else { // PATCH
        const task_status = formData.get("task_status") as String;
        const task_id = formData.get("id") as String;

        save_response = await fetch(`${api_url}/tasks/${task_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(
                {
                    status_id: task_status,
                }
            )
        })
    }

    if (save_response.status >= 200 && save_response.status <= 299) {
        return redirect("/");
    }
    else {
        return "There was a problem saving the task."
    }
}


export default function Task({
    actionData,
    loaderData
}: Route.ComponentProps) {

    const { status_data, task_data, api_url } = loaderData;
    const navigate = useNavigate();

    // delete confirmation
    const [deleteShow, setDeleteShow] = useState(false);
    const handleNo = () => {
        setDeleteShow(false);
    }
    const handleYes = () => {
        setDeleteShow(false);
        deleteTask();
    }
    const handleDeleteShow = (task_id: number) => {
        setDeleteShow(true);
    }

    const deleteTask = async () => {
        const delete_response = await fetch(`${api_url}/tasks/${task_data.id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (delete_response.status >= 200 && delete_response.status <= 299) {
            navigate('/');
        }
    }

    return (
        <div>
            <Card className="m-3">
                <Card.Header>
                    {task_data.id === 0 ? "Add a task" : task_data.task_title }
                </Card.Header>
                <Card.Body>
                    {task_data.id === 0 ? 
                    <Form method="post"> 
                        <FormGroup className="mb-3" controlId="formTaskTitle">
                            <FormLabel>Task title</FormLabel>
                            <FormControl 
                                name="task_title" 
                                type="text" 
                                placeholder="Enter task title"
                                required />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskDescription">
                            <FormLabel>Task description</FormLabel>
                            <FormControl 
                                as="textarea" 
                                rows={3} 
                                name="task_desc" 
                                placeholder="Enter task description" />
                            <FormText className="text-muted">
                                This is optional
                            </FormText>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskStatus">
                            <FormLabel>Task status</FormLabel>
                            <FormSelect 
                                name="task_status" 
                                aria-label="task status" 
                                defaultValue={task_data.status_id}
                                required>
                                {status_data.map((task_status: Task_Status) => (
                                    <option value={task_status.id} key={task_status.id}>{task_status.status_desc}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskDueDatetime">
                            <FormLabel>When is the task due?</FormLabel>
                            <FormControl 
                                name="task_date" 
                                type="date"
                                required />
                            <FormControl 
                                name="task_time" 
                                type="time" 
                                className="mt-2" 
                                required />
                        </FormGroup>
                        <ButtonGroup aria-label="Save and Submit buttons">
                            <Button variant="primary" type="submit">Save</Button>
                            <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>Cancel</Button>
                        </ButtonGroup>
                    </Form>
                    :
                    <div>
                        <p>{task_data.task_desc ? task_data.task_desc: "No description."}</p>
                        <p><b>Due:</b> {getFormattedDate(task_data.due)}</p>
                        <Form method="patch"> 
                            <FormGroup as={Row} className="mb-3" controlId="formTaskTitle">
                                <FormLabel column>Task ID</FormLabel>
                                <Col sm="10">
                                    <FormControl 
                                        name="id" 
                                        type="text" 
                                        defaultValue={task_data.id}
                                        readOnly />
                                </Col>
                            </FormGroup>
                            <FormGroup as={Row} className="mb-3" controlId="formTaskStatus">
                                <FormLabel column>Change status</FormLabel>
                                <Col sm="10">
                                    <FormSelect 
                                        name="task_status" 
                                        aria-label="task status" 
                                        defaultValue={task_data.status_id}
                                        required>
                                        {status_data.map((task_status: Task_Status) => (
                                            <option value={task_status.id} key={task_status.id}>{task_status.status_desc}</option>
                                        ))}
                                    </FormSelect>
                                </Col>
                            </FormGroup>
                            <ButtonGroup aria-label="Save and Submit buttons">
                                <Button variant="primary" type="submit">Save</Button>
                                <Button className="ms-auto" variant="danger" onClick={() => handleDeleteShow(task_data.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </Button>
                                <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>Cancel</Button>
                            </ButtonGroup>
                        </Form> 
                    </div>
                    }
                    <Modal show={deleteShow} onHide={handleNo}>
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
                </Card.Body>
                <Card.Footer>{actionData ? actionData : ""}</Card.Footer>
            </Card>
        </div>
    );
}