document.getElementById("addTask").addEventListener('click', appendTask);
document.getElementById("taskList").addEventListener('click', removeTask);
document.addEventListener('DOMContentLoaded', loadTasks);


function appendTask(e){
    e.preventDefault();

    let taskTitleInput = document.getElementById("taskTitle").value;
    let taskDesInput = document.getElementById("taskDescription").value;
    let taskPriority = document.getElementById("taskPriority").value;
    if (!taskTitleInput) {
        alert("Please fill out all fields.");
        return;
    }

    let task = {
        id: Math.floor(Math.random() * 1000),
        title: taskTitleInput,
        description: taskDesInput,
        priority: taskPriority
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    addTaskToDOM(task);

    document.getElementById("taskTitle").value = '';
    document.getElementById("taskDescription").value = '';
}

function addTaskToDOM(task) {
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
    cmplBtn.textContent = 'Complete';

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

    let taskList = document.querySelector('.taskList');
    taskList.appendChild(newTask);
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(addTaskToDOM);
}

function removeTask(e) {
    e.preventDefault();
    if (e.target.classList.contains('delete-btn')) {
        if (confirm("Do you want to delete this task?")) {
            let taskElement = e.target.closest('.task');
            let taskId = taskElement.getAttribute('data-id');

            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks = tasks.filter(task => task.id != taskId);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            taskElement.remove();
        }
    }
}

