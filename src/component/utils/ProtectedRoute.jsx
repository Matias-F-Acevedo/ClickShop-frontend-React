import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate, Outlet} from "react-router-dom";

const ProtectedRouterIfNotUser = ({ redirectPath }) => {
    const { user } = useContext(UserContext);
    
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    
    return <Outlet />;
  };
  
  const ProtectedRouterIfUser = ({ redirectPath }) => {
    const { user } = useContext(UserContext);
    
    if (user) {
      return <Navigate to={redirectPath} replace />;
    }
    
    return <Outlet />;
  };
  
  export { ProtectedRouterIfNotUser, ProtectedRouterIfUser };