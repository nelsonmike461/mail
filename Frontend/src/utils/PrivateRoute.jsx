import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;