import FsLightbox from "fslightbox-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Breadcumb4() {
  const [toggler, setToggler] = useState(false);

  const { pathname } = useLocation();

  return (
    <>
      <section className="breadcumb-section pt-0">
        <div
          className={`cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center px30-lg ${
            pathname === "/service-1"
              ? "cta-service-v1 mx20-lg"
              : pathname === "/service-2"
              ? "cta-service-v2"
              : pathname === "/service-5"
              ? "cta-service-v1 mb55 mx0"
              : ""
          }`}
        >
          <img
            className="left-top-img wow zoomIn"
            src="/images/vector-img/left-top.png"
            alt="vector-img"
          />
          <img
            className="right-bottom-img wow zoomIn"
            src="/images/vector-img/right-bottom.png"
            alt="vector-img"
          />
          <img
            className="service-v1-vector bounce-y d-none d-lg-block"
            src="/images/vector-img/vector-service-v1.png"
            alt="vector-img"
          />

          <div className="container">
            <div className="row wow fadeInUp">
              <div
                className={`${
                  pathname === "/service-5" ? "col-xl-8" : "col-xl-5 "
                } `}
              >
                <div
                  className={`position-relative ${
                    pathname === "/service-5" ? "pl80 pl0-sm" : ""
                  }`}
                >
                  <h2>Design &amp; Creative</h2>
                  <p className="text mb30">
                    Give your visitor a smooth online experience with a solid UX
                    design
                  </p>
                  <div className="d-flex align-items-center">
                    <a
                      onClick={() => setToggler(!toggler)}
                      className="video-btn mr10 popup-iframe popup-youtube"
                    >
                      <i className="fal fa-play" />
                    </a>
                    <h6 className="mb-0">How Freeio Works</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FsLightbox
        toggler={toggler}
        sources={["https://www.youtube.com/watch?v=7EHnQ0VM4KY"]}
      />
    </>
  );
}
