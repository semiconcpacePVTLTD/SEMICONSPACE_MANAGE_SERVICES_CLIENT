import React from "react";
import Navigation from "./Navigation";
import Mega from "./Mega";
import MobileNavigation2 from "./MobileNavigation2";
import useStickyMenu from "@/hook/useStickyMenu";
import { Link } from "react-router-dom";

export default function Header19({ service, services }) {
  const sticky = useStickyMenu(50);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("/icons/profile.png");
  const closeMenuTimer = React.useRef(null);

  React.useEffect(() => {
    const computeAuthState = () => {
      const token = localStorage.getItem("access_token");
      let auth = null;
      try {
        auth = JSON.parse(localStorage.getItem("auth"));
      } catch { }

      const loggedIn = Boolean(token) || Boolean(auth?.success);
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        // Try several common name paths
        const name = auth?.data?.name || auth?.user?.name || auth?.name || "User";
        const avatar =
          auth?.data?.avatarUrl ||
          auth?.user?.avatarUrl ||
          auth?.avatarUrl ||
          auth?.data?.profileImage ||
          auth?.user?.profileImage ||
          auth?.profileImage ||
          "/icons/profile.png";
        setUsername(name);
        setAvatarUrl(avatar);
      } else {
        setUsername("");
        setAvatarUrl("/icons/profile.png");
      }
    };

    computeAuthState();

    // Keep header in sync when localStorage changes in other tabs/windows
    const onStorage = (e) => {
      if (["access_token", "auth", "isLoggedIn"].includes(e.key)) {
        computeAuthState();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const openUserMenu = React.useCallback(() => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
    setShowUserMenu(true);
  }, []);

  const scheduleCloseUserMenu = React.useCallback(() => {
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    closeMenuTimer.current = setTimeout(() => setShowUserMenu(false), 200);
  }, []);

  const toggleUserMenu = React.useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("access_token");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    window.location.href = "/login"; // redirect
  };

  React.useEffect(() => {
    return () => {
      if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    };
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style at-home18 stricky main-menu border-0 animated 
          ${sticky ? "slideInDown stricky-fixed" : "slideIn"}`}
      >
        <nav className="posr">
          <div className="container posr">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto px-0 px-xl-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos">
                    <Link className="header-logo logo1" to="/">
                      <img
                        src="/images/header-logo-white.svg"
                        alt="Header Logo"
                      />
                    </Link>
                    <Link className="header-logo logo2" to="/">
                      <img src="/images/header-logo2.svg" alt="Header Logo" />
                    </Link>
                  </div>

                  <Navigation services={services} />
                </div>
              </div>

              <div className="col-auto pe-0">
                <div className="d-flex align-items-center">
                  {/* If NOT logged in */}
                  {!isLoggedIn && (
                    <>
                      <Link
                        className="login-info mr10 home18-sign-btn px30 py-1 bdrs120"
                        to="/login"
                      >
                        Sign in
                      </Link>
                      <Link
                        className="ud-btn btn-white add-joining home18-join-btn bdrs120"
                        to="/register"
                      >
                        Join
                      </Link>
                    </>
                  )}

                  {/* If logged in */}
                  {isLoggedIn && (
                    <div
                      className="ms-3 position-relative author-dropdown"
                      onMouseEnter={openUserMenu}
                      onMouseLeave={scheduleCloseUserMenu}
                      style={{ position: "relative" }}
                    >
                      <div
                        className="author-logo d-flex align-items-center"
                        onClick={toggleUserMenu}
                        role="button"
                        aria-haspopup="menu"
                        aria-expanded={showUserMenu}
                      >
                        {/* Prefer real avatar if present; else show initial-in-circle */}
                        {avatarUrl && avatarUrl !== "/icons/profile.png" ? (
                          <img
                            src={avatarUrl}
                            alt="avatar"
                            className="bdrs50 me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              cursor: "pointer",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              // Fallback to initial circle by clearing avatarUrl on error
                              if (e.currentTarget.src !== "/icons/profile.png") {
                                e.currentTarget.src = "/icons/profile.png";
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="bdrs50 me-2 d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              cursor: "pointer",
                              borderRadius: "50%",
                              objectFit: "cover",
                              backgroundColor: "#4caf50",
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: "18px",
                              textTransform: "uppercase",
                            }}
                          >
                            {username?.charAt(0) || "U"}
                          </div>
                        )}

                        <span style={{ color: sticky ? "var(--headings-color)" : "#fff" }}>{username}</span>
                      </div>

                      <ul
                        className="dropdown-menu shadow-sm"
                        style={{
                          display: showUserMenu ? "block" : "none",
                          position: "absolute",
                          right: 0,
                          top: "48px",
                          minWidth: "160px",
                          background: "#fff",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "8px",
                          padding: "8px 0",
                          zIndex: 1000,
                          listStyle: "none",
                        }}
                      >
                        <li>
                          <Link
                            to="/dashboard/my-profile"
                            onClick={() => setShowUserMenu(false)}
                            className="dropdown-item"
                            style={{
                              padding: "8px 16px",
                              display: "block",
                              color: "inherit",
                              textDecoration: "none",
                            }}
                          >
                            My Account
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item"
                            style={{
                              padding: "8px 16px",
                              display: "block",
                              color: "inherit",
                              textDecoration: "none",
                              background: "none",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                            }}
                          >
                            <i className="fa-solid fa-right-from-bracket me-2" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <MobileNavigation2 />
    </>
  );
}
