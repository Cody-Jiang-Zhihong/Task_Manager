# Task Manager

## Overview
This project implements a web-based task manager with various functionalities including task display, filtering, sorting, pinning, and adding new tasks. The tasks are stored locally on the server.

### Features
- Display a list of tasks using a GET form.
- Filter tasks by title and/or tags.
- Sort tasks by due date or priority.
- Pin important tasks.
- Add new tasks using a POST form.
- Fields for tasks: title, description, priority, due-date, pinned, tags, progress.

## Directory Structure
- app.mjs: Main server file.
- saved-tasks: Folder containing example task files in JSON format.
- public: Contains static files like CSS and images.
- views: Contains Handlebars templates for the pages (home, add, layout).

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone [REPO URL]
   ```

2. Navigate to the project directory:
   ```bash
   cd [Repository Name]
   ```

3. Install dependencies:
   ```bash
   npm install express hbs
   ```

4. Set up a .gitignore file to exclude node_modules and other non-essential files.

## Running the Application
- Start the server:
  ```bash
  node app.mjs
  ```
- Access the application through `http://localhost:3000/`.

## Pages
- Home (`/`): Displays all tasks with options to filter by tags or titles and sort by due date or priority.
- Add (`/add`): Allows users to submit new tasks.

## Development Notes
- Use Express for server-side operations.
- Handlebars (hbs) is used for templating.
- Implement middleware for logging requests in `app.mjs`.
- Tasks are read from JSON files in the `saved-tasks` directory and displayed on the homepage.
- Implement sorting and filtering functionality on the homepage.
- Ensure the add task page (`/add`) correctly submits tasks to the server.

## Contribution
Contributions to this project are welcome. Please make sure to update tests as appropriate and adhere to the existing coding style.

## License
This project is MIT licensed.
