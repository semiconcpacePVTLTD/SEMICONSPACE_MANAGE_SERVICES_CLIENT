import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileNavigation2 from "@/components/header/MobileNavigation2";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = { title: "Wallet" };

export default function DashboardWalletPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const userId = authData?.data?.userId;
        if (!userId) {
          setError("Missing user session. Please sign in again.");
          Swal.fire({ icon: "error", title: "Not signed in", text: "Please log in to view your wallet." });
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
          Swal.fire({ icon: "error", title: "Wallet unavailable", text: msg });
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Unable to reach profile service.";
        console.error("Error fetching wallet profile:", err);
        setError(msg);
        Swal.fire({ icon: "error", title: "Couldn’t load wallet", text: msg });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const balance = profileData?.profile_details?.wallet_balance ?? "0.00";
  const user = profileData?.profile;

  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout profile={profileData}>
        <div className="dashboard__content hover-bgc-color">
          <h4 className="mb20 d-flex align-items-center">
            <i className="flaticon-review-1 mr10" /> Wallet
          </h4>

          {/* Unique wallet card */}
          <div
            className="position-relative mb30"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
              borderRadius: 16,
              color: "#fff",
              padding: 24,
              boxShadow: "0 10px 30px rgba(99,102,241,0.35)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, background: "rgba(255,255,255,0.12)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", left: -60, bottom: -60, width: 220, height: 220, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />

            <div className="d-flex justify-content-between align-items-start position-relative" style={{ zIndex: 1 }}>
              <div>
                <div className="text-uppercase mb5" style={{ opacity: 0.85, letterSpacing: 1 }}>Available Balance</div>
                <div className="d-flex align-items-end">
                  <h1 className="mb0" style={{ fontWeight: 800, fontSize: 42 }}>₹ {Number(balance || 0).toFixed(2)}</h1>
                </div>
                <div className="mt10" style={{ opacity: 0.9 }}>
                  <small>Last updated: {user?.modified_at ? new Date(user.modified_at).toLocaleString() : "—"}</small>
                </div>
              </div>
              <div className="text-right">
                <div className="d-flex align-items-center mb10">
                  <img
                    alt="profile"
                    src={user?.profile_image || "/images/team/default-user.png"}
                    className="rounded-circle mr10"
                    style={{ width: 46, height: 46, objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }}
                  />
                  <div>
                    <div className="fw600">{user?.name || "User"}</div>
                    <small style={{ opacity: 0.85 }}>{user?.email}</small>
                  </div>
                </div>
                <div className="badge" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", padding: "6px 10px", borderRadius: 8 }}>
                  Freelancer
                </div>
              </div>
            </div>
          </div>

          {/* Profile summary */}
          {profileData && (
            <div className="row">
              <div className="col-lg-6 mb20">
                <div className="border rounded p20">
                  <h6 className="mb15">Profile</h6>
                  <ul className="list-unstyled mb0">
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Name</span><span className="fw600">{user?.name}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Email</span><span className="fw600">{user?.email}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Phone</span><span className="fw600">{user?.phone || "—"}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Status</span><span className="fw600">{user?.status ? "Active" : "Inactive"}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Joined</span><span className="fw600">{user?.created_at ? new Date(user.created_at).toLocaleString() : "—"}</span></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 mb20">
                <div className="border rounded p20">
                  <h6 className="mb15">Verification</h6>
                  <ul className="list-unstyled mb0">
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">PAN</span><span className="fw600">{profileData?.profile_details?.pan_number || "—"} {profileData?.profile_details?.pan_verified ? "✅" : "❌"}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Verified</span><span className="fw600">{profileData?.profile_details?.verified ? "Yes" : "No"}</span></li>
                    <li className="d-flex justify-content-between mb10"><span className="text-muted">Remarks</span><span className="fw600">{profileData?.profile_details?.remarks || "—"}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!loading && !profileData && (
            <div className="border rounded p20">
              <h6 className="mb10">Wallet</h6>
              <p className="text-muted mb0">{error ? error : "No profile data available."}</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}