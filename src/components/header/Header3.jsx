import { Link } from "react-router-dom";
import Mega from "./Mega";
import MobileNavigation2 from "./MobileNavigation2";
import Navigation from "./Navigation";

import { useLocation } from "react-router-dom";

export default function Header3() {
  const { pathname } = useLocation();
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
                  <Navigation />
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
                  <Link
                    className={`login-info mr15-lg mr30 ${
                      pathname === "/login" ? "ui-active" : ""
                    }`}
                    to="/login"
                  >
                    Sign in
                  </Link>
                  <Link className="ud-btn btn-thm add-joining" to="/register">
                    Join
                  </Link>
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
