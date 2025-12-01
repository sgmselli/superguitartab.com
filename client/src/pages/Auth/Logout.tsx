import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/auth";
import { Loading } from "../../components/Loading";

export const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };

    handleLogout();
  }, []);

  return (
    <div
        className="min-h-full w-full flex justify-center items-center"
    >
        <Loading />
    </div>
  ); 
};