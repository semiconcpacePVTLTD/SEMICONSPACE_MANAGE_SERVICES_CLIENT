import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MyProfileInfo from "@/components/dashboard/section/MyProfileInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | My Profile",
};

export default function DasbPageMyProfile() {

   const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
  const fetchProfile = async () => {
            console.log("in function");

    try {
                        console.log("in try function");

           const authData = JSON.parse(localStorage.getItem("auth"));
      const userId = authData?.data?.userId;
      if (!userId) return;

                  console.log("in userid function");

      const BASE_URL = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PROFILE_PORT}`;
      const response = await axios.post(`${BASE_URL}/profile-service/getdetails`, {
        user_id: userId,
      });

      if (response.data.success) {
        console.log("Fetched profile:", response.data.data);
        setProfileData(response.data.data); // store profile data
      } else {
        console.error("Failed to fetch profile:", response.data.message);
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
