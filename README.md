## Wa Ko Kabalo

A student productivity and academic management system for when you don't know what to do next.

Wa Ko Kabalo is a web-based student productivity system designed to help students organize their academic life in one place.

From assignments and deadlines to subjects and study sessions, the system helps students keep track of what needs to be done, what's already finished, and—most importantly—unsa ang buhaton karon?

The project will initially focus on a frontend-only implementation using mock data. A backend powered by Node.js and a database will be integrated in a future version.

# Project Goal

Students often have assignments, projects, quizzes, exams, and other academic responsibilities scattered across different platforms, notebooks, and group chats.

Wa Ko Kabalo aims to provide a simple and centralized dashboard where students can:

📝 Manage academic tasks and assignments
📚 Organize subjects
📅 Track deadlines and upcoming activities
⏱️ Plan study sessions
📊 Monitor academic task progress
🎯 Identify their most important tasks
😭 Panic slightly less

# The goal is to answer one simple question:

"Unsa akong buhaton karon?"

# Features

# Dashboard

The dashboard provides an overview of the student's academic workload:

- Active tasks, due-today tasks, overdue tasks, and completed tasks
- Overall completion rate and priority task views
- Upcoming deadlines and focus-session preview

# Task Management

Tasks support CRUD operations and academic planning details:

- Create, view, edit, and delete tasks
- Update task status and completion progress
- Assign tasks to subjects
- Set task priorities and deadlines

# Subject Management

Students can organize their academic subjects:

- Add, view, edit, and delete subjects
- Assign tasks to subjects
- View subject workload and progress

# Study Planner

The Planner tab provides an interactive weekly schedule:

- Create, view, edit, and delete study sessions
- Assign sessions to subjects and set duration and topic
- Click any date to view that day's tasks and study sessions
- See colored date dots for scheduled items and task priority
- Mark tasks or sessions complete with a check mark and strike-through state
- Move between weeks with the previous and next controls
- Switch between Weekly, Daily Flow, and Month planner tabs

Completion and planner data are stored in the browser's local storage.

# Pages

The frontend prototype contains four main pages:

- `index.html` - Dashboard
- `tasks.html` - Task management
- `subjects.html` - Subject management
- `planner.html` - Weekly study planner

# Project Structure

```text
css/style.css       Shared layout and component styles
js/data.js          Local storage data and seed data
js/dashboard.js     Dashboard rendering and statistics
js/tasks.js         Task CRUD and filtering
js/subjects.js      Subject CRUD and summaries
js/planner.js       Planner rendering and session interactions
assets/logo.svg     Wa Ko Kabalo logo
```

# Running Locally

No build step or dependency installation is required. Open `index.html` in a browser, or serve the folder with any static web server.

Example with VS Code Live Server:

1. Open the project folder in VS Code.
2. Start Live Server on `index.html`.
3. Use the sidebar to navigate between Dashboard, Tasks, Subjects, and Planner.
