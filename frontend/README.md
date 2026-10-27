# React + Vite frontend

## Run locally

Run each service in a separate terminal.

Start the Python ML service:

```powershell
cd backend\ml
python -m pip install flask pandas joblib scikit-learn
python app.py
```

Start the Spring Boot backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Start the React frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The backend
posts fertilizer inputs as JSON to `http://127.0.0.1:5000/predict`.

Vite proxies `/api` requests to the backend during development. For a deployed
frontend served from a different origin, set `VITE_API_BASE_URL` to the API
server's base URL before building.

Run `npm run build` to create the production bundle in `dist/`.
