document.getElementById("addTask").addEventListener('click', appendTask);
document.getElementById("taskList").addEventListener('click', handleTaskClick);
document.addEventListener('DOMContentLoaded', loadTasks);

function appendTask(e) {
    e.preventDefault();

    let taskTitleInput = document.getElementById("taskTitle").value;
    let taskDesInput = document.getElementById("taskDescription").value;
    let taskPriority = document.getElementById("taskPriority").value;

    if (!taskTitleInput.trim() || !taskDesInput.trim() || !taskPriority.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill out all fields!',
            confirmButtonColor: '#ff5733',
        });
        return;
    }

    let task = {
        id: Math.floor(Math.random() * 1000),
        title: taskTitleInput,
        description: taskDesInput,
        priority: taskPriority,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    addTaskToDOM(task);

    document.getElementById("taskTitle").value = '';
    document.getElementById("taskDescription").value = '';
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

    let taskID = document.createElement('h4');
    let taskT = document.createElement('h2');
    let taskD = document.createElement('h5');
    let taskP = document.createElement('h4');

    taskID.textContent = "ID: " + task.id;
    taskT.textContent = "Title: " + task.title;
    taskD.textContent = "Description: " + task.description;
    taskP.textContent = "Priority: " + task.priority;

    let buttons = document.createElement('div');
    buttons.className = "taskButtons";

    let cmplBtn = document.createElement('div');
    cmplBtn.className = "complete-btn";
    cmplBtn.textContent = task.completed ? 'Completed' : 'Complete';

    let editBtn = document.createElement('div');
    editBtn.className = "edit-btn";
    editBtn.textContent = "Update";

    let delBtn = document.createElement('div');
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";

    buttons.appendChild(cmplBtn);
    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);

    newTask.appendChild(taskID);
    newTask.appendChild(taskT);
    newTask.appendChild(taskD);
    newTask.appendChild(taskP);
    newTask.appendChild(buttons);

    if (task.completed) {
        newTask.classList.add('completed');
    }

    taskList.appendChild(newTask);
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(addTaskToDOM);
}

function handleTaskClick(e) {
    e.preventDefault();
    if (e.target.classList.contains('delete-btn')) {
        removeTask(e);
    } else if (e.target.classList.contains('edit-btn')) {
        updateTask(e);
    } else if (e.target.classList.contains('complete-btn')) {
        toggleComplete(e);
    }
}

function removeTask(e) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let taskElement = e.target.closest('.task');
            let taskId = taskElement.getAttribute('data-id');

            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks = tasks.filter(task => task.id !== Number(taskId));
            localStorage.setItem("tasks", JSON.stringify(tasks));

            taskElement.remove();

            Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
    });
}

function updateTask(e) {
    let taskElement = e.target.closest('.task');
    let taskId = taskElement.getAttribute('data-id');

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(task => task.id === Number(taskId));

    if (!task) return;

    Swal.fire({
        title: "Update Task",
        html: `
            <input id="swal-task-id" class="swal2-input" type="number" value="${task.id}" disabled>
            <input id="swal-task-title" class="swal2-input" type="text" value="${task.title}" placeholder="Task Title">
            <textarea id="swal-task-desc" class="swal2-textarea" placeholder="Task Description">${task.description}</textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        preConfirm: () => {
            return {
                id: Number(document.getElementById("swal-task-id").value),
                title: document.getElementById("swal-task-title").value.trim(),
                description: document.getElementById("swal-task-desc").value.trim(),
                priority: task.priority
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

            taskElement.querySelector('h2').textContent = "Title: " + updatedTask.title;
            taskElement.querySelector('h5').textContent = "Description: " + updatedTask.description;

            Swal.fire("Updated!", "Your task has been updated.", "success");
        }
    });
}

function toggleComplete(e) {
    let taskElement = e.target.closest('.task');
    let taskId = taskElement.getAttribute('data-id');

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(task => task.id === Number(taskId));

    if (!task) return;

    task.completed = !task.completed;

    let taskIndex = tasks.findIndex(t => t.id === task.id);
    tasks[taskIndex] = task;
    localStorage.setItem("tasks", JSON.stringify(tasks));


    if (task.completed) {
        taskElement.classList.add('completed');
        e.target.textContent = 'Completed';
    } else {
        taskElement.classList.remove('completed');
        e.target.textContent = 'Complete';
    }
}

