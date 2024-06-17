let boardsBody = document.querySelector(".boards-body");

const renderBoards = async () => {
    boardsBody.innerHTML = "";

    try {
        let boards = await getBoards();
        let todos = await getTodos();
        let tasks = await getTasks();

        let todosWithTasks = todos.map((todo) => ({
            ...todo,
            tasks: tasks.filter((task) => task.todoId === todo.id),
        }));

        if (boards) {
            boards.forEach((board, index) => {
                let li = document.createElement("li");
                li.className =
                    "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <div onclick="renderTodos(${board.id})" class="d-flex justify-content-center align-items-center gap-2">
                        <i class="fa-solid fa-table-list"></i> ${board.name}
                    </div>
                    <div class="actions">
                        <button class="btn" onclick="editBoard(event, ${board.id})">
                            <i class="fa-solid fa-pen-to-square fs-6" aria-hidden="true"></i>
                        </button>
                        <button class="btn" onclick="deleteBoard(event, ${board.id}, ${index})">
                            <i class="fa fa-trash-can fs-6" aria-hidden="true"></i>
                        </button>
                    </div>      
                `;
                boardsBody.appendChild(li);
            });
        }

        let addBoardLi = document.createElement("li");
        addBoardLi.className =
            "list-group-item d-flex justify-content-between align-items-center";
        addBoardLi.innerHTML = `
            <input type="text" id="addBoardInput" class="border-0 outline-none" placeholder="Enter new board name" />
            <i class="fa fa-plus add-btn" onclick="addBoard(event)" aria-hidden="true"></i>
        `;
        boardsBody.appendChild(addBoardLi);
    } catch (error) {
        console.error("Error rendering boards:", error);
    }
};

const addBoard = async (event) => {
    event.preventDefault();
    let text = document.querySelector("#addBoardInput").value;
    if (text.trim() === "") {
        showAlert("Board name is required", "danger");
        return;
    }
    try {
        await axios.post(apiBoards, {
            name: text,
            boardBg: "",
        });
        await renderBoards();
        showAlert("Board added successfully");
    } catch (error) {
        console.error("Error adding board:", error);
    }
};

const editBoard = async (event, idToEdit) => {
    event.preventDefault();
    try {
        let response = await axios.get(`${apiBoards}/${idToEdit}`);
        let boardToEdit = response.data;

        const addBoardInput = document.querySelector("#addBoardInput");
        addBoardInput.value = boardToEdit.name;
        addBoardInput.dataset.editingId = idToEdit;

        const addButton = document.querySelector(".add-btn");
        addButton.innerHTML = '<i class="fas fa-save"></i>';
        addButton.onclick = saveBoardEdit;
    } catch (error) {
        console.error("Error fetching board to edit:", error);
    }
};

const saveBoardEdit = async () => {
    try {
        const addBoardInput = document.querySelector("#addBoardInput");
        const idToEdit = addBoardInput.dataset.editingId;
        const changedName = addBoardInput.value.trim();

        if (idToEdit && changedName) {
            await axios.patch(`${apiBoards}/${idToEdit}`, {
                name: changedName,
            });
            showAlert("Board updated successfully", "success");

            addBoardInput.value = "";
            delete addBoardInput.dataset.editingId;

            const addButton = document.querySelector(".add-btn");
            addButton.innerHTML = '<i class="fas fa-plus"></i>';
            addButton.onclick = submitBoard;

            renderBoards();
        } else {
            showAlert("Board name cannot be empty", "danger");
        }
    } catch (error) {
        console.error("Error saving board edit:", error);
        showAlert("Error updating board", "danger");
    }
};

const submitBoard = async (event) => {
    event.preventDefault();
    const newBoardName = document.querySelector("#addBoardInput").value.trim();
    if (newBoardName.length == 0) {
        showAlert("Please enter board name", "danger");
    } else {
        try {
            await axios.post(apiBoards, { name: newBoardName });
            showAlert("Board created successfully", "success");
            renderBoards();
        } catch (err) {
            console.error(err);
            showAlert("Error creating board", "danger");
        }
    }
};

const deleteBoard = async (event, idToDelete) => {
    event.preventDefault();
    try {
        let todosResponse = await axios.get(
            `${apiTodos}?boardId=${idToDelete}`
        );
        let todos = todosResponse.data;
        for (const todo of todos) {
            let tasksResponse = await axios.get(
                `${apiTasks}?todoId=${todo.id}`
            );
            let tasks = tasksResponse.data;
            for (const task of tasks) {
                await axios.delete(`${apiTasks}/${task.id}`);
            }
            await axios.delete(`${apiTodos}/${todo.id}`);
        }
        await axios.delete(`${apiBoards}/${idToDelete}`);
        renderBoards();
        renderTodos();
        showAlert("Board deleted successfully");
    } catch (error) {
        console.error("Error deleting board:", error);
        showAlert("An error occurred while deleting the board", "danger");
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await renderBoards();
});
