import type { Route } from "./+types/home";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';


export function meta({}: Route.MetaArgs) {
    return [
        { title: "Task Management" },
        { name: "description", content: "A simple app to manage tasks" },
    ];
}


function getFormattedDate(input_date: string) {

	const date = new Date(input_date);

	const timeFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, day: 'numeric' };
	let formatted_date: string = date.toLocaleDateString("en-GB", timeFormat);

	return formatted_date;
}


export async function clientLoader({
    params,
}: Route.ClientLoaderArgs) {
    const api_url: string = import.meta.env.VITE_APP_URL;

    const task_res = await fetch(api_url + "/");
    const task_data = await task_res.json();

    const status_res = await fetch(api_url + "/statuses/");
    const status_data = await status_res.json();

    return {task_data, status_data};
}


export default function Home({
  loaderData
}: Route.ComponentProps) {

    const {task_data, status_data} = loaderData;

    return (
        <Container fluid>
            <Row>
                <Col>
                    Top section
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <tbody>
                            {task_data.map((task: any) => (
                            <tr key={task.id}>
                                <td>{task.task_title}</td>
                                <td>{task.task_desc}</td>
                                <td>
                                    <Form.Select aria-label="task status" size="sm" defaultValue={task.status_id}>
                                    {status_data.map((task_status: any) => (
                                        <option value={task_status.id} key={task_status.id}>{task_status.status_desc}</option>
                                    ))}
                                    </Form.Select>
                                </td>
                                <td>{getFormattedDate(task.due)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    Bottom section
                </Col>
            </Row>
        </Container>
    );
}
