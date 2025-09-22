import { Link } from "react-router-dom";
import Mega from "./Mega";
import MobileNavigation2 from "./MobileNavigation2";
import Navigation from "./Navigation";
import React from "react";

import { useLocation } from "react-router-dom";

export default function Header3({ services: propServices = [] }) {
  const { pathname } = useLocation();

  // Services state (fetch if not provided via props)
  const [services, setServices] = React.useState(propServices);
  const [servicesLoaded, setServicesLoaded] = React.useState(propServices.length > 0);

  // Auth state (same behavior as Header19)
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("/icons/profile.png");
  const closeMenuTimer = React.useRef(null);

  // Fetch services if not provided via props
  React.useEffect(() => {
    if (servicesLoaded) return; // Don't fetch if already provided via props

    const fetchServices = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_BACKEND_HOST_ADMIN}:${import.meta.env.VITE_BACKEND_CATALOG_PORT}/catalog-service/listServices`
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const result = await response.json();

        const allServices = result?.data || [];
        setServices(allServices);
        setServicesLoaded(true);
      } catch (err) {
        console.error("Error fetching services for Header3:", err);
        setServicesLoaded(true);
      }
    };

    fetchServices();
  }, [servicesLoaded]);

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
    window.location.href = "/login";
  };

  React.useEffect(() => {
    return () => {
      if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    };
  }, []);

  return (
    <>
      <header className="header-nav nav-innerpage-style main-menu  ">
        <nav className="posr">
          <div className="container-fluid posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto pe-0">
                <div className="d-flex align-items-center">
                  <Link className="header-logo bdrr1 pr30 pr5-xl" to="/">
                    <img
                      className="w-100 h-100 object-fit-contain"
                      src="/images/header-logo-dark.svg"
                      alt="Header Logo"
                    />
                  </Link>
                  {/* <div className="home1_style">
                    <Mega />
                  </div> */}
                </div>
              </div>
              <div className="col-auto" style={{ marginRight: "80px" }}>
                <div className="d-flex align-items-center">
                  <Navigation services={services} />
                  {/* <a
                    className="login-info bdrl1 pl15-lg pl30"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    <span className="flaticon-loupe" />
                  </a> */}
                  {/* <Link
                    className={`login-info mx15-lg mx30 ${
                      pathname === "/become-seller" ? "ui-active" : ""
                    }`}
                    to="/become-seller"
                  >
                    <span className="d-none d-xl-inline-block">Become a</span>{" "}
                    Seller
                  </Link> */}

                  {/* If NOT logged in */}
                  {!isLoggedIn && (
                    <>
                      <Link
                        className={`login-info mr15-lg mr30 ${pathname === "/login" ? "ui-active" : ""
                          }`}
                        to="/login"
                      >
                        Sign in
                      </Link>
                      <Link className="ud-btn btn-thm add-joining" to="/register">
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
                        {/* Prefer real avatar if present; else show initial-in-circle (Header19 style) */}
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
                        <span>{username}</span>
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
