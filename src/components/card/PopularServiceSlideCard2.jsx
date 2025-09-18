import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";
import { useEffect, useState } from "react";

export default function PopularServiceSlideCard2({ data }) {
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    setShowSwiper(true);
  }, []);

  return (
    <div className="listing-style1 list-style d-block d-xl-flex align-items-center p-3 border rounded shadow-sm">
      {/* Left: Image/Slider */}
      <div className="list-thumb flex-shrink-0 me-3" style={{ width: 250 }}>
        <div className="listing-thumbIn-slider position-relative navi_pagi_bottom_center slider-1-grid">
          {showSwiper && data?.imgURLs?.length > 0 ? (
            <Swiper
              navigation={{
                prevEl: ".btn__prev__018",
                nextEl: ".btn__next__018",
              }}
              modules={[Navigation, Pagination]}
              className="mySwiper"
              loop={true}
              pagination={{
                el: ".swiper__pagination__018",
                clickable: true,
              }}
            >
              {data.imgURLs.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    className="w-100 h-100 object-fit-cover rounded"
                    src={item}
                    alt="service thumbnail"
                    style={{ minHeight: 180 }}
                  />
                </SwiperSlide>
              ))}
              <div className="swiper__parent">
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <button className="swiper__btn swiper__btn-2 btn__prev__018">
                      <i className="far fa-arrow-left-long" />
                    </button>
                  </div>
                  <div className="col-auto">
                    <div className="swiper__pagination swiper__pagination-2 swiper__pagination__018"></div>
                  </div>
                  <div className="col-auto">
                    <button className="swiper__btn swiper__btn-2 btn__next__018">
                      <i className="far fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </Swiper>
          ) : (
            <div
              className="w-100 h-100 object-fit-cover bg-light rounded"
              style={{ minHeight: 180 }}
            />
          )}
        </div>
      </div>

      {/* Right: Service Info */}
      <div className="list-content flex-grow-1">
        <h5 className="list-title mb-2">
          <Link to={`/service/${data.id}`} className="text-dark fw-bold">
            {data.name}
          </Link>
        </h5>

        <p className="list-text text-muted mb-2">{data.description}</p>

        <div className="mb-2">
          <strong>Tools:</strong> <span>{data.tools}</span>
        </div>

        {data.milestoneRules && (
          <div className="milestones d-flex gap-3 small text-muted">
            <span>Advance: {data.milestoneRules.advance}</span>
            <span>Midway: {data.milestoneRules.midway}</span>
            <span>Final: {data.milestoneRules.final}</span>
          </div>
        )}

        <hr className="my-2" />

        {/* Call to Action */}
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/service/${data.id}`} className="btn btn-sm btn-primary">
            View Details
          </Link>
          <button className="btn btn-sm btn-outline-success">
            <i className="far fa-heart me-1" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
