import { Route, Routes } from "react-router-dom";

// pages
import RegistrationPage from "./pages/authentication/register";
import LoginPage from "./pages/authentication/login";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
