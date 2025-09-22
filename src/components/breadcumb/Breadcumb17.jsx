import { freelancer1 } from "@/data/product";
import { useParams } from "react-router-dom";

// Accept optional API data to render dynamic values while preserving layout
export default function Breadcumb17({ data: apiData }) {
  const { id } = useParams();

  const local = freelancer1.find((item) => item.id == id);
  const profile = apiData?.profile;
  const details = apiData?.profile_details;

  const img = profile?.profile_image || local?.img || "/images/team/fl-1.png";
  const name = profile?.name || local?.name || "N/A";
  const profession = profile?.bio ?? local?.title ?? "N/A";
  const location = details?.location ?? profile?.location ?? "N/A";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "N/A";

  return (
    <>
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 freelancer-single-style mx-auto maxw1700 pt120 pt60-sm pb120 pb60-sm bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img className="left-top-img wow zoomIn" src="/images/vector-img/left-top.png" alt="vector-img" />
          <img className="right-bottom-img wow zoomIn" src="/images/vector-img/right-bottom.png" alt="vector-img" />
          <div className="container">
            <div className="row wow fadeInUp">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>{local?.title || "Freelancer Profile"}</h2>

                  <div className="list-meta d-sm-flex align-items-center mt30">
                    <a className="position-relative freelancer-single-style">
                      <span className="online" />
                      <img
  className="rounded-circle w-200 mb15-sm"
  src={img}
  alt="Freelancer Photo"
  style={{ maxHeight: "150px", objectFit: "cover" }}
/>

                    </a>
                    <div className="ml20 ml0-xs">
                      <h5 className="title mb-1">{name}</h5>
                      <p className="mb-0">{profession || "N/A"}</p>
                      {/* Rating/Reviews removed as requested */}
                      <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                        <i className="flaticon-place vam fz20 me-2" /> {location}
                      </p>
                      <p className="mb-0 dark-color fz15 fw500 list-inline-item ml15 mb5-sm ml0-xs">
                        <i className="flaticon-30-days vam fz20 me-2" /> Member since {memberSince}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
