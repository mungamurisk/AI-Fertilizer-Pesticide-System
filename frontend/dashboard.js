
const profileText = sessionStorage.getItem("farmerProfile");

if (!profileText) {
    window.location.href = "login.html";
} else {
    try {
        const farmer = JSON.parse(profileText);

        document.getElementById("welcomeMessage").textContent =
            "Welcome, " + farmer.fullName + "!";

        document.getElementById("farmerEmail").textContent =
            farmer.email || "-";

        document.getElementById("farmerVillage").textContent =
            farmer.village || "-";
    } catch (error) {
        sessionStorage.removeItem("farmerProfile");
        window.location.href = "login.html";
    }
}

document.getElementById("dashboardLogout").addEventListener(
    "click",
    function () {
        sessionStorage.removeItem("farmerProfile");
        window.location.href = "login.html";
    }
);
