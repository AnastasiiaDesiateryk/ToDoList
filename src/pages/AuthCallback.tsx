import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AuthCallback: React.FC = () => {
  const nav = useNavigate();
  const { refreshMe } = useAuth();

  useEffect(() => {
    // /api/me
    (async () => {
      await refreshMe();
      nav("/", { replace: true });
    })();
  }, [nav, refreshMe]);

  return null; // spiner?
};

export default AuthCallback;
