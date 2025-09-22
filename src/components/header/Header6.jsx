import { Link } from "react-router-dom";
import Navigation from "./Navigation";

import Mega from "./Mega";
import MobileNavigation5 from "./MobileNavigation5";

export default function Header6() {
  return (
    <>
      <header className="header-nav nav-innerpage-style bg-transparent zi9 position-relative main-menu border-0  ">
        <nav className="posr">
          <div className="container posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto px-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos">
                    <Link className="header-logo logo2" to="/">
                      <img src="/images/header-logo3.svg" alt="Header Logo" />
                    </Link>
                  </div>
                  <div className="home1_style">
                    <Mega />
                  </div>
                  <Navigation />
                </div>
              </div>
              <div className="col-auto px-0">
                <div className="d-flex align-items-center">
                  <a
                    className="login-info"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                  >
                    <span className="flaticon-loupe" />
                  </a>
                  <Link className="login-info mx10-lg mx30" to="/become-seller">
                    <span className="d-none d-xl-inline-block">Become a</span>{" "}
                    Seller
                  </Link>
                  <Link className="login-info mr10-lg mr30" to="/login">
                    Sign in
                  </Link>
                  <Link className="ud-btn btn-thm2 add-joining" to="/register">
                    Join
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <MobileNavigation5 />
    </>
  );
}
