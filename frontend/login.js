const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginButton.disabled = true;
    loginMessage.textContent = "Checking your credentials...";

    const data = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(
            "http://localhost:8081/api/farmers/login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login failed.");
        }

        loginMessage.textContent =
            "Login successful! Welcome, " +
            result.farmer.fullName + ".";

        // Store basic profile information only.
        sessionStorage.setItem(
            "farmerProfile",
            JSON.stringify(result.farmer)
        );

        // Open the dashboard after login.
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);

    } catch (error) {
        loginMessage.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the server. Make sure Spring Boot is running."
                : error.message;
    } finally {
        loginButton.disabled = false;
    }
});