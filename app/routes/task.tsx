import type { Route } from "./+types/task";
import { useState } from 'react';
import { Form, redirect } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormSelect from 'react-bootstrap/FormSelect';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Task Management - Task Screen" },
        { name: "description", content: "Add/Edit/Delete a task" },
    ];
}


export async function clientLoader() {

    const api_url: string = import.meta.env.VITE_APP_URL;

    const status_res = await fetch(api_url + "/statuses/", {credentials: "include"});
    const status_data = await status_res.json();
    
    return {status_data}
}


export async function clientAction({
  request
}: Route.ClientActionArgs) {

    const api_url: string = import.meta.env.VITE_APP_URL;

	let formData = await request.formData();

    const task_title = formData.get("task_title") as String;
	const task_desc = formData.get("task_desc") as String;
	const task_status = formData.get("task_status") as String;
	const task_date = formData.get("task_date") as String;
    const task_time = formData.get("task_time") as String;

    const due = task_date + "T" + task_time + ":00.000Z";

    console.log("Task title is : " + task_title);
    console.log("Task description is : " + task_desc);
    console.log("Task status is : " + task_status);
    console.log("Task date is : " + task_date);
    console.log("Task time is : " + task_time);
    console.log("due is : " + due);

    const save_response = await fetch(`${api_url}/tasks/`, 
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
        }
    )
    const result = await save_response.json();
    console.log(result);
    if(result.status >= 200 && result.status <= 299) {
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

    const {status_data} = loaderData;
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    return (
        <div>
            <Card className="m-3">
                <Card.Header>
                    Add a task
                </Card.Header>
                <Card.Body>
                    <Form method="post">
                        <FormGroup className="mb-3" controlId="formTaskTitle">
                            <FormLabel>Task title</FormLabel>
                            <FormControl name="task_title" type="text" placeholder="Enter task title" required />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskDescription">
                            <FormLabel>Task description</FormLabel>
                            <FormControl as="textarea" rows={3} name="task_desc" placeholder="Enter task description" />
                            <FormText className="text-muted">
                                This is optional
                            </FormText>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskStatus">
                            <FormLabel>Task status</FormLabel>
                            <FormSelect name="task_status" aria-label="task status" required>
                                {status_data.map((task_status: any) => (
                                    <option value={task_status.id} key={task_status.id}>{task_status.status_desc}</option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formTaskDueDatetime">
                            <FormLabel>When is the task due?</FormLabel>
                            <FormControl name="task_date" type="date" required />
                            <FormControl name="task_time" type="time" className="mt-2" required />
                        </FormGroup>
                        <ButtonGroup aria-label="Save and Submit buttons">
                            <Button variant="primary" type="submit">Save</Button>
                            <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>Cancel</Button>
                        </ButtonGroup>
                    </Form>
                </Card.Body>
                <Card.Footer>{actionData ? actionData : ""}</Card.Footer>
            </Card>
        </div>
    );
}