let apiBoards = "https://e4494003997bfc8e.mokky.dev/boards";
let apiTodos = "https://e4494003997bfc8e.mokky.dev/todos";
let apiTasks = "https://e4494003997bfc8e.mokky.dev/tasks";

const getBoards = async () => {
    let res = await axios.get(apiBoards);
    return res.data;
};

const getTodos = async () => {
    let res = await axios.get(apiTodos);
    return res.data;
};

const getTasks = async () => {
    let res = await axios.get(apiTasks);
    return res.data;
};

function showAlert(message, type = "success") {
    const alertContainer = document.getElementById("alert-container");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = "alert";
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        if (alert) {
            alert.classList.remove("show");
            alert.addEventListener("transitionend", () => alert.remove());
        }
    }, 5000);
}
