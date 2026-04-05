import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import DashboardApp from "./DashboardApp";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<DashboardApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
