import { Link } from "react-router-dom";

export default function FreelancerCard1({ data }) {
  const tags = Array.isArray(data.tags) ? data.tags.slice(0, 3) : [];
  const location = data.location || "";
  const jobSuccess = typeof data.jobSuccess === "number" ? data.jobSuccess : undefined;
  console.log("FreelancerCard1 data:", data);
  return (
    <>
      <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
        <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
          <img className="rounded-circle mx-auto" src={data.profile_image || data.img} alt="thumb" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
          <span className="online" />
        </div>
        <div className="details">
          <h5 className="title mb-1">{data?.name ?? "N/A"}</h5>
          <p className="mb-0">{data?.profession ?? "N/A"}</p>

          <div className="skill-tags d-flex align-items-center justify-content-center mb5">
            {tags.length ? (
              tags.map((t, i) => (
                <span key={i} className={`tag${i === 1 ? " mx10" : ""}`}>{t}</span>
              ))
            ) : (
              <>
                <span className="tag">N/A</span>
              </>
            )}
          </div>
          <hr className="opacity-100 mt20 mb15" />
          <div className="fl-meta d-flex align-items-center justify-content-between">
            <a className="meta fw500 text-start">
              Location
              <br />
              <span className="fz14 fw400">{location ? location : "N/A"}</span>
            </a>
            <a className="meta fw500 text-start">
              Rate
              <br />
              <span className="fz14 fw400">{(data?.price ?? null) !== null ? `$${data.price} / hr` : "N/A"}</span>
            </a>
            <a className="meta fw500 text-start">
              Job Success
              <br />
              <span className="fz14 fw400">{typeof jobSuccess === "number" ? `${jobSuccess}%` : "N/A"}</span>
            </a>
          </div>
          <div className="d-grid mt15">
            <Link
              to={`/freelancer-single/${data.id}`}
              className="ud-btn btn-light-thm"
            >
              View Profile
              <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
