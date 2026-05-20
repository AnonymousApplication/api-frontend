export type Task = {
    id: number;
    task_title: string;
    task_desc: string;
    status_id: number;
    due: string;
    task_status: Task_Status;
}

export type Task_Status = {
    id: number;
    status_desc: string;
}