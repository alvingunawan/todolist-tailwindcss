const profileInput = document.getElementById("profileInput");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const doneList = document.getElementById("doneList");

loadTasks();

function addTask() {
  const name = profileInput.value.trim();
  const task = taskInput.value.trim();
  const priority = prioritySelect.value;
  const deadline = document.getElementById("dateInput").value;
  const date = new Date().toLocaleString();

  if (name && task && priority && deadline) {
    createTaskElement(name, date, task, priority, deadline, "todo");
    profileInput.value = "";
    taskInput.value = "";
    prioritySelect.value = "";
    document.getElementById("dateInput").value = "";
    saveTasks();
  } else {
    alert("Please enter all fields!");
  }
}

addButton.addEventListener("click", addTask);

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

function createTaskElement(name, date, task, priority, deadline, statusData = "todo") {
  const trItem = document.createElement("tr");

  if (statusData === "done") {
    trItem.classList.add("done");
  }

  const tdName = document.createElement("td");
  tdName.className = "taskName border border-gray-400 px-4 py-2";
  tdName.textContent = name;

  const tdDate = document.createElement("td");
  tdDate.className = "taskDate border border-gray-400 px-4 py-2";
  tdDate.textContent = date;

  const tdTodo = document.createElement("td");
  tdTodo.className = "taskDesc border border-gray-400 px-4 py-2";
  tdTodo.textContent = task;

  const tdPriority = document.createElement("td");
  tdPriority.className = "taskPriority border border-gray-400 px-4 py-2";
  tdPriority.textContent = priority;

  const tdDeadline = document.createElement("td");
  tdDeadline.className = "taskDeadline border border-gray-400 px-4 py-2";
  tdDeadline.textContent = deadline;

  const tdStatus = document.createElement("td");
  tdStatus.className = "taskStatus border border-gray-400 px-4 py-2";
  tdStatus.textContent = statusData === "done" ? "On Target" : "On Progress";

  const tdAction = document.createElement("td");
  tdAction.className = "taskAction border border-gray-400 px-2 py-10 w-auto gap-4 flex flex-col items-center justify-center min-h-[50px]";

  const checkButton = document.createElement("button");
  checkButton.className = "taskCheck rounded-md hover:cursor-pointer";
  checkButton.textContent = "✅";
  checkButton.addEventListener("click", function (e) {
    const trItem = e.target.closest("tr");

    trItem.classList.add("done");
    trItem.querySelector(".taskDesc").classList.add("line-through");
    taskList.removeChild(trItem);
    doneList.appendChild(trItem);
    e.target.remove();

    // Update kolom status pas udah di checklist
    const taskDeadline = trItem.querySelector(".taskDeadline").textContent;
    const taskStatus = trItem.querySelector(".taskStatus");

    const currentDate = new Date();
    const deadlineDate = new Date(taskDeadline);
    if (deadlineDate < currentDate) {
      taskStatus.textContent = "Overdue"; // Jika deadline sudah lewat
    } else {
      taskStatus.textContent = "On Target"; // Jika masih sesuai deadline
    }

    saveTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "taskDelete rounded-md hover:cursor-pointer";
  deleteButton.textContent = "❌";
  deleteButton.addEventListener("click", function () {
    const confirmDeleteRow = confirm("Yakin ingin menghapus tugas ini?");
    if (confirmDeleteRow) {
      if (trItem.classList.contains("done")) {
        doneList.removeChild(trItem);
      } else {
        taskList.removeChild(trItem);
      }
      saveTasks();
    }
  });

  tdAction.appendChild(checkButton);
  tdAction.appendChild(deleteButton);

  trItem.appendChild(tdName);
  trItem.appendChild(tdDate);
  trItem.appendChild(tdTodo);
  trItem.appendChild(tdPriority);
  trItem.appendChild(tdDeadline);
  trItem.appendChild(tdStatus);
  trItem.appendChild(tdAction);

  if (statusData === "todo") {
    taskList.appendChild(trItem);
  } else {
    doneList.appendChild(trItem);
  }
}

function saveTasks() {
  let tasks = [];

  taskList.querySelectorAll("tr").forEach(function (item) {
    const name = item.querySelector(".taskName")?.textContent.trim() || "";
    const date = item.querySelector(".taskDate")?.textContent.trim() || "";
    const task = item.querySelector(".taskDesc")?.textContent.trim() || "";
    const priority = item.querySelector(".taskPriority")?.textContent.trim() || "";
    const deadline = item.querySelector(".taskDeadline")?.textContent.trim() || "";
    const status = item.querySelector(".taskStatus")?.textContent.trim() || "";

    tasks.push({ name, date, task, priority, deadline, status, statusData: "todo" });
  });

  doneList.querySelectorAll("tr").forEach(function (item) {
    const name = item.querySelector(".taskName")?.textContent.trim() || "";
    const date = item.querySelector(".taskDate")?.textContent.trim() || "";
    const task = item.querySelector(".taskDesc")?.textContent.trim() || "";
    const priority = item.querySelector(".taskPriority")?.textContent.trim() || "";
    const deadline = item.querySelector(".taskDeadline")?.textContent.trim() || "";
    const status = item.querySelector(".taskStatus")?.textContent.trim() || "";
    tasks.push({ name, date, task, priority, deadline, status, statusData: "done" });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ name, date, task, priority, deadline, status, statusData }) => {
    createTaskElement(name, date, task, priority, deadline, statusData);
  });
}

// Tab Behaviour
const todoTabBtn = document.getElementById("todoTabBtn");
const doneTabBtn = document.getElementById("doneTabBtn");

const todoTab = document.getElementById("todoTab");
const doneTab = document.getElementById("doneTab");

todoTabBtn.addEventListener("click", () => {
  todoTab.classList.remove("hidden");
  doneTab.classList.add("hidden");
  todoTabBtn.classList.add("bg-blue-700");
  todoTabBtn.classList.remove("bg-gray-600");
  doneTabBtn.classList.add("bg-gray-600");
  doneTabBtn.classList.remove("bg-blue-700");
});

doneTabBtn.addEventListener("click", () => {
  doneTab.classList.remove("hidden");
  todoTab.classList.add("hidden");
  doneTabBtn.classList.add("bg-blue-700");
  doneTabBtn.classList.remove("bg-gray-600");
  todoTabBtn.classList.add("bg-gray-600");
  todoTabBtn.classList.remove("bg-blue-700");
});

// Tombol Delete Semua
document.getElementById("DeleteTabBtn").addEventListener("click", () => {
  const confirmed = confirm("Apakah kamu yakin ingin menghapus semua task?");
  if (confirmed) {
    taskList.innerHTML = "";
    doneList.innerHTML = "";
    saveTasks();
  }
});
