import { Route, Routes } from "react-router-dom";

// pages
import RegistrationPage from "./pages/authentication/register";
import LoginPage from "./pages/authentication/login";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
