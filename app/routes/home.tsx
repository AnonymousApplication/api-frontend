import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Management" },
    { name: "description", content: "A simple app to manage tasks" },
  ];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const api_url: string = import.meta.env.VITE_APP_URL;

  const res = await fetch(api_url + "/");
  const data = await res.json();

  console.log(data);
  return data
}

export default function Home({
  loaderData
}: Route.ComponentProps) {

  const tasks = loaderData;

  return (
    <div>{tasks.map((task: any) => (
      <div>{task.task_title}</div>
    ))}</div>
  );
}
