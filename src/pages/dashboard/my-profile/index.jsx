import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MyProfileInfo from "@/components/dashboard/section/MyProfileInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
let __profileRequestInFlight = false;
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | My Profile",
};

export default function DasbPageMyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (__profileRequestInFlight) {
        console.log("Skipped duplicate profile request (in flight)");
        return;
      }
      __profileRequestInFlight = true;

      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const userId = authData?.data?.userId;
        if (!userId) {
          setError("Missing user session. Please sign in again.");
          Swal.fire({ icon: "error", title: "Not signed in", text: "Please log in to view your profile." });
          return;
        }

        const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;
        const response = await axios.post(`${BASE_URL}/profile-service/getdetails`, { user_id: userId });

        const apiData = response?.data;
        if (apiData?.profile) {
          setProfileData(apiData);
        } else {
          const msg = "Failed to load profile: missing data.";
          setError(msg);
          Swal.fire({ icon: "error", title: "Profile unavailable", text: msg });
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Unable to reach profile service.";
        console.error("Error fetching profile:", err);
        setError(msg);
        Swal.fire({ icon: "error", title: "Couldn’t load profile", text: msg });
      } finally {
        __profileRequestInFlight = false; // always release the lock
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout profile={profileData}>
        {/* Render content even on error so the page isn’t blank */}
        {!loading && profileData && <MyProfileInfo profile={profileData} />}
        {!loading && !profileData && (
          <div className="p30">
            <h4 className="mb10">My Profile</h4>
            <p className="text-muted mb0">
              {error ? error : "No profile data available."}
            </p>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
