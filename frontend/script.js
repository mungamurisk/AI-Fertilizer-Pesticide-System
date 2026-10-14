console.log("Fertilizer JavaScript loaded successfully!");

// ========================================
// API CONFIGURATION
// ========================================

const API_BASE = "http://localhost:8081";

// ========================================
// FERTILIZER RECOMMENDATION
// ========================================

const form = document.getElementById("recommendationForm");
const message = document.getElementById("message");
const button = document.getElementById("submitButton");

if (form && message && button) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const data = {
            temperature: Number(
                document.getElementById("temperature").value
            ),
            humidity: Number(
                document.getElementById("humidity").value
            ),
            moisture: Number(
                document.getElementById("moisture").value
            ),
            soilType: document.getElementById("soilType").value,
            cropType: document.getElementById("cropType").value,
            nitrogen: Number(
                document.getElementById("nitrogen").value
            ),
            potassium: Number(
                document.getElementById("potassium").value
            ),
            phosphorus: Number(
                document.getElementById("phosphorus").value
            )
        };

        button.disabled = true;
        message.textContent = "Analyzing your farm data...";

        try {
            const response = await fetch(
                `${API_BASE}/api/ml/predict`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Server returned status " + response.status
                );
            }

            const result = await response.json();

            message.textContent =
                "Recommended fertilizer: " + result.fertilizer;

            try {
                await saveRecommendationHistory({
                    cropType: data.cropType,
                    soilType: data.soilType,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    moisture: data.moisture,
                    nitrogen: data.nitrogen,
                    phosphorus: data.phosphorus,
                    potassium: data.potassium,
                    fertilizer: result.fertilizer
                });

                message.textContent += " (Saved to history!)";

            } catch (historyError) {
                console.error(
                    "History save error:",
                    historyError
                );

                message.textContent +=
                    " (Recommendation succeeded, but history could not be saved.)";
            }

        } catch (error) {
            console.error("Recommendation error:", error);

            message.textContent =
                "Could not get recommendation: " + error.message;

        } finally {
            button.disabled = false;
        }
    });
} else {
    console.warn(
        "Fertilizer form elements were not found on this page."
    );
}

// ========================================
// PESTICIDE RECOMMENDATION
// ========================================

const pesticideForm =
    document.getElementById("pesticideForm");

const pesticideMessage =
    document.getElementById("pesticideMessage");

const pesticideButton =
    document.getElementById("pesticideButton");

if (pesticideForm && pesticideMessage && pesticideButton) {
    pesticideForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            const data = {
                cropType:
                    document.getElementById("pesticideCrop").value,
                pestType:
                    document.getElementById("pestType").value
            };

            pesticideButton.disabled = true;

            pesticideMessage.textContent =
                "Finding a pesticide recommendation...";

            try {
                const response = await fetch(
                    `${API_BASE}/api/pesticide-recommendations`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Server returned status " + response.status
                    );
                }

                const result = await response.json();

                pesticideMessage.textContent =
                    "Recommended pesticide: " +
                    result.pesticide +
                    ". Reason: " +
                    result.reason;

                try {
                    await saveRecommendationHistory({
                        cropType: data.cropType,
                        pestType: data.pestType,
                        pesticide: result.pesticide
                    });

                    pesticideMessage.textContent +=
                        " (Saved to history!)";

                } catch (historyError) {
                    console.error(
                        "Pesticide history save error:",
                        historyError
                    );

                    pesticideMessage.textContent +=
                        " (Recommendation succeeded, but history could not be saved.)";
                }

            } catch (error) {
                console.error(
                    "Pesticide recommendation error:",
                    error
                );

                pesticideMessage.textContent =
                    "Could not get pesticide recommendation: " +
                    error.message;

            } finally {
                pesticideButton.disabled = false;
            }
        }
    );
}

// ========================================
// SAVE RECOMMENDATION HISTORY
// ========================================

async function saveRecommendationHistory(data) {
    const response = await fetch(
        `${API_BASE}/api/history`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                "Please log in before saving recommendation history."
            );
        }

        throw new Error(
            "Could not save recommendation history. Status: " +
            response.status
        );
    }

    return await response.json();
}

// ========================================
// LOAD FARMER'S RECOMMENDATION HISTORY
// ========================================

const loadHistoryButton =
    document.getElementById("loadHistoryButton");

const historyTableBody =
    document.getElementById("historyTableBody");

const historyMessage =
    document.getElementById("historyMessage");

if (loadHistoryButton && historyTableBody && historyMessage) {
    loadHistoryButton.addEventListener(
        "click",
        async function () {
            loadHistoryButton.disabled = true;

            historyMessage.textContent =
                "Loading recommendation history...";

            try {
                const response = await fetch(
                    `${API_BASE}/api/history`,
                    {
                        credentials: "include"
                    }
                );

                if (response.status === 401) {
                    throw new Error(
                        "Please log in to view your recommendation history."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        "Server returned status " + response.status
                    );
                }

                const records = await response.json();

                historyTableBody.replaceChildren();

                if (records.length === 0) {
                    historyMessage.textContent =
                        "No saved recommendations found.";
                    return;
                }

                records.forEach(function (record) {
                    const row = document.createElement("tr");

                    const values = [
                        record.id,
                        record.cropType,
                        record.soilType,
                        record.fertilizer,
                        record.pestType,
                        record.pesticide,
                        record.createdAt
                            ? new Date(
                                record.createdAt
                            ).toLocaleString()
                            : ""
                    ];

                    values.forEach(function (value) {
                        const cell = document.createElement("td");
                        cell.textContent = value ?? "-";
                        row.appendChild(cell);
                    });

                    historyTableBody.appendChild(row);
                });

                historyMessage.textContent =
                    "Loaded " +
                    records.length +
                    " saved recommendation(s).";

            } catch (error) {
                console.error(
                    "History loading error:",
                    error
                );

                historyMessage.textContent =
                    "Could not load history: " + error.message;

            } finally {
                loadHistoryButton.disabled = false;
            }
        }
    );
}

// ========================================
// DISPLAY FARMER PROFILE
// ========================================

const farmerProfileText =
    sessionStorage.getItem("farmerProfile");

const farmerAccount =
    document.getElementById("farmerAccount");

const farmerName =
    document.getElementById("farmerName");

const logoutButton =
    document.getElementById("logoutButton");

if (farmerProfileText && farmerAccount && farmerName) {
    try {
        const farmer = JSON.parse(farmerProfileText);

        farmerName.textContent =
            "Welcome, " + farmer.fullName;

        farmerAccount.style.display = "flex";

    } catch (error) {
        console.error("Could not read farmer profile:", error);
        sessionStorage.removeItem("farmerProfile");
    }
}

// ========================================
// LOG OUT
// ========================================

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
        logoutButton.disabled = true;

        try {
            const response = await fetch(
                `${API_BASE}/api/farmers/logout`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                console.error(
                    "Server logout returned status:",
                    response.status
                );
            }

        } catch (error) {
            console.error("Server logout error:", error);

        } finally {
            sessionStorage.removeItem("farmerProfile");
            window.location.href = "login.html";
        }
    });
}
