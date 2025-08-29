import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        user ? <Outlet/> : <Navigate to="/" replace/>
    );
};

export default PrivateRouteLayout;
