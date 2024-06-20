const enteringUser = async (event) => {
    event.preventDefault();
    try {
        let email = document.querySelector("#loginEmailInput").value;
        let password = document.querySelector("#loginPasswordInput").value;
        let findUser = await axios.get(
            `https://e4494003997bfc8e.mokky.dev/users?email=${email}&userPass=${password}`
        );
        if (email.length !== 0 && password.length !== 0) {
            if (findUser?.data.length > 0) {
                showAlert(
                    `Login successfully! Welcome back ${findUser.data[0].firstName}.`,
                    "success"
                );
                localStorage.setItem("user", JSON.stringify(findUser.data[0]));
                renderBoards(findUser.data[0].id);
                renderUserProfile(findUser.data[0].id);
                clickDashboard();
            } else {
                showAlert(
                    "Login failed. Please check your email and password.",
                    "danger"
                );
            }
        } else {
            showAlert("Please fill in all fields.", "danger");
        }
    } catch (error) {
        console.error(error);
        showAlert(
            "An error occurred while logging in. Please try again later.",
            "danger"
        );
    }
};

document.querySelector("#loginForm").addEventListener("submit", enteringUser);
