import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeoutMinutes = 120, warningMinutes = 1) => {
  const navigate = useNavigate();
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = warningMinutes * 60 * 1000;

  const logoutTimer = useRef(null);
  const warningTimer = useRef(null);
  const [showWarning, setShowWarning] = useState(false);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error en logout automático:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const resetTimers = useCallback(() => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
    setShowWarning(false);

    warningTimer.current = setTimeout(() => setShowWarning(true), timeoutMs - warningMs);
    logoutTimer.current = setTimeout(() => logout(), timeoutMs);
  }, [logout, timeoutMs, warningMs]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => document.addEventListener(event, resetTimers, true));

    resetTimers();

    return () => {
      clearTimeout(logoutTimer.current);
      clearTimeout(warningTimer.current);
      events.forEach((event) => document.removeEventListener(event, resetTimers, true));
    };
  }, [resetTimers]);

  const stayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetTimers();
  }, [resetTimers]);

  return { showWarning, stayLoggedIn };
};

export default useAutoLogout;
