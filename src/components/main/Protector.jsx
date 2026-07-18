import { Navigate, Outlet } from "react-router-dom";

const Protector = ({ user, reverse = false, redirect = "/login" }) => {

    if (!reverse && !user) {
        return (
            <Navigate to={redirect} />
        );
    }
    if (reverse && user) {
        return (
            <Navigate to={redirect} />
        );
    }
    return <Outlet />;
};

export default Protector;