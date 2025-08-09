// Have to make the basic CRUD Functions
let row_count = 0;
let task_box_count = 0;
let task_box_cnt = 0;
let current_task_box_id = null;
let completedTaskBoxCreated = false;

const popup = document.getElementById("pop-up-name");
const pop_input = document.getElementById("pop-input");
const pop_button = document.getElementById("pop-button");
const rowContainer = document.getElementById("t_refer");
const overlay = document.getElementById("pop-up-overlay");

// Create the completed task list when the page loads
window.addEventListener('DOMContentLoaded', function() {
    createCompletedTaskList();
});

function showOverlay() {
    overlay.classList.add("shown");
    document.body.classList.add("blur-background");
}

function hideOverlay() {
    overlay.classList.remove("shown");
    document.body.classList.remove("blur-background");
}

function createCompletedTaskList() {
    if (completedTaskBoxCreated) return;
    
    if (empty_row() || full_row()) {
        create_row();
    }
    
    task_box_count++;
    task_box_cnt++;
    completedTaskBoxCreated = true;
    
    const completedTaskBox = document.createElement("div");
    completedTaskBox.className = `task-box-${task_box_cnt} completed-list`;
    completedTaskBox.classList.add("ref_taskbox");
    completedTaskBox.innerHTML = `
        <div class="task-box-header">
            <p class="task-box-name">✓ Completed Tasks</p>
        </div>
        <div class="task-pos" id="task-pos-${task_box_cnt}"></div>
    `;
    
    document.getElementById(`row-${row_count}`).appendChild(completedTaskBox);
    completedTaskBox.style.animation = 'taskBoxFadeIn 0.5s ease forwards';
}

function empty_row(){
    return row_count == 0;
}

function full_row(){
    return task_box_count == 3;
}

function create_row(){
    row_count++;
    task_box_count = 0;

    const newRow = document.createElement('div');
    newRow.className = `row-${row_count}`;
    newRow.classList.add("ref_row");
    newRow.id = `row-${row_count}`;

    rowContainer.appendChild(newRow);
}

function deleteTask(deleteButton){
    const to_delete = deleteButton.parentElement;
    to_delete.classList.add('deleting');
    
    setTimeout(() => {
        to_delete.remove();
    }, 400);
}

function deleteTaskBox(deleteButton){
    const taskBox = deleteButton.closest('.ref_taskbox');
    if (taskBox && !taskBox.classList.contains('completed-list')) {
        taskBox.classList.add('deleting');
        
        setTimeout(() => {
            taskBox.remove();
            task_box_count--;
            
            const currentRow = deleteButton.closest('.ref_row');
            if (currentRow && currentRow.children.length === 0) {
                currentRow.remove();
                row_count--;
                task_box_count = 0;
            }
        }, 500);
    } else if (taskBox && taskBox.classList.contains('completed-list')) {
        alert("Vous ne pouvez pas supprimer la liste des tâches complétées.");
    }
}

function moveTaskToCompleted(taskElement) {
    const completedTaskBox = document.querySelector('.completed-list .task-pos');
    if (completedTaskBox && taskElement) {
        taskElement.classList.add('completed');
        
        setTimeout(() => {
            const clonedTask = taskElement.cloneNode(true);
            clonedTask.classList.remove('completed');
            clonedTask.classList.add('completed');
            
            const checkbox = clonedTask.querySelector('.task-checkbox');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.disabled = true;
            }
            
            const editIcon = clonedTask.querySelector('.edit-task-icon');
            if (editIcon) {
                editIcon.remove();
            }
            
            clonedTask.style.animation = 'taskSlideIn 0.5s ease forwards';
            completedTaskBox.appendChild(clonedTask);
            
            taskElement.classList.add('deleting');
            setTimeout(() => {
                taskElement.remove();
            }, 400);
        }, 600);
    }
}

function editTaskName(editIcon) {
    const taskElement = editIcon.closest('.task');
    const taskNameElement = taskElement.querySelector('.task-name');
    const currentName = taskNameElement.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'edit-task-input';
    input.style.cssText = `
        border: 2px solid #98C8FF;
        border-radius: 8px;
        padding: 4px 8px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-size: 14px;
        flex: 1;
        background-color: white;
    `;
    
    taskNameElement.replaceWith(input);
    input.focus();
    input.select();
    
    function saveEdit() {
        const newName = input.value.trim();
        const newP = document.createElement('p');
        newP.className = 'task-name';
        newP.textContent = newName || currentName;
        input.replaceWith(newP);
    }
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
    
    input.addEventListener('blur', saveEdit);
}

