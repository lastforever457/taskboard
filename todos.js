const renderTodos = async (boardId) => {
    try {
        const pages = document.querySelector("#pages");
        pages.classList.add("px-5");
        const boardsDiv = document.createElement("div");
        boardsDiv.id = "boards";
        boardsDiv.className = "d-flex gap-3 pt-2";
        pages.innerHTML = "";
        boardsDiv.innerHTML = "";
        let boards = await getBoards();
        let todos = await getTodos();
        let todosToShow = todos.filter((todo) => todo.boardId === boardId);
        if (boardId) {
            let boardToShow = boards.find((board) => board.id === boardId);
            pages.style.backgroundImage = boardToShow.boardBg
                ? `url(${boardToShow.boardBg})`
                : "";
            let boardTitle = document.createElement("div");
            boardTitle.className =
                "board-title d-flex justify-content-between align-items-center";
            boardTitle.innerHTML = `
            <h5 class="p-0 m-0">${boardToShow.name}</h5>
            <div class="dropdown">
                <button class="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu">
                    <li data-bs-toggle="modal" data-bs-target="#setBackgroundModal" class="dropdown-item d-flex align-items-center gap-2 ps-3 pe-2"><i class="fa-regular fa-image"></i>Set background</li>
                </ul>
            </div>
            <div class="modal fade" id="setBackgroundModal" tabindex="-1" aria-labelledby="setBackgroundModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="setBackgroundModalLabel">Set background</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body set-bg-modal-body">
                            <div class="row"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveChanges(${boardId})">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
            pages.appendChild(boardTitle);
            pages.appendChild(boardsDiv);

            const renderImagesList = async () => {
                let setBgModalBody = document.querySelector(
                    ".set-bg-modal-body > .row"
                );
                let images = await axios.get(
                    "https://picsum.photos/v2/list?page=2&limit=100"
                );
                images.data.forEach((image) => {
                    let imgWrapper = document.createElement("div");
                    imgWrapper.className = "col-lg-4 col-md-6 col-sm-12 my-2";
                    imgWrapper.innerHTML = `
                    <img onclick="chooseImage(${image.id})" class="w-100 setBgVariant setBgVariant-${image.id}" src="${image.download_url}" alt="${image.author}"/>
                `;
                    setBgModalBody.appendChild(imgWrapper);
                });
            };
            renderImagesList();
            let boardBody = document.createElement("div");
            boardBody.className = "container";
            if (todosToShow.length > 0) {
                todosToShow.forEach((todo) => {
                    let todoBody = document.createElement("div");
                    todoBody.style.borderLeft = `${
                        todo.borderColor == ""
                            ? "1px solid black"
                            : `15px solid ${todo.borderColor}`
                    }`;
                    todoBody.className = "todoBody shadow-sm rounded";
                    todoBody.innerHTML = `
                    <div class="todo-header d-flex justify-content-between align-items-center">
                        <h4 class="p-0 m-0" contenteditable="true" onblur="debouncedEditTodoSave(event, ${
                            todo.id
                        }, ${boardId}, this)" data-original-name="${
                        todo.name
                    }">${todo.name}</h4>
                        <div class="dropdown">
                            <button class="btn outline-0 border-0 todo-actions-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="duplicateTodo(event, ${
                                    todo.id
                                }, ${boardId})"><i class="fs-6 fa-regular fa-copy"></i>Duplicate list</a></li>
                                <li><a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="openColorModal(${
                                    todo.id
                                }, ${boardId})"><i class="fs-6 fa-solid fa-brush"></i>Set color</a></li>
                                <li><a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="deleteTodo(event, ${
                                    todo.id
                                }, ${boardId})"><i class="fs-6 fa-regular fa-trash-can"></i>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr/>
                    <div class="input-group mb-3">
                        <input aria-describedby="newTaskInput-${
                            todo.id
                        }" type="text" class="form-control" placeholder="Enter new task name" id="newTaskInput-${
                        todo.id
                    }"/>
                        <button ${
                            todo.borderColor != ""
                                ? `style="background-color: ${todo.borderColor}"`
                                : ""
                        } class="btn ${
                        todo.borderColor == "" ? "btn-primary" : ""
                    }" onclick="createTask(event, ${
                        todo.id
                    }, ${boardId})">Add</button>
                    </div>
                    <div class="p-0 list-group list-group-flush todo-list-body todo-list-body-${
                        todo.id
                    }"></div>
                `;
                    boardsDiv.appendChild(todoBody);
                    renderTasks(todo.id);
                });
            }
            let todoAddBody = document.createElement("div");
            todoAddBody.className =
                "todoAddBody input-group shadow-sm d-flex justify-content-between align-items-baseline rounded";
            todoAddBody.innerHTML = `
            <input type="text" class="form-control createTodoInput" placeholder="Add todo"/>
            <button class="btn btn-outline-dark">
                <i class="fas fa-plus" onclick="createTodo(${boardId})"></i>
            </button>
        `;
            boardsDiv.appendChild(todoAddBody);
        } else {
            pages.classList.remove("px-5");
            pages.innerHTML = `
                <div class="start-page"></div>
            `;
        }
    } catch (err) {
        console.error(err);
    }
};

const chooseImage = (id) => {
    let previouslySelected = document.querySelector(".setBgVariant.selected");
    if (previouslySelected) {
        previouslySelected.classList.remove("selected");
        previouslySelected.style.border = "";
    }
    let selectedImage = document.querySelector(`.setBgVariant-${id}`);
    selectedImage.classList.add("selected");
    selectedImage.style.border = "2px solid black";
    document.querySelector("#setBackgroundModal").dataset.selectedImageId = id;
};

const createTodo = async (boardId) => {
    let newTodoName = document.querySelector(".createTodoInput").value;
    if (newTodoName.trim().length === 0) {
        showAlert("Please enter todo name", "danger");
    } else {
        try {
            await axios.post(apiTodos, {
                name: newTodoName,
                boardId: boardId,
                borderColor: "",
            });
            showAlert("Todo created successfully", "success");
            renderTodos(boardId);
        } catch (err) {
            console.error(err);
            showAlert("Error creating todo", "danger");
        }
    }
};

const deleteTodo = async (event, todoId, boardId) => {
    event.preventDefault();
    try {
        let tasksToDelete = await axios.get(`${apiTasks}?todoId=${todoId}`);
        for (const task of tasksToDelete.data) {
            await axios.delete(`${apiTasks}/${task.id}`);
        }
        await axios.delete(`${apiTodos}/${todoId}`);
        renderTodos(boardId);
    } catch (error) {
        console.error(error);
    }
};

const editTodoSave = async (event, todoId, boardId, element) => {
    let newTodoName = element.innerText.trim();
    if (newTodoName.length === 0) {
        showAlert("Please enter todo name", "danger");
        element.innerText = element.dataset.originalName;
    } else {
        try {
            await axios.patch(`${apiTodos}/${todoId}`, { name: newTodoName });
            showAlert("Todo updated successfully", "success");
            renderTodos(boardId);
        } catch (err) {
            console.error(err);
            showAlert("Error updating todo", "danger");
            element.innerText = element.dataset.originalName;
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};
const debouncedEditTodoSave = debounce(editTodoSave, 300);

const openColorModal = (todoId, boardId) => {
    let modalColor = document.createElement("div");
    modalColor.className = "modal fade";
    modalColor.id = "colorModal";
    modalColor.setAttribute("tabindex", "-1");
    modalColor.setAttribute("aria-labelledby", "colorModalLabel");
    modalColor.setAttribute("aria-hidden", "true");
    modalColor.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="colorModalLabel">Set Color</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="color" id="colorInput" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="setColor(${todoId}, ${boardId})">Save changes</button>
                    </div>
                </div>
            </div>
    `;
    document.body.appendChild(modalColor);
    let colorModalElement = document.getElementById("colorModal");
    let colorModal = new bootstrap.Modal(colorModalElement, {});
    colorModal.show();
};

