import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Inbox from "./components/Inbox";
import Sent from "./components/Sent";
import Archive from "./components/Archive";
import ComposeForm from "./components/ComposeForm";
import "./index.css";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <PrivateRoute>
                <Inbox />
              </PrivateRoute>
            }
          />
          <Route
            path="/sent"
            element={
              <PrivateRoute>
                <Sent />
              </PrivateRoute>
            }
          />
          <Route
            path="/archive"
            element={
              <PrivateRoute>
                <Archive />
              </PrivateRoute>
            }
          />
          <Route
            path="/compose"
            element={
              <PrivateRoute>
                <ComposeForm />
              </PrivateRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
