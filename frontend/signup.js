const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const signupButton = document.getElementById("signupButton");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    signupButton.disabled = true;
    signupMessage.textContent = "Creating your account...";

    const data = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        village: document.getElementById("village").value.trim(),
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(
            "http://localhost:8081/api/farmers/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Signup failed.");
        }

        signupMessage.textContent =
            "Account created successfully! Redirecting to login...";

        signupForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        signupMessage.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the server. Make sure Spring Boot is running."
                : error.message;
    } finally {
        signupButton.disabled = false;
    }
});
