import { 
    type RouteConfig,
    route,
    index 
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("task", "routes/task.tsx"),
] satisfies RouteConfig;
