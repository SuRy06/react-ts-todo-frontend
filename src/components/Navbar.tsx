import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const { isLoggedIn, signIn, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Throttled scroll handler prevents excessive re-renders
  const handleScroll = useCallback(() => {
    if (throttleTimerRef.current) return;

    const newScrolled = window.scrollY > 8;
    setIsScrolled(newScrolled);

    throttleTimerRef.current = setTimeout(() => {
      throttleTimerRef.current = null;
    }, 100); // Throttle to max once per 100ms
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/">Todo App</NavLink>
        </div>
        <div className="navbar-menu">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link${isActive ? "active" : ""}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/todos"
            className={({ isActive }) => `nav-link${isActive ? "active" : ""}`}
            end
          >
            Todos
          </NavLink>
        </div>
        <div className="navbar-auth">
          {isLoggedIn ? (
            <button onClick={signOut} className="btn btn-danger">
              Sign Out
            </button>
          ) : (
            <button onClick={signIn} className="btn btn-primary">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
