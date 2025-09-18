import { dasboardNavigation } from "@/data/dashboard";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function DashboardSidebar() {
  const { pathname } = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // clear auth data
        localStorage.removeItem("auth");
        localStorage.removeItem("access_token");
        localStorage.setItem("isLoggedIn", "false");

        // redirect to login
        window.location.href = "/login";
      }
    });
  };

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        <p className="fz15 fw400 ff-heading pl30">Start</p>
        {dasboardNavigation.map((item, i) => (
          <div key={i} className="sidebar_list_item mb-1">
            {item.name === "Logout" ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="items-center"
              >
                <i className={`${item.icon} mr15`} />
                {item.name}
              </a>
            ) : (
              <Link
                to={item.path}
                className={`items-center ${pathname === item.path ? "-is-active" : ""}`}
              >
                <i className={`${item.icon} mr15`} />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
