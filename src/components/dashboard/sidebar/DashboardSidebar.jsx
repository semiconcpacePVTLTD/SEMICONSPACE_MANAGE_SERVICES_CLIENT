import { dasboardNavigation } from "@/data/dashboard";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function DashboardSidebar({ profile }) {
  console.log("Sidebar received profile:", profile);

  const { pathname } = useLocation();
  // When on message page, highlight Manage Project in sidebar
  const effectivePath = pathname === "/message" ? "/manage-projects" : pathname;

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
        localStorage.removeItem("auth");
        localStorage.removeItem("access_token");
        localStorage.setItem("isLoggedIn", "false");
        window.location.href = "/login";
      }
    });
  };

  // Compute role synchronously from provided profile or fallback to localStorage
  const authData = (() => {
    try { return JSON.parse(localStorage.getItem("auth")); } catch { return null; }
  })();
  const roleIdsRaw = profile?.profile?.role_id ?? authData?.data?.role_id ?? [];
  const isFreelancer = Array.isArray(roleIdsRaw)
    ? roleIdsRaw.includes(2)
    : Number(roleIdsRaw) === 2;

  // Filter: show Wallet only for freelancers; others see all except Wallet
  // Wallet visible for role_id 2 or 3
  const navigation = dasboardNavigation.filter((item) => {
    // derive role ids from profile or localStorage
    const roleIds = (() => {
      const fromProfile = profile?.profile?.role_id;
      if (fromProfile) return Array.isArray(fromProfile) ? fromProfile.map(Number) : [Number(fromProfile)];
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        const val = auth?.data?.role_id ?? auth?.data?.user?.role_id ?? auth?.role_id ?? auth?.user?.role_id;
        if (val == null) return [];
        return Array.isArray(val) ? val.map(Number) : [Number(val)];
      } catch {
        return [];
      }
    })();
    const canSeeWallet = roleIds.includes(2) || roleIds.includes(3);
    if (item.name === "Wallet" && !canSeeWallet) return false;
    return true;
  });

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      {/* Optional profile info at the top */}
      <div className="px30 py20 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src={profile?.profile?.profile_image || "/images/team/default-user.png"}
            alt="profile"
            className="rounded-circle"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div className="ml15">
            <h6 className="mb-0">{profile?.profile?.name || "User"}</h6>
            <small className="text-muted">{profile?.profile?.email}</small>
          </div>
        </div>
      </div>

      <div className="dashboard_sidebar_list">
        {navigation.map((item, i) => (
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
                className={`items-center ${effectivePath === item.path ? "-is-active" : ""}`}
              >
                {item.iconImg ? (
                  <img src={item.iconImg} alt="icon" className="mr15" style={{ width: 24, height: 24 }} />
                ) : (
                  <i className={`${item.icon} mr15`} />
                )}
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
