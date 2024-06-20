let apiUsers = "https://e4494003997bfc8e.mokky.dev/users";
let apiBoards = "https://e4494003997bfc8e.mokky.dev/boards";
let apiTodos = "https://e4494003997bfc8e.mokky.dev/todos";
let apiTasks = "https://e4494003997bfc8e.mokky.dev/tasks";

const getUsers = async () => {
    let res = await axios.get(apiUsers);
    return res.data;
};

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
    }, 3000);
}

let landingSection = document.getElementById("landing");
let registerSection = document.getElementById("register");
let loginSection = document.getElementById("login");
let dashboardSection = document.getElementById("dashboard");
let adminSection = document.getElementById("admin");

const clickHome = () => {
    landingSection.classList.remove("d-none");
    registerSection.classList.add("d-none");
    loginSection.classList.add("d-none");
    dashboardSection.classList.add("d-none");
    adminSection.classList.add("d-none");
};

const clickRegister = () => {
    landingSection.classList.add("d-none");
    registerSection.classList.remove("d-none");
    loginSection.classList.add("d-none");
    dashboardSection.classList.add("d-none");
    adminSection.classList.add("d-none");
};

const clickLogin = () => {
    landingSection.classList.add("d-none");
    registerSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
    dashboardSection.classList.add("d-none");
    adminSection.classList.add("d-none");
};

const clickDashboard = () => {
    landingSection.classList.add("d-none");
    registerSection.classList.add("d-none");
    loginSection.classList.add("d-none");
    dashboardSection.classList.remove("d-none");
    adminSection.classList.add("d-none");
};

const clickAdmin = () => {
    landingSection.classList.add("d-none");
    registerSection.classList.add("d-none");
    loginSection.classList.add("d-none");
    dashboardSection.classList.add("d-none");
    adminSection.classList.remove("d-none");
};

const logOut = () => {
    localStorage.removeItem("user");
    clickHome();
    showAlert("Logged out successfully");
    checkUserLoggedIn();
};

const checkUserLoggedIn = () => {
    let getUser = localStorage.getItem("user");
    if (getUser) {
        let user = JSON.parse(getUser);
        if (user.role === "adin") {
            clickAdmin();
        } else {
            clickDashboard();
            renderUserProfile(user.id);
            showAlert("Welcome back, " + user.firstName);
        }
    } else {
        clickHome();
    }
};

document.addEventListener("onrefresh", checkUserLoggedIn);
window.onload = checkUserLoggedIn;
