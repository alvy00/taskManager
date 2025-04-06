document.getElementById("addTask").addEventListener('click', appendTask);
document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById("updateTask").addEventListener('click', promptForTaskId('update'));
document.getElementById("deleteTask").addEventListener('click', promptForTaskId('delete'));
document.getElementById("toggleTask").addEventListener('click', promptForTaskId('toggle'));
document.getElementById("priorityFilter").addEventListener('change', filterTasksByPriority);
document.getElementById("sortTasksBtn").addEventListener('click', sortTasksByDueDate);
document.getElementById("taskSearch").addEventListener('input', searchTasks);

function appendTask(e) {
    e.preventDefault();

    let taskTitleInput = document.getElementById("taskTitle").value;
    let taskDesInput = document.getElementById("taskDescription").value;
    let taskPriority = document.getElementById("taskPriority").value;
    let taskDueDate = document.getElementById("taskDueDate").value;

    if (!taskTitleInput.trim() || !taskDesInput.trim() || !taskPriority.trim() || !taskDueDate.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill out all fields!',
            confirmButtonColor: '#ff5733',
        });
        return;
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => Number(t.id) || 0)) + 1 : 1;
    let task = {
        id: newId,
        title: taskTitleInput,
        description: taskDesInput,
        priority: taskPriority,
        completed: false,
        dueDate: taskDueDate
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    addTaskToDOM(task);

    document.getElementById("taskTitle").value = '';
    document.getElementById("taskDescription").value = '';
    document.getElementById("taskDueDate").value = '';
}

function addTaskToDOM(task) {
    let taskList = document.querySelector('.taskList');
    if (!taskList) {
        console.error("Task list container not found!");
        return;
    }

    let newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.setAttribute('data-id', task.id);

    let taskID = document.createElement('h5');
    let taskT = document.createElement('h3');
    let taskD = document.createElement('h5');
    let taskP = document.createElement('h5');
    let taskDueDate = document.createElement('h5');

    taskID.textContent = "ID: " + task.id;
    taskT.textContent = "Title: " + task.title;
    taskD.textContent = "Description: " + task.description;
    taskP.textContent = "Priority: " + task.priority;
    taskDueDate.innerHTML = `Due: <br>${task.dueDate}`;

    newTask.appendChild(taskID);
    newTask.appendChild(taskT);
    newTask.appendChild(taskD);
    newTask.appendChild(taskP);
    newTask.appendChild(taskDueDate);

    if (task.completed) {
        newTask.classList.add('completed');
    }

    taskList.appendChild(newTask);
}

function loadTasks() {
    let taskList = document.querySelector('.taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(addTaskToDOM);
}

function promptForTaskId(action) {
    return function () {
        Swal.fire({
            title: `Enter Task ID to ${action}`,
            input: 'number',
            inputPlaceholder: 'Task ID',
            showCancelButton: true,
            confirmButtonText: `Confirm ${action}`,
            preConfirm: (id) => {
                if (!id) {
                    Swal.showValidationMessage('Please enter a valid Task ID');
                    return;
                }
                return id;
            }
        }).then(result => {
            if (result.isConfirmed) {
                const taskId = result.value;
                if (action === 'update') {
                    updateTaskById(taskId);
                } else if (action === 'delete') {
                    deleteTaskById(taskId);
                } else if (action === 'toggle') {
                    toggleCompleteById(taskId);
                }
            }
        });
    }
}

function deleteTaskById(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(task => task.id === Number(taskId));

    if (!task) {
        Swal.fire({
            icon: 'error',
            title: 'Task not found',
            text: `No task found with ID: ${taskId}`,
        });
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = tasks.filter(task => task.id !== Number(taskId));
            localStorage.setItem("tasks", JSON.stringify(tasks));

            loadTasks();

            Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
    });
}

function updateTaskById(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(task => task.id === Number(taskId));

    if (!task) {
        Swal.fire({
            icon: 'error',
            title: 'Task not found',
            text: `No task found with ID: ${taskId}`,
        });
        return;
    }

    Swal.fire({
        title: "Update Task",
        html: `
            <input id="swal-task-id" class="swal2-input" type="number" value="${task.id}" disabled>
            <input id="swal-task-title" class="swal2-input" type="text" value="${task.title}" placeholder="Task Title">
            <textarea id="swal-task-desc" class="swal2-textarea" placeholder="Task Description">${task.description}</textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Save",
        preConfirm: () => {
            return {
                id: Number(document.getElementById("swal-task-id").value),
                title: document.getElementById("swal-task-title").value.trim(),
                description: document.getElementById("swal-task-desc").value.trim(),
                priority: task.priority,
                completed: task.completed,
                dueDate: task.dueDate
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let updatedTask = result.value;

            if (!updatedTask.title || !updatedTask.description) {
                Swal.fire("Error", "Title and Description cannot be empty!", "error");
                return;
            }

            let taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
            tasks[taskIndex] = updatedTask;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            loadTasks();

            Swal.fire("Updated!", "Your task has been updated.", "success");
        }
    });
}

function toggleCompleteById(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(task => task.id === Number(taskId));

    if (!task) {
        Swal.fire({
            icon: 'error',
            title: 'Task not found',
            text: `No task found with ID: ${taskId}`,
        });
        return;
    }

    task.completed = !task.completed;

    let taskIndex = tasks.findIndex(t => t.id === task.id);
    tasks[taskIndex] = task;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    loadTasks();

    Swal.fire("Updated!", "Your task's completion status has been toggled.", "success");
}

function filterTasksByPriority() {
    const priorityFilter = document.getElementById("priorityFilter").value;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let filteredTasks = tasks.filter(task => {
        return priorityFilter === "ALL" || task.priority === priorityFilter;
    });

    let taskList = document.querySelector('.taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(addTaskToDOM);
}

function sortTasksByDueDate() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    let taskList = document.querySelector('.taskList');
    taskList.innerHTML = '';
    tasks.forEach(addTaskToDOM);
}

function searchTasks() {
    const searchQuery = document.getElementById("taskSearch").value.toLowerCase();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
    });

    let taskList = document.querySelector('.taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(addTaskToDOM);
}