const toggleView = () => {
    let icon = document.querySelector(".toggle-icon");
    let boards = document.querySelector("#boards");
    let todoBody = document.querySelectorAll(".todoBody");
    if (icon.classList.contains("fa-grip-vertical")) {
        icon.classList.add("fa-grip");
        icon.classList.remove("fa-grip-vertical");
        boards.classList.add(
            "flex-column",
            "align-items-center",
            "scroll-hidden"
        );
        todoBody.forEach((body) => {
            body.style.width = "300px";
        });
    } else {
        // Change to horizontal view
        icon.classList.add("fa-grip-vertical");
        icon.classList.remove("fa-grip");
        boards.classList.remove(
            "flex-column",
            "align-items-center",
            "scroll-hidden"
        );
        todoBody.forEach((body) => {
            body.style.width = "";
        });
    }
};

const setColor = async (todoId, boardId) => {
    let color = document.getElementById("colorInput").value;
    try {
        await axios.patch(`${apiTodos}/${todoId}`, { borderColor: color });
        showAlert("Color updated successfully", "success");
        let colorModalElement = document.getElementById("colorModal");
        let colorModal = bootstrap.Modal.getInstance(colorModalElement);
        if (!colorModal) {
            colorModal = new bootstrap.Modal(colorModalElement, {
                keyboard: false,
            });
        }
        colorModal.hide();
        renderTodos(boardId);
    } catch (err) {
        console.error(err);
        showAlert("Error updating color", "danger");
    }
};

const saveChanges = async (boardId) => {
    let modalElement = document.getElementById("setBackgroundModal");
    let selectedImageId = modalElement.dataset.selectedImageId;

    if (selectedImageId) {
        try {
            let selectedImage = document.querySelector(
                `.setBgVariant-${selectedImageId}`
            );
            let backgroundImageUrl = selectedImage.src;
            await axios.patch(`${apiBoards}/${boardId}`, {
                boardBg: backgroundImageUrl,
            });
            showAlert("Background image updated successfully", "success");
            renderTodos(boardId);
            let setBackgroundModal = bootstrap.Modal.getInstance(modalElement);
            if (!setBackgroundModal) {
                setBackgroundModal = new bootstrap.Modal(modalElement);
            }
            setBackgroundModal.hide();
        } catch (err) {
            console.error(err);
            showAlert("Error updating background image", "danger");
        }
    } else {
        showAlert("No image selected", "danger");
    }
};

const duplicateTodo = async (e, todoId, boardId) => {
    e.preventDefault();
    try {
        let todoToDuplicate = await axios.get(`${apiTodos}?id=${todoId}`);
        await axios.post(apiTodos, todoToDuplicate.data[0]);
        renderTodos(boardId);
    } catch (error) {
        console.error(error);
    }
};
