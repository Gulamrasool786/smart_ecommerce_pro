import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const { isAuthenticated, user, loading} = useAuthStore();

  if(loading){
    return (
      <div className="py-20 text-center text-xl font-semibold">
        Checking authentication status...

      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;