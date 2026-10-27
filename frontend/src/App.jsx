import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { apiRequest, postJson } from "./api.js";

const soils = ["Loamy", "Black", "Red", "Sandy", "Clayey"];
const crops = [
  "Rice",
  "Wheat",
  "Cotton",
  "Maize",
  "Tomato",
  "Ground Nuts",
  "Sugarcane",
  "Pulses",
];
const pesticideCrops = ["Rice", "Cotton", "Tomato", "Wheat", "Maize"];
const pests = ["Stem Borer", "Bollworm", "Fruit Borer"];

const initialFarmData = {
  temperature: "30",
  humidity: "65",
  moisture: "45",
  soilType: "Loamy",
  cropType: "Rice",
  nitrogen: "20",
  potassium: "40",
  phosphorus: "40",
};

function getSavedFarmer() {
  try {
    const profile = sessionStorage.getItem("farmerProfile");
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error("Could not read farmer profile:", error);
    sessionStorage.removeItem("farmerProfile");
    return null;
  }
}

function App() {
  const [farmer, setFarmer] = useState(getSavedFarmer);
  const navigate = useNavigate();

  async function logout() {
    try {
      await apiRequest("/api/farmers/logout", { method: "POST" });
    } catch (error) {
      console.error("Server logout error:", error);
    } finally {
      sessionStorage.removeItem("farmerProfile");
      setFarmer(null);
      navigate("/login");
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-icon" aria-hidden="true">🌱</span>
            <span>Smart Agriculture</span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/" end>Recommendations</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            {farmer ? (
              <>
                <NavLink to="/dashboard">My account</NavLink>
                <button className="nav-button" type="button" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink className="nav-signup" to="/signup">Create account</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage farmer={farmer} />} />
        <Route path="/login" element={<LoginPage onLogin={setFarmer} />} />
        <Route path="/login.html" element={<LoginPage onLogin={setFarmer} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup.html" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={<DashboardPage farmer={farmer} onLogout={logout} />}
        />
        <Route
          path="/dashboard.html"
          element={<DashboardPage farmer={farmer} onLogout={logout} />}
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin.html" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer className="site-footer">
        AI Fertilizer &amp; Pesticide Recommendation System
      </footer>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
  );
}

function HomePage({ farmer }) {
  return (
    <main className="page-content">
      <PageHeading
        eyebrow="AI-powered crop care"
        title="Grow healthier crops"
        description="Get tailored fertilizer and pesticide recommendations using your farm and soil details."
      />
      {farmer && (
        <p className="welcome-note">Welcome back, {farmer.fullName}.</p>
      )}

      <FertilizerForm />
      <PesticideForm />
      <HistoryPanel />
    </main>
  );
}

function FormField({ label, htmlFor, children }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function SelectOptions({ values }) {
  return values.map((value) => <option key={value} value={value}>{value}</option>);
}

function ResultMessage({ children, error = false }) {
  return (
    <p className={`form-message${error ? " form-message-error" : ""}`} aria-live="polite">
      {children}
    </p>
  );
}

function FertilizerForm() {
  const [form, setForm] = useState(initialFarmData);
  const [message, setMessage] = useState("Enter your farm details to get started.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("Analyzing your farm data...");

    const data = {
      ...form,
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      moisture: Number(form.moisture),
      nitrogen: Number(form.nitrogen),
      potassium: Number(form.potassium),
      phosphorus: Number(form.phosphorus),
    };

    try {
      const result = await postJson("/api/ml/predict", data);
      let nextMessage = `Recommended fertilizer: ${result.fertilizer}`;

      try {
        await postJson("/api/history", {
          cropType: data.cropType,
          soilType: data.soilType,
          temperature: data.temperature,
          humidity: data.humidity,
          moisture: data.moisture,
          nitrogen: data.nitrogen,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          fertilizer: result.fertilizer,
        });
        nextMessage += " (Saved to history!)";
      } catch (historyError) {
        console.error("History save error:", historyError);
        nextMessage += " (Recommendation succeeded, but history could not be saved.)";
      }

      setMessage(nextMessage);
    } catch (requestError) {
      console.error("Recommendation error:", requestError);
      setError(true);
      setMessage(`Could not get recommendation: ${requestError.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="fertilizerSection">
      <div className="section-heading">
        <span className="section-icon" aria-hidden="true">🌿</span>
        <div>
          <h2>Fertilizer recommendation</h2>
          <p>Tell us about your soil and growing conditions.</p>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <FormField label="Temperature (°C)" htmlFor="temperature">
            <input id="temperature" name="temperature" type="number" value={form.temperature} onChange={updateField} required />
          </FormField>
          <FormField label="Humidity (%)" htmlFor="humidity">
            <input id="humidity" name="humidity" type="number" value={form.humidity} onChange={updateField} required />
          </FormField>
          <FormField label="Soil moisture" htmlFor="moisture">
            <input id="moisture" name="moisture" type="number" value={form.moisture} onChange={updateField} required />
          </FormField>
          <FormField label="Soil type" htmlFor="soilType">
            <select id="soilType" name="soilType" value={form.soilType} onChange={updateField}>
              <SelectOptions values={soils} />
            </select>
          </FormField>
          <FormField label="Crop type" htmlFor="cropType">
            <select id="cropType" name="cropType" value={form.cropType} onChange={updateField}>
              <SelectOptions values={crops} />
            </select>
          </FormField>
          <FormField label="Nitrogen (N)" htmlFor="nitrogen">
            <input id="nitrogen" name="nitrogen" type="number" value={form.nitrogen} onChange={updateField} required />
          </FormField>
          <FormField label="Potassium (K)" htmlFor="potassium">
            <input id="potassium" name="potassium" type="number" value={form.potassium} onChange={updateField} required />
          </FormField>
          <FormField label="Phosphorus (P)" htmlFor="phosphorus">
            <input id="phosphorus" name="phosphorus" type="number" value={form.phosphorus} onChange={updateField} required />
          </FormField>
        </div>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? "Getting recommendation..." : "Get fertilizer recommendation"}
        </button>
      </form>
      <ResultMessage error={error}>{message}</ResultMessage>
    </section>
  );
}

function PesticideForm() {
  const [cropType, setCropType] = useState(pesticideCrops[0]);
  const [pestType, setPestType] = useState(pests[0]);
  const [message, setMessage] = useState("Choose a crop and pest to get started.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("Finding a pesticide recommendation...");

    try {
      const result = await postJson("/api/pesticide-recommendations", { cropType, pestType });
      let nextMessage = `Recommended pesticide: ${result.pesticide}. Reason: ${result.reason}`;

      try {
        await postJson("/api/history", { cropType, pestType, pesticide: result.pesticide });
        nextMessage += " (Saved to history!)";
      } catch (historyError) {
        console.error("Pesticide history save error:", historyError);
        nextMessage += " (Recommendation succeeded, but history could not be saved.)";
      }

      setMessage(nextMessage);
    } catch (requestError) {
      console.error("Pesticide recommendation error:", requestError);
      setError(true);
      setMessage(`Could not get pesticide recommendation: ${requestError.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="pesticideSection">
      <div className="section-heading">
        <span className="section-icon" aria-hidden="true">🛡️</span>
        <div>
          <h2>Pesticide recommendation</h2>
          <p>Select the crop and pest affecting your farm.</p>
        </div>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid form-grid-compact">
          <FormField label="Crop type" htmlFor="pesticideCrop">
            <select id="pesticideCrop" value={cropType} onChange={(event) => setCropType(event.target.value)}>
              <SelectOptions values={pesticideCrops} />
            </select>
          </FormField>
          <FormField label="Pest type" htmlFor="pestType">
            <select id="pestType" value={pestType} onChange={(event) => setPestType(event.target.value)}>
              <SelectOptions values={pests} />
            </select>
          </FormField>
        </div>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? "Finding recommendation..." : "Get pesticide recommendation"}
        </button>
      </form>
      <ResultMessage error={error}>{message}</ResultMessage>
    </section>
  );
}

function HistoryPanel() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("Load your saved recommendations.");
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    setLoading(true);
    setMessage("Loading recommendation history...");

    try {
      const result = await apiRequest("/api/history");
      setRecords(result);
      setMessage(
        result.length
          ? `Loaded ${result.length} saved recommendation(s).`
          : "No saved recommendations found.",
      );
    } catch (error) {
      console.error("History loading error:", error);
      setRecords([]);
      setMessage(error.status === 401
        ? "Please log in to view your recommendation history."
        : `Could not load history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="historySection">
      <div className="section-heading">
        <span className="section-icon" aria-hidden="true">📋</span>
        <div>
          <h2>Recommendation history</h2>
          <p>Review recommendations saved to your account.</p>
        </div>
      </div>
      <button className="button button-secondary" type="button" onClick={loadHistory} disabled={loading}>
        {loading ? "Loading..." : "Load recommendation history"}
      </button>
      <ResultMessage>{message}</ResultMessage>
      {records.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Crop</th><th>Soil</th><th>Fertilizer</th><th>Pest</th><th>Pesticide</th><th>Date</th></tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.cropType || "-"}</td>
                  <td>{record.soilType || "-"}</td>
                  <td>{record.fertilizer || "-"}</td>
                  <td>{record.pestType || "-"}</td>
                  <td>{record.pesticide || "-"}</td>
                  <td>{formatDate(record.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AuthPage({ title, description, children, footer }) {
  return (
    <main className="auth-layout">
      <section className="card auth-card">
        <Link className="back-link" to="/">← Back to recommendations</Link>
        <PageHeading title={title} description={description} />
        {children}
        {footer}
      </section>
    </main>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("Checking your credentials...");

    try {
      const result = await postJson("/api/farmers/login", {
        email: email.trim(),
        password,
      });
      sessionStorage.setItem("farmerProfile", JSON.stringify(result.farmer));
      onLogin(result.farmer);
      navigate("/dashboard");
    } catch (requestError) {
      setError(true);
      setMessage(requestError.message === "Failed to fetch"
        ? "Cannot connect to the server. Make sure Spring Boot is running."
        : requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage
      title="Farmer login"
      description="Log in to access your smart agriculture recommendations."
      footer={<p className="auth-footer">New farmer? <Link to="/signup">Create an account</Link></p>}
    >
      <form onSubmit={submit}>
        <FormField label="Email address" htmlFor="email">
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </FormField>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        {message && <ResultMessage error={error}>{message}</ResultMessage>}
      </form>
    </AuthPage>
  );
}

function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    village: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("Creating your account...");

    try {
      await postJson("/api/farmers/signup", {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        village: form.village.trim(),
      });
      setMessage("Account created successfully. Redirecting to login...");
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (requestError) {
      setError(true);
      setMessage(requestError.message === "Failed to fetch"
        ? "Cannot connect to the server. Make sure Spring Boot is running."
        : requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage
      title="Farmer registration"
      description="Create an account to access smart crop recommendations."
      footer={<p className="auth-footer">Already registered? <Link to="/login">Log in</Link></p>}
    >
      <form onSubmit={submit}>
        <FormField label="Full name" htmlFor="fullName">
          <input id="fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} required />
        </FormField>
        <FormField label="Email address" htmlFor="signupEmail">
          <input id="signupEmail" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required />
        </FormField>
        <FormField label="Mobile number" htmlFor="phone">
          <input id="phone" name="phone" type="tel" pattern="[0-9]{10}" maxLength="10" autoComplete="tel" value={form.phone} onChange={updateField} required />
        </FormField>
        <FormField label="Village / location" htmlFor="village">
          <input id="village" name="village" autoComplete="address-level2" value={form.village} onChange={updateField} required />
        </FormField>
        <FormField label="Password" htmlFor="signupPassword">
          <input id="signupPassword" name="password" type="password" minLength="8" autoComplete="new-password" value={form.password} onChange={updateField} required />
        </FormField>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
        {message && <ResultMessage error={error}>{message}</ResultMessage>}
      </form>
    </AuthPage>
  );
}

function DashboardPage({ farmer, onLogout }) {
  if (!farmer) return <Navigate to="/login" replace />;

  return (
    <main className="page-content narrow-content">
      <PageHeading
        eyebrow="Your account"
        title={`Welcome, ${farmer.fullName}!`}
        description="Your smart agriculture assistant is ready to help."
      />
      <section className="card">
        <h2>Farmer profile</h2>
        <dl className="profile-list">
          <div><dt>Email</dt><dd>{farmer.email || "-"}</dd></div>
          <div><dt>Village</dt><dd>{farmer.village || "-"}</dd></div>
        </dl>
      </section>
      <section className="card">
        <h2>What would you like to do?</h2>
        <div className="dashboard-links">
          <Link to="/#fertilizerSection">🌿 Fertilizer recommendation</Link>
          <Link to="/#pesticideSection">🐛 Pesticide recommendation</Link>
          <Link to="/#historySection">📋 Recommendation history</Link>
        </div>
        <button className="button button-secondary" type="button" onClick={onLogout}>Log out</button>
      </section>
    </main>
  );
}

function AdminPage() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("Loading dashboard data...");
  const [loading, setLoading] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setMessage("Loading dashboard data...");

    try {
      const result = await apiRequest("/api/history");
      setRecords(result);
      setMessage("Dashboard updated successfully.");
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setRecords([]);
      setMessage(`Could not load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const fertilizerCount = records.filter((record) => record.fertilizer?.trim()).length;
  const pesticideCount = records.filter((record) => record.pesticide?.trim()).length;
  const cropNames = [...new Set(records.map((record) => record.cropType).filter(Boolean))];
  const cropCounts = records.reduce((counts, record) => {
    if (record.cropType) counts[record.cropType] = (counts[record.cropType] || 0) + 1;
    return counts;
  }, {});
  const latestRecords = [...records].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <main className="page-content">
      <PageHeading
        eyebrow="System overview"
        title="Admin dashboard"
        description="Recommendation activity and crop statistics."
      />
      <section className="card">
        <div className="card-title-row">
          <h2>Dashboard overview</h2>
          <button className="button button-secondary button-inline" type="button" onClick={loadDashboard} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh dashboard"}
          </button>
        </div>
        <ResultMessage error={message.startsWith("Could not")}>{message}</ResultMessage>
        <div className="stats-grid">
          <StatCard label="Total recommendations" value={records.length} />
          <StatCard label="Fertilizer records" value={fertilizerCount} />
          <StatCard label="Pesticide records" value={pesticideCount} />
          <StatCard label="Different crops" value={cropNames.length} />
        </div>
      </section>
      <section className="card">
        <h2>Crop statistics</h2>
        {Object.keys(cropCounts).length
          ? <ul className="statistics-list">{Object.entries(cropCounts).map(([crop, count]) => <li key={crop}><span>{crop}</span><strong>{count} recommendation(s)</strong></li>)}</ul>
          : <p className="muted">No crop records found.</p>}
      </section>
      <section className="card">
        <h2>Recent recommendations</h2>
        {latestRecords.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Crop</th><th>Fertilizer</th><th>Pesticide</th><th>Date</th></tr></thead>
              <tbody>
                {latestRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td><td>{record.cropType || "-"}</td><td>{record.fertilizer || "-"}</td><td>{record.pesticide || "-"}</td><td>{formatDate(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted">No recommendations to show.</p>}
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return <div className="stat-card"><p>{label}</p><strong>{value}</strong></div>;
}

function NotFoundPage() {
  return (
    <main className="page-content narrow-content">
      <section className="card empty-state">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="button button-primary" to="/">Back to recommendations</Link>
      </section>
    </main>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

export default App;
