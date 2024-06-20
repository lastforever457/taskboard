const renderUserProfile = async (userId) => {
    try {
        // Fetch user data from API
        const response = await axios.get(`${apiUsers}?id=${userId}`);
        const user = response.data[0];

        // Reference modal elements
        const userProfileModal = new bootstrap.Modal(
            document.getElementById("userProfile")
        );
        const userProfileModalBody = document.querySelector(
            "#user-profile-modal-body"
        );

        // Update modal body with user profile form
        userProfileModalBody.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="btn-group-vertical" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-primary">
                                <i class="fa-solid fa-upload"></i>
                            </button>
                            <button type="button" class="btn btn-primary" >
                                <i class="fa-solid fa-user-tie"></i>
                            </button>
                            <button type="button" class="btn btn-primary">
                                <i class="fa-solid fa-delete-left"></i>
                            </button>
                        </div>
                        <img class="w-100" src="./default-user.png" alt="Profile Picture">
                    </div>
                </div>
                <div class="col-md-8 d-flex justify-content-center align-items-center mb-3">
                    <div class="d-flex flex-column justify-content-center align-items-center">
                        <h3>${user.firstName || ""} ${user.lastName || ""}</h3>
                        <p>Editing profile</p>
                    </div>
                </div>
                <div class="col-md-12 mt-1">
                    <form id="userForm" class="form-floating">
                        <div class="row g-3">
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.firstName || ""
                                }" class="form-control" type="text" id="firstName" name="firstName" placeholder="First Name" required>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.lastName || ""
                                }" class="form-control" type="text" id="lastName" name="lastName" placeholder="Last Name" required>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.birthDate || ""
                                }" class="form-control" type="text" id="birthDate" name="birthDate" placeholder="Birth Date" required>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.username || ""
                                }" class="form-control" type="text" id="username" name="username" placeholder="Username" required>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.email || ""
                                }" class="form-control" type="email" id="email" name="email" placeholder="Email" required>
                            </div>
                            <div class="col-sm-6 col-md-4">
                                <input value="${
                                    user.userPass || ""
                                }" class="form-control" type="password" id="userPass" name="userPass" placeholder="Password" required>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const saveUserProfileBtn =
            document.getElementById("saveUserProfileBtn");
        saveUserProfileBtn.addEventListener("click", async () => {
            await saveUserProfile(userId);
            userProfileModal.hide();
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

const saveUserProfile = async (userId) => {
    try {
        const userForm = document.getElementById("userForm");
        const formData = new FormData(userForm);

        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });
        await axios.patch(`${apiUsers}/${userId}`, userData);
        showAlert("User profile saved successfully");
    } catch (error) {
        showAlert("Error saving user profile", "danger");
    }
};
