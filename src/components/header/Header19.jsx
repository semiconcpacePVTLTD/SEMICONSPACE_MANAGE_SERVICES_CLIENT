import React from "react";
import Navigation from "./Navigation";
import Mega from "./Mega";
import MobileNavigation2 from "./MobileNavigation2";
import useStickyMenu from "@/hook/useStickyMenu";

import { Link } from "react-router-dom";

export default function Header19() {
  const sticky = useStickyMenu(50);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const closeMenuTimer = React.useRef(null);

  const openUserMenu = React.useCallback(() => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
    setShowUserMenu(true);
  }, []);

  const scheduleCloseUserMenu = React.useCallback(() => {
    if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    closeMenuTimer.current = setTimeout(() => setShowUserMenu(false), 200); // small delay prevents flicker
  }, []);

  const toggleUserMenu = React.useCallback(() => {
    if (showUserMenu) {
      setShowUserMenu(false);
      return;
    }
    openUserMenu();
  }, [showUserMenu, openUserMenu]);

  React.useEffect(() => {
    return () => {
      if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
    };
  }, []);
  return (
    <>
      <header
        className={`header-nav nav-homepage-style at-home18 stricky main-menu border-0 animated 
    ${sticky ? "slideInDown stricky-fixed" : "slideIn"}
    `}
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
                  <div className="home1_style at-home18 mx20">
                    {/* <Mega
                      staticMenuClass={
                        "text-white d-flex justify-content-center align-items-center"
                      }
                    /> */}
                  </div>

                  <Navigation />
                </div>
              </div>
             <div className="col-auto pe-0">
  <div className="d-flex align-items-center">
    {/* Sign in */}
    <Link
      className="login-info mr10 home18-sign-btn px30 py-1 bdrs120"
      to="/login"
    >
      Sign in
    </Link>

    {/* Join */}
    <Link
      className="ud-btn btn-white add-joining home18-join-btn bdrs120"
      to="/register"
    >
      Join
    </Link>

    {/* Author profile with dropdown */}
    <div
      className="ms-3 position-relative author-dropdown"
      onMouseEnter={openUserMenu}
      onMouseLeave={scheduleCloseUserMenu}
      style={{ position: "relative" }}
    >
      <div className="author-logo" onClick={toggleUserMenu} role="button" aria-haspopup="menu" aria-expanded={showUserMenu}>
        <img
          src="/icons/profile.png"
          alt="author"
          className="bdrs50"
          style={{ width: "40px", height: "40px", cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
        />
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
          <Link to="/dashboard/my-profile" onClick={() => setShowUserMenu(false)} className="dropdown-item" style={{ padding: "8px 16px", display: "block", color: "inherit", textDecoration: "none" }}>
            My Account
          </Link>
        </li>
        <li>
          <Link to="/login" onClick={() => setShowUserMenu(false)} className="dropdown-item" style={{ padding: "8px 16px", display: "block", color: "inherit", textDecoration: "none" }}>
            <i className="fa-solid fa-right-from-bracket me-2" aria-hidden="true"></i>
            Logout
          </Link>
        </li>
      </ul>
    </div>
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
