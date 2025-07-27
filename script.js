// Have to make the basic CRUD Functions
let row_count = 0;
let task_box_count = 0;
let task_name = "";

const popup = document.getElementById("pop-up-name");
const pop_input = document.getElementById("pop-input");
const pop_button = document.getElementById("pop-button");
const rowContainer = document.getElementById("t_refer");

function empty_row(){
    if(row_count == 0) return true;
    else return false;
}

function full_row(){
    if(task_box_count == 3) return true;
    else return false
}

function create_row(){
    row_count++;
    task_box_count = 0;

    const newRow = document.createElement('div');
    newRow.className = `row-${row_count}`;
    newRow.id = `row-${row_count}`;

    rowContainer.appendChild(newRow);
}

function addList() {

  popup.classList.add("shown");

  pop_button.onclick = function () {

    const pop_input_content = pop_input.value.trim()

    if (pop_input_content == "") {
      popup.classList.remove("shown");
    } else {

      // verify if there's a row, if not then create one

      if (empty_row() || full_row()){
        create_row();
      }

      // Creation of the taskbox

      task_box_count++;

      const newTaskBox = document.createElement("div");
      newTaskBox.className = `task-box-${task_box_count}`;
      newTaskBox.innerHTML = `
            <p class="task-box-name">${pop_input_content}</p>
            <button class="AddTask" id="AddTask(this)">Add Task</button>
      `;

      document.getElementById(`row-${row_count}`).appendChild(newTaskBox);

      popup.classList.remove("shown");
      pop_input.value = "";
    }
  }
}