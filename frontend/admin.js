
const refreshButton = document.getElementById("refreshDashboard");
const dashboardMessage = document.getElementById("dashboardMessage");

async function loadDashboard() {
    refreshButton.disabled = true;
    dashboardMessage.textContent = "Loading dashboard data...";

    try {
        const response = await fetch(
            "http://localhost:8081/api/history"
        );

        if (!response.ok) {
            throw new Error("Server returned status " + response.status);
        }

        const records = await response.json();

        // Calculate dashboard totals
        const fertilizerRecords = records.filter(
            record => record.fertilizer &&
                record.fertilizer.trim() !== ""
        );

        const pesticideRecords = records.filter(
            record => record.pesticide &&
                record.pesticide.trim() !== ""
        );

        const cropNames = [
            ...new Set(
                records
                    .map(record => record.cropType)
                    .filter(crop => crop && crop.trim() !== "")
            )
        ];

        document.getElementById("totalCount").textContent =
            records.length;

        document.getElementById("fertilizerCount").textContent =
            fertilizerRecords.length;

        document.getElementById("pesticideCount").textContent =
            pesticideRecords.length;

        document.getElementById("cropCount").textContent =
            cropNames.length;

        // Calculate statistics for each crop
        const cropStatistics = document.getElementById("cropStatistics");
        cropStatistics.replaceChildren();

        const cropCounts = {};

        records.forEach(record => {
            if (record.cropType) {
                cropCounts[record.cropType] =
                    (cropCounts[record.cropType] || 0) + 1;
            }
        });

        if (Object.keys(cropCounts).length === 0) {
            cropStatistics.textContent = "No crop records found.";
        } else {
            Object.entries(cropCounts).forEach(([crop, count]) => {
                const paragraph = document.createElement("p");
                paragraph.textContent = crop + ": " + count + " recommendation(s)";
                cropStatistics.appendChild(paragraph);
            });
        }

        // Show the latest five records first
        const recentHistory = document.getElementById("recentHistory");
        recentHistory.replaceChildren();

        const latestRecords = [...records]
            .sort((a, b) => b.id - a.id)
            .slice(0, 5);

        latestRecords.forEach(record => {
            const row = document.createElement("tr");

            const values = [
                record.id,
                record.cropType || "-",
                record.fertilizer || "-",
                record.pesticide || "-",
                record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "-"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            recentHistory.appendChild(row);
        });

        dashboardMessage.textContent =
            "Dashboard updated successfully.";

    } catch (error) {
        console.error("Dashboard loading error:", error);
        dashboardMessage.textContent =
            "Could not load dashboard: " + error.message;
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", loadDashboard);

// Load statistics when the page opens
loadDashboard();
