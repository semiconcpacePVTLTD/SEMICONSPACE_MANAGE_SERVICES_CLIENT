import DashboardNavigation from "../header/DashboardNavigation";
import Award from "./Award";
import ChangePassword from "./ChangePassword";
import ConfirmPassword from "./ConfirmPassword";
import Education from "./Education";
import ProfileDetails from "./ProfileDetails";
import Skill from "./Skill";
import WorkExperience from "./WorkExperience";

export default function MyProfileInfo({ profile }) {
  // Normalize role_id and nested shape safely
  const roleId = Array.isArray(profile?.profile?.role_id)
    ? profile.profile.role_id
    : profile?.profile?.role_id != null
      ? [profile.profile.role_id]
      : [];
  const isCustomer = roleId.includes(1);
  const isFreelancer = roleId.includes(2);

  // If no profile data yet, avoid rendering children that depend on it
  if (!profile || !profile.profile) {
    return null;
  }

  return (
    <>
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <DashboardNavigation />
          </div>
          <div className="col-lg-9">
            <div className="dashboard_title_area">
              <h2>My Profile</h2>
              <p className="text">Your profile is your digital handshake – make it count!</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <ProfileDetails profile={profile.profile} details={profile.profile_details} isCustomer={isCustomer} canEditDetails={!isCustomer && isFreelancer} />

          </div>
        </div>
      </div>
    </>
  );
}
