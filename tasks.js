const renderTasks = async (todoIdToShow) => {
    let todoListBody = document.querySelector(
        `.todo-list-body-${todoIdToShow}`
    );
    todoListBody.innerHTML = "";
    try {
        let tasks = await getTasks();
        let filteredTasks = tasks.filter((task) => task.todoId == todoIdToShow);
        let filteredUncompletedTasks = filteredTasks.filter(
            (task) => task.isCompleted === false
        );
        let filteredCompletedTasks = filteredTasks.filter(
            (task) => task.isCompleted === true
        );
        if (filteredUncompletedTasks.length > 0) {
            let uncompletedTasksP = document.createElement("p");
            uncompletedTasksP.className = "p-0 m-0 py-3";
            uncompletedTasksP.innerHTML = `Uncompleted Tasks (${filteredUncompletedTasks.length})`;
            todoListBody.appendChild(uncompletedTasksP);
            let taskUl = document.createElement("ul");
            taskUl.className = `p-0 list-group list-group-flush todo-list-body-${todoIdToShow}" style="min-height: 170px; max-height: 400px; overflow-y: auto;"`;
            filteredUncompletedTasks.forEach((task) => {
                let taskLi = document.createElement("li");
                taskLi.className =
                    "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
                taskLi.dataset.taskId = task.id;
                taskLi.dataset.todoId = todoIdToShow;
                taskLi.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center gap-2">
                        <button onclick="completeTask(${task.id}, ${todoIdToShow})" class="btn border-0 outline-0 p-0">
                            <i class="fa-regular fa-circle fs-6"></i>
                        </button>
                        <p class="p-0 m-0 task-name" contenteditable="false" onblur="debouncedEditTaskSave(event, ${task.id}, ${todoIdToShow}, this)" data-original-name="${task.name}">${task.name}</p>
                    </div>
                    <div class="dropdown">
                        <button class="btn task-dropdown-btn d-flex justify-content-center align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical fs-6"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li class="task-dropdown-menu px-2 py-1 d-flex align-items-center gap-2" onclick="enableTaskEditing(${task.id}, ${todoIdToShow})"><i class="fa-regular fa-pen-to-square fs-6"></i>Edit</li>
                            <li onclick="deleteTask(event, ${task.id}, ${todoIdToShow})" class="task-dropdown-menu px-2 py-1 d-flex align-items-center gap-2"><i class="fa-regular fa-trash-can fs-6"></i>Delete</li>
                        </ul>
                    </div>
                `;
                taskUl.appendChild(taskLi);
            });
            todoListBody.appendChild(taskUl);
        }
        if (filteredCompletedTasks.length > 0) {
            let completedTasksP = document.createElement("p");
            completedTasksP.className = "p-0 m-0 py-3";
            completedTasksP.innerHTML = `Completed Tasks (${filteredCompletedTasks.length})`;
            todoListBody.appendChild(completedTasksP);
            let taskUl = document.createElement("ul");
            taskUl.className = `p-0 list-group list-group-flush todo-list-body-${todoIdToShow}"`;
            filteredCompletedTasks.forEach((task) => {
                let taskLi = document.createElement("li");
                taskLi.className =
                    "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
                taskLi.dataset.taskId = task.id;
                taskLi.dataset.todoId = todoIdToShow;
                taskLi.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center gap-2">
                        <button class="btn border-0 outline-0 p-0">
                            <i class="fa-solid fa-circle-check fs-6"></i>
                        </button>
                        <p class="p-0 m-0 task-name text-decoration-line-through">${task.name}</p>
                    </div>
                    <div class="dropdown">
                        <button class="btn task-dropdown-btn d-flex justify-content-center align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical fs-6"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li class="task-dropdown-menu px-2 py-1 d-flex align-items-center gap-2" onclick="enableTaskEditing(${task.id}, ${todoIdToShow})"><i class="fa-regular fa-pen-to-square fs-6"></i>Edit</li>
                            <li onclick="deleteTask(event, ${task.id}, ${todoIdToShow})" class="task-dropdown-menu px-2 py-1 d-flex align-items-center gap-2"><i class="fa-regular fa-trash-can fs-6"></i>Delete</li>
                        </ul>
                    </div>
                `;
                taskUl.appendChild(taskLi);
            });
            todoListBody.appendChild(taskUl);
        }
    } catch (e) {
        console.error(e);
    }
};

const createTask = async (event, todoId) => {
    event.preventDefault();
    try {
        let text = document.querySelector(`#newTaskInput-${todoId}`);
        if (text.value.length == 0) {
            showAlert("Enter the task name...", "danger");
        } else {
            await axios.post(apiTasks, {
                name: text.value,
                isCompleted: false,
                todoId: todoId,
            });
            text.value = "";
            renderTasks(todoId);
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteTask = async (event, taskId, todoId) => {
    event.preventDefault();
    try {
        await axios.delete(`${apiTasks}/${taskId}`);
        renderTasks(todoId);
    } catch (error) {
        console.error(error);
    }
};

const editTaskSave = async (event, taskId, todoId, element) => {
    let newTaskName = element.innerText.trim();
    if (newTaskName.length === 0) {
        showAlert("Please enter a task name", "danger");
        element.innerText = element.dataset.originalName;
    } else {
        try {
            await axios.patch(`${apiTasks}/${taskId}`, { name: newTaskName });
            showAlert("Task updated successfully", "success");
            renderTasks(todoId);
        } catch (err) {
            console.error(err);
            showAlert("Error updating task", "danger");
            element.innerText = element.dataset.originalName;
        }
    }
};

const completeTask = async (taskId, todoIdToShow) => {
    try {
        let taskToComplete = await axios.get(`${apiTasks}/${taskId}`);
        let newStatus = !taskToComplete.data.isCompleted;
        await axios.patch(`${apiTasks}/${taskId}`, {
            isCompleted: newStatus,
        });
        renderTasks(todoIdToShow);
    } catch (err) {
        console.error(err);
    }
};

const debounce2 = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

const debouncedEditTaskSave = debounce2(editTaskSave, 300);

const enableTaskEditing = (taskId, todoId) => {
    let taskNameElement = document.querySelector(
        `li[data-task-id="${taskId}"] .task-name`
    );
    if (taskNameElement) {
        taskNameElement.contentEditable = true;
        taskNameElement.focus();
        taskNameElement.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                taskNameElement.blur();
            }
        });
        taskNameElement.addEventListener("blur", (event) => {
            debouncedEditTaskSave(event, taskId, todoId, taskNameElement);
        });
    }
};

