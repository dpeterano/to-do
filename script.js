// Have to make the basic CRUD Functions
let row_count = 0;
let task_box_count = 0;
let task_box_cnt = 0;
let current_task_box_id = null;

const popup = document.getElementById("pop-up-name");
const pop_input = document.getElementById("pop-input");
const pop_button = document.getElementById("pop-button");
const rowContainer = document.getElementById("t_refer");

function empty_row() {
  if (row_count == 0) return true;
  else return false;
}

function full_row() {
  if (task_box_count == 3) return true;
  else return false;
}

function create_row() {
  row_count++;
  task_box_count = 0;

  const newRow = document.createElement("div");
  newRow.className = `row-${row_count}`;
  newRow.classList.add("ref_row");
  newRow.id = `row-${row_count}`;

  rowContainer.appendChild(newRow);
}

function deleteTask(deleteButton) {
  const to_delete = deleteButton.parentElement;
  to_delete.remove();
}

function addList() {
  popup.classList.add("shown");
  pop_input.focus();

  pop_button.onclick = function () {
    const pop_input_content = pop_input.value.trim();

    if (pop_input_content == "") {
      popup.classList.remove("shown");
    } else {
      // verify if there's a row, if not then create one

      if (empty_row() || full_row()) {
        create_row();
      }

      // Creation of the taskbox

      task_box_count++;
      task_box_cnt++;

      const newTaskBox = document.createElement("div");
      newTaskBox.className = `task-box-${task_box_cnt}`;
      newTaskBox.classList.add("ref_taskbox");
      newTaskBox.innerHTML = `
            <p class="task-box-name">${pop_input_content}</p>
            <div class="task-pos" id="task-pos-${task_box_cnt}"></div>
            <button class="AddTask" onclick="addTask(${task_box_cnt})">Add Task</button>
      `;

      document.getElementById(`row-${row_count}`).appendChild(newTaskBox);

      popup.classList.remove("shown");
      pop_input.value = "";
    }
  };
}

// Now The Task Creating Process

const taskPopup = document.getElementById("pop-up-task-name");
const taskInput = document.getElementById("pop-task-input");
const taskButton = document.getElementById("pop-task-button");

function addTask(taskBoxId) {
  current_task_box_id = taskBoxId;
  taskPopup.classList.add("shown");
  taskInput.focus();

  taskButton.onclick = function () {
    const taskContent = taskInput.value.trim();

    if (taskContent == "") {
      taskPopup.classList.remove("shown");
    } else {
      // create task

      const newTask = document.createElement("div");
      newTask.className = "task";
      newTask.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <p class="task-name">${taskContent}</p>
        <box-icon name='x' class="delete-task" onclick="deleteTask(this)"></box-icon>
      `;

      const targetTaskBox = document.getElementById(
        `task-pos-${current_task_box_id}`
      );
      targetTaskBox.appendChild(newTask);

      taskPopup.classList.remove("shown");
      taskInput.value = "";
    }
  };
}
