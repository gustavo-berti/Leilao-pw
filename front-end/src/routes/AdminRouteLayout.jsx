import { Navigate, Outlet } from "react-router-dom";
import auth from "../utils/auth";

const AdminRouteLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        auth.hasRole(user, 'ROLE_ADMIN') ? <Outlet/> : <Navigate to="/" replace/>
    );
};

export default AdminRouteLayout;
