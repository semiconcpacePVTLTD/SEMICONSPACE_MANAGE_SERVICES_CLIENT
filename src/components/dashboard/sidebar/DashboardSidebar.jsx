import { dasboardNavigation } from "@/data/dashboard";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="dashboard__sidebar d-none d-lg-block">
        <div className="dashboard_sidebar_list">
          <p className="fz15 fw400 ff-heading pl30">Start</p>
          {dasboardNavigation.slice(0, 8).map((item, i) => (
            <div key={i} className="sidebar_list_item mb-1">
              <Link
                to={item.path}
                className={`items-center ${
                  pathname === item.path ? "-is-active" : ""
                }`}
              >
                <i className={`${item.icon} mr15`} />
                {item.name}
              </Link>
            </div>
          ))}

          {/* <p className="fz15 fw400 ff-heading pl30 mt30">Organize and Manage</p> */}

          {dasboardNavigation.slice(8, 13).map((item, i) => (
            <div key={i} className="sidebar_list_item mb-1">
              <Link
                to={item.path}
                className={`items-center ${
                  pathname === item.path ? "-is-active" : ""
                }`}
              >
                <i className={`${item.icon} mr15`} />
                {item.name}
              </Link>
            </div>
          ))}

          {/* <p className="fz15 fw400 ff-heading pl30 mt30">Account</p> */}
          {dasboardNavigation.slice(13, 15).map((item, i) => (
            <div key={i} className="sidebar_list_item mb-1">
              <Link
                to={item.path}
                className={`items-center ${
                  pathname === item.path ? "-is-active" : ""
                }`}
              >
                <i className={`${item.icon} mr15`} />
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
