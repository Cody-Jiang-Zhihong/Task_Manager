// app.mjs
import express from 'express';
import {resolve, dirname} from 'path';
import {readFile, readdir} from 'fs';
import {fileURLToPath} from 'url';
import * as path from 'path';
import {Task} from './task.mjs';

const app = express();
// set hbs engine
app.set('view engine', 'hbs');


// TODO: use middleware to serve static files from public
// make sure to calculate the absolute path to the directory
// with import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(resolve(__dirname, 'public')));

// TODO: use middleware required for reading body
app.use(express.urlencoded({ extended: true }));

// PART 3
app.use((req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Query:", req.query);
  console.log("Body:", req.body);
  next();  
  // This moves the request to the next middleware (very important!)
});



// The global list to store all tasks to be rendered
let taskList = [];

// The reading path
const readingPath = path.resolve(__dirname, './saved-tasks');

// PART 4:
readdir(readingPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    readFile(resolve(readingPath, file), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', file, err);
        return;
      }

      try {
        const taskObj = JSON.parse(data);
        const task = new Task(taskObj);
        taskList.push(task);
      } catch (parseErr) {
        console.error('Error parsing JSON for file:', file, parseErr);
      }
    });
  });
});

/**
 * This function sort tasks by the give criteria "sort-by" and "sort-order"
 * @param {Request} req query should contain "sort-by" and "sort-order"
 * @param {[Task]} l the array of tasks to be sorted
 * @return {[Task]} sorted array of tasks by the given criteria
 */
function sortTasks(req, l) {
  if (req.query['sort-by'] && req.query['sort-order']) {
    const newL = [...l];
    const crit = req.query['sort-by'];
    const ord = req.query['sort-order'];
    newL.sort((a, b)=>{
      if (ord === 'asc') {
        switch (crit) {
          case 'due-date': {
            const a1 = new Date(a[crit]);
            const b1 = new Date(b[crit]);
            if (a1 === b1) { return 0; }
            return a1 > b1 ? 1 : -1;
          }
          case 'priority': {
            return a[crit] - b[crit];
          }
          default: {
            return 0;
          }
        }
      } else if (ord === 'desc') {
        switch (crit) {
          case 'due-date': {
            const a1 = new Date(a[crit]);
            const b1 = new Date(b[crit]);
            if (a1 === b1) { return 0; }
            return a1 < b1 ? 1 : -1;
          }
          case 'priority': {
            return b[crit] - a[crit];
          }
          default: {
            return 0;
          }
        }
      } else {
        return [];
      }
    });
    return newL;
  } else {
    return l;
  }
}

/**
 * This function sort tasks by whether they are pinned or not
 * @param {[Task]} l the array of tasks to be sorted
 * @return {[Task]} sorted array of tasks, with pinned tasks first
 */
function pinnedTasks(l) {
  return [...l].sort((a, b)=>b.pinned-a.pinned);
}


// PART 5
function filterTasks(req, tasks) {
  if (req.query.titleQ) {
      tasks = tasks.filter(task => task.title.includes(req.query.titleQ));
  }

  if (req.query.tagQ) {
      tasks = tasks.filter(task => task.hasTag(req.query.tagQ));
  }

  return tasks;
}

app.get('/', (req, res) => {
  const filteredTasks = filterTasks(req, taskList);
  const sortedTasks = sortTasks(req, filteredTasks);
  res.render('home', { tasks: sortedTasks });
});


// PART 6
// Render the add task page
app.get('/add', (req, res) => {
  res.render('add');
});

// Handle form submission to add a new task
app.post('/add', (req, res) => {
  const newTask = {
      title: req.body.title,
      description: req.body.description,
      priority: parseInt(req.body.priority, 10),
      'due-date': req.body['due-date'],
      pinned: req.body.pinned === 'true',
      tags: req.body.tags.split(', ').map(tag => tag.trim()),
      progress: req.body.progress
  };
  const taskObj = new Task(newTask);
  taskList = pinnedTasks([taskObj, ...taskList]);
  res.redirect('/');
});


// Pinn/Unpin function:
app.get('/pin/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (taskList[index]) {
      taskList[index].pinned = true;
      taskList = pinnedTasks(taskList);
      // Reorder tasks to move pinned task to the top
  }
  res.redirect('/');
});

app.get('/unpin/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (taskList[index]) {
      taskList[index].pinned = false;
      taskList = pinnedTasks(taskList);  
      // Reorder tasks after unpinning
  }
  res.redirect('/');
});



app.listen(3000);