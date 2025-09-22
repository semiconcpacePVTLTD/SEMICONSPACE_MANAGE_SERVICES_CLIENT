import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useState } from "react";

export default function BestServiceCard1({ data }) {
  const [isFavActive, setFavActive] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <div className={`listing-style1 `}>
        <div className="list-thumb">
          <img
            className="w-100 h-auto object-fit-cover"
            src={data.img}
            alt="thumbnail"
          />
          <a
            onClick={() => setFavActive(!isFavActive)}
            className={`listing-fav fz12 ${isFavActive ? "ui-fav-active" : ""}`}
          >
            <span className="far fa-heart" />
          </a>
        </div>
        <div className="list-content px20">
          <p className="list-text body-color fz14 mb-1">{data.category}</p>
          <h5 className="list-title">
            <Link to={`/service-single/${data.id}`}>
              {data.title.slice(0, 40) + "..."}
            </Link>
          </h5>
          <div className="review-meta d-flex align-items-center">
            <i className="fas fa-star fz10 review-color me-2" />
            <p className="mb-0 body-color fz14">
              <span className="dark-color me-2">{data.rating}</span>
              {data.review} reviews
            </p>
          </div>
          <hr className="my-2" />
          <div className="list-meta d-flex justify-content-between align-items-center mt15">
            <Link className="d-flex" to="/">
              <span className="position-relative mr10">
                <img
                  className="rounded-circle wa"
                  src={data.author.img}
                  alt="Freelancer Photo"
                />
                <span className="online-badges" />
              </span>
              {pathname !== "/service-6" && pathname === "/service-all" && (
                <span className="fz14">{data.author.name}</span>
              )}
            </Link>
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
