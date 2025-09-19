import { Link } from "react-router-dom";

export default function FreelancerAbout1({ data }) {
  const location = data?.profile_details?.location ?? data?.profile?.location ?? "N/A";
  const experience = data?.experience ?? "N/A";
  const rating = data?.rating ?? "N/A";
  const skills = data?.skills ?? [];
  const reviews = data?.reviews ?? [];
  const completedProjects = data?.completed_projects ?? "N/A";
  const hourlyRate = data?.profile_details?.hourly_rate
  const MemberSince = data?.profile_details?.created_at ?? "N/A";

  return (
    <>
      <div className="price-widget pt25 bdrs8">
        <h3 className="widget-title">
          {hourlyRate ? `${hourlyRate}` : "N/A"}
          <small className="fz15 fw500">/per hour</small>
        </h3>
        <div className="category-list mt20">
          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-place text-thm2 pe-2 vam" />
              Location
            </span>
            <span>{location}</span>
          </a>
          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-30-days text-thm2 pe-2 vam" />
              Member since
            </span>
            <span>{new Date(MemberSince).getFullYear()}</span>
          </a>
          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-calendar text-thm2 pe-2 vam" />
              Last Delivery
            </span>
            <span>5 days</span>
          </a>

          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-translator text-thm2 pe-2 vam" />
              Languages
            </span>
            <span>English</span>
          </a>
          <a className="d-flex align-items-center justify-content-between mb-3">
            <span className="text">
              <i className="flaticon-sliders text-thm2 pe-2 vam" />
              English Level
            </span>
            <span>Fluent</span>
          </a>
        </div>
        <div className="d-grid">
          <Link to="/contact" className="ud-btn btn-thm">
            Schedule meeting
            <i
              className="fal fa-video-camera"
              style={{ marginLeft: "8px", transform: "rotate(0deg)" }}
            />
          </Link>
        </div>
        <div className="d-grid mt-3">
          <Link to="/contact" className="ud-btn btn-thm">
            Initiate Project
            <i
              className="fal fa-rocket"
              style={{ marginLeft: "8px", transform: "rotate(0deg)" }}
            />
          </Link>
        </div>

      </div>
    </>
  );
}
