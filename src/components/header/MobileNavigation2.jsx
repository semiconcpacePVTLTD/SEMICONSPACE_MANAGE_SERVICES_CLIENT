import React from "react";
import { Link } from "react-router-dom";

function MobileUserEntry() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState("/icons/profile.png");

  React.useEffect(() => {
    const compute = () => {
      const token = localStorage.getItem("access_token");
      let auth = null;
      try {
        auth = JSON.parse(localStorage.getItem("auth"));
      } catch { }
      const loggedIn = Boolean(token) || Boolean(auth?.success);
      setIsLoggedIn(loggedIn);
      const avatar =
        auth?.data?.avatarUrl ||
        auth?.user?.avatarUrl ||
        auth?.avatarUrl ||
        auth?.data?.profileImage ||
        auth?.user?.profileImage ||
        auth?.profileImage ||
        "/icons/profile.png";
      setAvatarUrl(avatar);
    };
    compute();
    const onStorage = (e) => {
      if (["access_token", "auth", "isLoggedIn"].includes(e.key)) compute();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Link className="login-info" to="/login">
          Sign in
        </Link>
        <Link className="ud-btn btn-thm add-joining" to="/register">
          Join
        </Link>
      </div>
    );
  }

  return (
    <Link to="/dashboard/my-profile" className="d-flex align-items-center">
      <img
        src={avatarUrl}
        alt="avatar"
        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
        onError={(e) => {
          if (e.currentTarget.src !== "/icons/profile.png") {
            e.currentTarget.src = "/icons/profile.png";
          }
        }}
      />
    </Link>
  );
}

export default function MobileNavigation2() {
  return (
    <>
      <div className="mobilie_header_nav stylehome1">
        <div className="mobile-menu">
          <div className="header bdrb1">
            <div className="menu_and_widgets">
              <div className="mobile_menu_bar d-flex justify-content-between align-items-center">
                <Link className="mobile_logo" to="/home-2">
                  <img src="/images/header-logo3.svg" alt="Header Logo" />
                </Link>
                <div className="right-side text-end d-flex align-items-center gap-3">
                  {/* Auth-aware mobile avatar/sign-in */}
                  <MobileUserEntry />
                  <a
                    className="menubar ml30"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                  >
                    <img src="/images/mobile-dark-nav-icon.svg" alt="icon" />
                  </a>
                </div>
              </div>
            </div>
            <div className="posr">
              <div className="mobile_menu_close_btn">
                <span className="far fa-times" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
