import { Link } from "react-router-dom";

export default function JobCard4({ data }) {
  return (
    <>
      <div className="job-list-style1 bdr1">
        <div className="icon d-flex align-items-center mb20">
          <img className="wa" src={data.img} alt="img" />
          <h6 className="mb-0 text-thm ml20">{data.server}</h6>
          <span className="fav-icon flaticon-star" />
        </div>
        <div className="details">
          <h5 className="mb20">
            <Link to={`/job-single/${data.id}`}>{data.title}</Link>
          </h5>
          {data.benefits.map((item, index) => (
            <p
              key={index}
              className={`list-inline-item c ${
                index !== 0 ? "bdrl1 pl10" : ""
              }`}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
