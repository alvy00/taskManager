// let newDiv = document.createElement('div');
// newDiv.className = 'ranClass';

// let nDText = document.createTextNode('This is a new text');
// newDiv.appendChild(nDText);


// let container = document.querySelector('.container');
// let form = document.querySelector('#taskForm');
// let h1 = document.querySelector('.container h1');
// let taskP = document.querySelector('#taskPriority');
// let option3 = document.querySelector('option[value="high"]');

// form.insertBefore(newDiv, taskP);


// let newTask = document.createElement('div');
// newTask.className = 'task';

// let taskT = document.createElement('h3');
// taskT.id = taskT;
// let taskID = document.createElement('p');
// taskID.id = taskID;
// let taskD = document.createElement('p');
// taskD.id = taskD;
// let taskP = document.createElement('p');
// taskP.id = taskP;

// taskT.textContent = 'Task Title';
// taskID.textContent = 'ID';
// taskD.textContent = 'Task Description';
// taskP.textContent = 'High';


// let buttons = document.createElement('div');
// buttons.className = "taskButtons";

// let cmplBtn = document.createElement('button');
// cmplBtn.className = "complete-btn";
// cmplBtn.textContent = 'Complete';
// let editBtn = document.createElement('button');
// editBtn.className = "edit-btn";
// editBtn.textContent = "Edit";
// let delBtn = document.createElement('button');
// delBtn.className = "delete-btn";
// delBtn.textContent = "Delete";
// buttons.append(cmplBtn);
// buttons.append(editBtn);
// buttons.append(delBtn);


// newTask.appendChild(taskT);
// newTask.appendChild(taskID);
// newTask.appendChild(taskD);
// newTask.appendChild(taskP);
// newTask.appendChild(buttons);

// const taskList = document.querySelector('.taskList');
// taskList.appendChild(newTask);

//let taskInput = document.getElementById("taskTitle").value;
let addTaskBtn = document.getElementById("addTask").addEventListener('click', appendTask);
let list = document.getElementById("taskList").addEventListener('click', removeTask);



function appendTask(e){
    e.preventDefault();

    let taskTitleInput = document.getElementById("taskTitle").value;
    let taskDesInput = document.getElementById("taskDescription").value;
    let taskPriority = document.getElementById("taskPriority").value;

    let newTask = document.createElement('div');
    newTask.className = 'task';

    let taskT = document.createElement('h3');
    taskT.id = taskT;
    let taskID = document.createElement('h4');
    taskID.id = taskID;
    let taskD = document.createElement('h5');
    taskD.id = taskD;
    let taskP = document.createElement('h4');
    taskP.id = taskP;


    taskT.append(document.createTextNode(taskTitleInput));
    taskID.append(Math.floor(Math.random() * 1000).toString());
    taskD.append(document.createTextNode(taskDesInput));
    taskP.append(document.createTextNode(taskPriority));


    let buttons = document.createElement('div');
    buttons.className = "taskButtons";

    let cmplBtn = document.createElement('button');
    cmplBtn.className = "complete-btn";
    cmplBtn.id = "complete-btn";
    cmplBtn.textContent = 'Complete';
    let editBtn = document.createElement('button');
    editBtn.className = "edit-btn";
    editBtn.id = "edit-btn";
    editBtn.textContent = "Update";
    let delBtn = document.createElement('button');
    delBtn.className = "delete-btn";
    delBtn.id = "delete-btn";
    delBtn.textContent = "Delete";
    buttons.append(cmplBtn);
    buttons.append(editBtn);
    buttons.append(delBtn);


    newTask.appendChild(taskT);
    newTask.appendChild(taskID);
    newTask.appendChild(taskD);
    newTask.appendChild(taskP);
    newTask.appendChild(buttons);

    let taskList = document.querySelector('.taskList');
    taskList.appendChild(newTask);
}
function removeTask(e){
    e.preventDefault();
    if(e.target.classList.contains('delete-btn')){
        if(confirm("Do you want to delete this task?")){
            let t = e.target.parentElement.parentElement;
            t.remove();
        }
    }
}
