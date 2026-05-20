import { Form } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

import { type Task, type Task_Status } from '../types';


export function NewTaskForm(props: any) {

    const status_data = props.status_data;

    const navigate = useNavigate();

    return (
        <Form method="post"> 
            <FormGroup className="mb-3" controlId="formTaskTitle">
                <FormLabel>Task title</FormLabel>
                <FormControl 
                    name="task_title" 
                    aria-label="task title" 
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
                    aria-label="task description" 
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
                    aria-label="task date" 
                    required />
                <FormControl 
                    name="task_time" 
                    type="time"
                    aria-label="task time"  
                    className="mt-2" 
                    required />
            </FormGroup>
            <ButtonGroup aria-label="Save and Submit buttons">
                <Button variant="primary" type="submit">Save</Button>
                <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>Cancel</Button>
            </ButtonGroup>
        </Form>
    );
}


export function EditDeleteTaskForm(props: any) {

    const task_data = props.task_data;
    const status_data = props.status_data;

    const navigate = useNavigate();

    // delete confirmation
    const [deleteShow, setDeleteShow] = useState(false);
    const handleNo = () => {
        setDeleteShow(false);
    }
    const handleYes = () => {
        setDeleteShow(false);
        props.deleteTask();
    }
    const handleDeleteShow = () => {
        setDeleteShow(true);
    }

    return (
        <Form method="patch"> 
            <FormGroup as={Row} className="mb-3" controlId="formTaskTitle">
                <FormLabel column>Task ID</FormLabel>
                <Col sm="10">
                    <FormControl 
                        name="id" 
                        type="text"
                        aria-label="task id"  
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
            <ButtonGroup aria-label="Save, Delete and Cancel buttons">
                <Button variant="primary" type="submit">Save</Button>
                <Button className="ms-auto" variant="danger" onClick={() => handleDeleteShow()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </Button>
                <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>Cancel</Button>
            </ButtonGroup>

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
        </Form> 
    );
}