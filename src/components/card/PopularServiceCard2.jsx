import { Link } from "react-router-dom";

import { useState } from "react";

export default function PopularServiceCard2({ data, text1 = false }) {
  const [isFavActive, setFavActive] = useState(false);

  return (
    <>
      <div className="listing-style1 listi-style2 d-block d-xl-flex">
        <div className="list-thumb flex-shrink-0">
          <img
            className="w-100 h-100 object-fit-cover"
            src={data.img2}
            alt="image"
          />
        </div>
        <div className="list-content flex-grow-1 ms-1">
          <a
            onClick={() => setFavActive(!isFavActive)}
            className={`listing-fav fz12 ${isFavActive ? "ui-fav-active" : ""}`}
          >
            <span className="far fa-heart" />
          </a>
          <p className="list-text body-color fz14 mb-1">{data.category}</p>

          <h5 className="list-title">
            <Link to={`/service-single/${data.id}`}>{data.title}</Link>
          </h5>
          {text1 && (
            <p className="list-text body-color fz15 mb-1">
              I can assist you in designing clean and minimal UI UX for your
              website in Adobe XD or <br /> Figma.
            </p>
          )}

          <div className="review-meta d-flex align-items-center">
            <i className="fas fa-star fz10 review-color me-2" />
            <p className="mb-0 body-color fz14">
              <span className="dark-color me-2">{data.rating}</span>
              {data.review} reviews
            </p>
          </div>
          <hr className="my-2" />
          <div className="list-meta d-flex justify-content-between align-items-center mt15">
            <a>
              <span className="position-relative mr10">
                <img
                  className="rounded-circle object-fit-contain"
                  src={data.author.img}
                  alt="Freelancer Photo"
                />
                <span className="online-badge" />
              </span>
              <span className="fz14">{data.author.name}</span>
            </a>
            <div className="budget">
              <p className="mb-0 body-color">
                Starting at
                <span className="fz17 fw500 dark-color ms-1">
                  ${data.price}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
