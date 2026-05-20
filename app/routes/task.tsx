import type { Route } from "./+types/task";
import { redirect } from 'react-router';
import { getFormattedDate } from "../root";
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

import {NewTaskForm, EditDeleteTaskForm} from '../forms/task_forms'


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
    let status_data = [];

    try {
        if(task_id) {
            const task_res = await fetch(api_url + "/tasks/"+task_id, { credentials: "include" });
            if (!task_res.ok) {
                throw new Error(`Response status from getting tasks: ${task_res.status}`);
            }
            task_data = await task_res.json();
        }

        const status_res = await fetch(api_url + "/statuses/", { credentials: "include" });
        if (!status_res.ok) {
            throw new Error(`Response status from getting statuses: ${status_res.status}`);
        }
        status_data = await status_res.json();
    }
    catch(error) {
        if(error instanceof Error) {
            console.error(error.message);
        }
    }

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

    const { status_data, task_data } = loaderData;

    const api_url: string = import.meta.env.VITE_APP_URL;

    const navigate = useNavigate();

    const deleteTask = async () => {
        try {
            const delete_response = await fetch(`${api_url}/tasks/${task_data.id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!delete_response.ok) {
                throw new Error(`Response status from deleting: ${delete_response.status}`);
            }

            if (delete_response.status >= 200 && delete_response.status <= 299) {
                navigate('/');
            }
        }
        catch(error) {
            if(error instanceof Error) {
                console.error(error.message);
            }
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
                        <NewTaskForm status_data={status_data} />
                    :
                    <div>
                        <p>{task_data.task_desc ? task_data.task_desc: "No description."}</p>
                        <p><b>Due:</b> {getFormattedDate(task_data.due)}</p>
                        <EditDeleteTaskForm task_data={task_data} status_data={status_data} deleteTask={deleteTask} />
                    </div>
                    }
                </Card.Body>
                <Card.Footer>{actionData ? actionData : ""}</Card.Footer>
            </Card>
        </div>
    );
}