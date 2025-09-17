import { useEffect, useRef, useState } from "react";
import axios from "axios";
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

   useEffect(() => {
    // Guard against double-invoke in React 18 StrictMode (dev only)
    const didRunRef = { current: false };

   const fetchProfile = async () => {
  if (didRunRef.current) return;
  didRunRef.current = true;

  try {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const userId = authData?.data?.userId;
    if (!userId) return;

    const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;

    if (__profileRequestInFlight) {
      console.log("Skipped duplicate profile request (in flight)");
      return;
    }
    __profileRequestInFlight = true;

    const response = await axios.post(`${BASE_URL}/profile-service/getdetails`, {
      user_id: userId,
    });
    __profileRequestInFlight = false;

    // ✅ Adapt to API shape
    const apiData = response?.data;
    if (apiData?.profile) {
      console.log("Fetched profile:", apiData);
      setProfileData(apiData);
    } else {
      console.error("Failed to fetch profile: Missing profile data");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  } finally {
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
        {!loading && profileData && <MyProfileInfo profile={profileData} />}
      </DashboardLayout>
    </>
  );
}
