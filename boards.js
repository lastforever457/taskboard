const renderBoards = async (userId) => {
    const boardsBody = document.querySelector(".boards-body");
    if (boardsBody) {
        boardsBody.innerHTML = "";

        try {
            let response = await axios.get(`${apiBoards}?userId=${userId}`);
            let boardsToShow = response.data;

            if (boardsToShow) {
                boardsToShow.forEach((board) => {
                    let li = document.createElement("li");
                    li.className =
                        "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
                    li.innerHTML = `
                    <div onclick="renderTodos(${board.id})" class="d-flex justify-content-center align-items-center gap-2">
                        <i class="fa-solid fa-table-list"></i>
                        <p class="p-0 m-0 board-name">${board.name}</p>
                    </div>
                    <div class="actions">
                        <button class="btn" onclick="editBoard(event, ${board.id}, ${userId})">
                            <i class="fa-solid fa-pen-to-square fs-6" aria-hidden="true"></i>
                        </button>
                        <button class="btn" onclick="deleteBoard(event, ${board.id}, ${userId})">
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
            <button class="btn btn-outline-dark">
                <i class="fa fa-plus add-btn" onclick="submitBoard(event, ${userId})" aria-hidden="true"></i>
           </button>
        `;
            boardsBody.appendChild(addBoardLi);
        } catch (error) {
            console.error("Error rendering boards:", error);
            showAlert("Error rendering boards", "danger");
        }
    }
};

const addBoard = async (event, userId) => {
    event.preventDefault();
    let text = document.querySelector("#addBoardInput").value.trim();
    if (text === "") {
        showAlert("Board name is required", "danger");
        return;
    }
    try {
        await axios.post(apiBoards, {
            name: text,
            boardBg: "",
            userId: userId,
        });
        await renderBoards(userId);
        showAlert("Board added successfully", "success");
    } catch (error) {
        console.error("Error adding board:", error);
        showAlert("Error adding board", "danger");
    }
};

const editBoard = async (event, idToEdit, userId) => {
    event.preventDefault();
    try {
        let response = await axios.get(`${apiBoards}/${idToEdit}`);
        let boardToEdit = response.data;

        const addBoardInput = document.querySelector("#addBoardInput");
        addBoardInput.value = boardToEdit.name;
        addBoardInput.dataset.editingId = idToEdit;

        const addButton = document.querySelector(".add-btn");
        addButton.innerHTML = '<i class="fas fa-save"></i>';
        addButton.onclick = (event) => saveBoardEdit(event, userId);
    } catch (error) {
        console.error("Error fetching board to edit:", error);
        showAlert("Error fetching board to edit", "danger");
    }
};

const saveBoardEdit = async (event, userId) => {
    event.preventDefault();
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
            addButton.onclick = (event) => submitBoard(event, userId);

            await renderBoards(userId);
        } else {
            showAlert("Board name cannot be empty", "danger");
        }
    } catch (error) {
        console.error("Error saving board edit:", error);
        showAlert("Error updating board", "danger");
    }
};

const submitBoard = async (event, userId) => {
    event.preventDefault();
    const newBoardName = document.querySelector("#addBoardInput").value.trim();
    if (newBoardName.length === 0) {
        showAlert("Please enter board name", "danger");
    } else {
        try {
            await axios.post(apiBoards, { name: newBoardName, userId: userId });
            showAlert("Board created successfully", "success");
            await renderBoards(userId);
        } catch (error) {
            console.error("Error creating board:", error);
            showAlert("Error creating board", "danger");
        }
    }
};

const deleteBoard = async (event, idToDelete, userId) => {
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
        await renderBoards(userId);
        renderTodos(userId);
        showAlert("Board deleted successfully", "success");
    } catch (error) {
        console.error("Error deleting board:", error);
        showAlert("An error occurred while deleting the board", "danger");
    }
};

let getUser = localStorage.getItem("user");
let user = getUser ? JSON.parse(getUser) : "";

renderBoards(user.id);
