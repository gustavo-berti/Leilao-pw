import { Navigate, Outlet } from "react-router-dom";
import Auth from "../utils/auth";

const AdminRouteLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        Auth.hasRole(user, 'ROLE_ADMIN') ? <Outlet/> : <Navigate to="/" replace/>
    );
};

export default AdminRouteLayout;
