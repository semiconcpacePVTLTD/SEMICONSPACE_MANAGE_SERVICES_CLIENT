import React from "react";
import Navigation from "./Navigation";
import useStickyMenu from "@/hook/useStickyMenu";

import { Link } from "react-router-dom";

export default function Header14() {
  const sticky = useStickyMenu(50);

  return (
    <header
      className={`header-nav nav-homepage-style at-home3  stricky  stricky main-menu border-0 animated  ${
        sticky ? "slideInDown stricky-fixed" : "slideIn"
      }`}
    >
      <nav className="posr">
        <div className="container posr">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto px-0 px-xl-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="logos">
                  <Link className="header-logo logo1" to="/">
                    <img src="/images/header-logo-dark.svg" alt="Header Logo" />
                  </Link>
                  <Link className="header-logo logo2" to="/">
                    <img src="/images/header-logo-dark.svg" alt="Header Logo" />
                  </Link>
                </div>

                <Navigation />
              </div>
            </div>
            <div className="col-auto pe-0 pe-xl-3">
              <div className="d-flex align-items-center">
                <Link className="login-info mx15-xl mx30" to="/become-seller">
                  <span className="d-none d-xl-inline-block">Become a</span>{" "}
                  Seller
                </Link>
                <Link
                  className="login-info mr15-xl mr10 ud-btn btn-dark add-joining bdrs12 dark-color bg-transparent"
                  to="/login"
                >
                  Sign in
                </Link>
                <Link
                  className="ud-btn btn-dark add-joining bdrs12 text-white"
                  to="/register"
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
