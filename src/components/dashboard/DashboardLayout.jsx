import { useEffect, useState } from "react";
import axios from "axios";
import toggleStore from "@/store/toggleStore";
import DashboardHeader from "./header/DashboardHeader";
import DashboardSidebar from "./sidebar/DashboardSidebar";
import DashboardFooter from "./footer/DashboardFooter";

export default function DashboardLayout({ children, profile }) {
  const [resolvedProfile, setResolvedProfile] = useState(profile || null);

  useEffect(() => {
    setResolvedProfile(profile || null);
  }, [profile]);

  useEffect(() => {
    // If no profile was provided by the page, fetch minimal profile for sidebar
    const fetchProfile = async () => {
      try {
        if (resolvedProfile) return;
        const authData = JSON.parse(localStorage.getItem("auth"));
        const userId = authData?.data?.userId;
        if (!userId) return;
        const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;
        const response = await axios.post(`${BASE_URL}/profile-service/getdetails`, { user_id: userId });
        const apiData = response?.data;
        if (apiData?.profile) setResolvedProfile(apiData);
      } catch (e) {
        console.warn("Sidebar profile fetch skipped/failed:", e?.message || e);
      }
    };
    fetchProfile();
  }, [resolvedProfile]);

  const isActive = toggleStore((state) => state.isDasboardSidebarActive);

  return (
    <>
      <DashboardHeader />
      <div className="dashboard_content_wrapper">
        <div
          className={`dashboard dashboard_wrapper pr30 pr0-xl ${
            isActive ? "dsh_board_sidebar_hidden" : ""
          }`}
        >
          <DashboardSidebar profile={resolvedProfile} />
          <div className="dashboard__main pl0-md">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </>
  );
}

