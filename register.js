const registeringUser = async (event) => {
    event.preventDefault();
    try {
        let firstName = document.querySelector("#registerNameInput").value;
        let lastName = document.querySelector("#registerLastInput").value;
        let birthDate = document.querySelector("#registerBirthDateInput").value;
        let username = document.querySelector("#registerusernameInput").value;
        let email = document.querySelector("#registerEmailInput").value;
        let userPass = document.querySelector("#registerPasswordInput").value;
        let users = await axios.get("https://e4494003997bfc8e.mokky.dev/users");
        if (
            firstName.length != 0 &&
            lastName.length != 0 &&
            birthDate.length != 0 &&
            username.length != 0 &&
            email.length != 0 &&
            userPass.length != 0
        ) {
            let usernameError = "";
            let emailError = "";
            let error = false;
            usernameError = users.data.filter(
                (user) => user.username === username
            ).length;
            emailError = users.data.filter(
                (user) => user.email === email
            ).length;
            if (usernameError == 0 && emailError == 0) {
                await axios.post("https://e4494003997bfc8e.mokky.dev/users", {
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    username: username,
                    email: email,
                    userPass: userPass,
                    access: true,
                });
                showAlert("User Registered Successfully", "success");
            } else {
                showAlert("User Already Exists", "danger");
            }
        } else {
            showAlert("Please fill the blanks", "danger");
        }
    } catch (error) {
        console.error(error);
    }
};
