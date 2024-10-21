import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthProvider";
import Inbox from "./components/Inbox";
import Sent from "./components/Sent";
import Archive from "./components/Archive";
import ComposeForm from "./components/ComposeForm";
import "./index.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/sent" element={<Sent />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/compose" element={<ComposeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