function addList() {
    current_task_box_id = null;
    showOverlay();
    popup.classList.add("shown");
    pop_input.focus();
}

pop_button.addEventListener("click", function() {
    const pop_input_content = pop_input.value.trim();
    
    if (pop_input_content !== "") {
        if (empty_row() || full_row()) {
            create_row();
        }
        
        task_box_count++;
        task_box_cnt++;
        
        const newTaskBox = document.createElement("div");
        newTaskBox.className = `task-box-${task_box_cnt}`;
        newTaskBox.classList.add("ref_taskbox");
        newTaskBox.innerHTML = `
            <div class="task-box-header">
            <p class="task-box-name">${pop_input_content}</p>
            <div class="header-icons">
                <box-icon name='edit' class="edit-task" onclick="editTaskBoxName(this)"></box-icon>
                <box-icon name='x' class="delete-task" onclick="deleteTaskBox(this)"></box-icon>
            </div>
            </div>
            <div class="task-pos" id="task-pos-${task_box_cnt}"></div>
            <button class="AddTask" onclick="addTask(${task_box_cnt})"><span>Add Task</span></button>
        `;

        document.getElementById(`row-${row_count}`).appendChild(newTaskBox);
        newTaskBox.style.animation = 'taskBoxFadeIn 0.5s ease forwards';

        popup.classList.remove("shown");
        hideOverlay();
        pop_input.value = "";
    }
});

function editTaskBoxName(editIcon) {
    const taskBoxHeader = editIcon.closest('.task-box-header');
    const taskBoxNameElement = taskBoxHeader.querySelector('.task-box-name');
    const currentName = taskBoxNameElement.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'edit-taskbox-input';
    input.style.cssText = `
        border: 2px solid #98C8FF;
        border-radius: 8px;
        padding: 8px 12px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        font-size: 16px;
        background-color: white;
        width: 200px;
    `;
    
    taskBoxNameElement.replaceWith(input);
    input.focus();
    input.select();
    
    function saveEdit() {
        const newName = input.value.trim();
        const newP = document.createElement('p');
        newP.className = 'task-box-name';
        newP.textContent = newName || currentName;
        input.replaceWith(newP);
    }
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
    
    input.addEventListener('blur', saveEdit);
}

function addTask(task_box_id) {
    current_task_box_id = task_box_id;
    const taskPopup = document.getElementById("pop-up-task-name");
    const taskInput = document.getElementById("pop-task-input");
    
    showOverlay();
    taskPopup.classList.add("shown");
    taskInput.focus();
}

const taskPopup = document.getElementById("pop-up-task-name");
const taskInput = document.getElementById("pop-task-input");
const taskButton = document.getElementById("pop-task-button");

taskButton.addEventListener("click", function() {
    const task_input_content = taskInput.value.trim();
    
    if (task_input_content !== "" && current_task_box_id !== null) {
        const newTask = document.createElement("div");
        newTask.classList.add("task");
        newTask.innerHTML = `
            <input type="checkbox" class="task-checkbox" onchange="handleTaskComplete(this)">
            <p class="task-name">${task_input_content}</p>
            <box-icon name='edit' class="edit-task-icon" onclick="editTaskName(this)"></box-icon>
            <box-icon name='x' class="delete-task" onclick="deleteTask(this)"></box-icon>
        `;

        const targetTaskBox = document.getElementById(`task-pos-${current_task_box_id}`);
        targetTaskBox.appendChild(newTask);
        newTask.style.animation = 'taskSlideIn 0.5s ease forwards';

        taskPopup.classList.remove("shown");
        hideOverlay();
        taskInput.value = "";
    }
});

function handleTaskComplete(checkbox) {
    const taskElement = checkbox.closest('.task');
    if (checkbox.checked) {
        moveTaskToCompleted(taskElement);
    }
}

// Close popups when clicking overlay
overlay.addEventListener('click', function() {
    popup.classList.remove("shown");
    taskPopup.classList.remove("shown");
    hideOverlay();
});

// Close popups with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        popup.classList.remove("shown");
        taskPopup.classList.remove("shown");
        hideOverlay();
    }
});