// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('authtoken'); // Replace with your authentication check
  

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children; // If logged in, render the children (protected routes)
};

export default ProtectedRoute;
