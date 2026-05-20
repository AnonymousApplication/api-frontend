# Introduction

A frontend using React Router to interact with data from an API located at:
https://github.com/AnonymousApplication/api-backend

Some features:
- Pagination for tasks
- A button that gives you a guided tour of what you can do on the main page
- Click on a task from the home screen to edit the status for a task
- Add a new task
- Delete a task

See further down for some screenshots.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Environment variables

To connect to the backend we need an environment variable pointing to it. E.g.
```
VITE_APP_URL=http://127.0.0.1:8000
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Screenshots