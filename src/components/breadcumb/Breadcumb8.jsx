import React from "react";

export default function Breadcumb8({ service, loading }) {
  const title = service?.name || (loading ? "Loading..." : "Service");
  const authorName = service?.createdBy || "Unknown";

  return (
    <>
      <section className="breadcumb-section pt-0">
        <div className="cta-service-single cta-banner mx-auto maxw1700 pt120 pt60-sm pb120 pb60-sm bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img
            className="left-top-img wow zoomIn"
            src="/images/vector-img/left-top.png"
            alt="left-top"
          />
          <img
            className="right-bottom-img wow zoomIn"
            src="/images/vector-img/right-bottom.png"
            alt="right-bottom"
          />
          {/* <img
            className="service-v1-vector bounce-y d-none d-xl-block"
            src="/images/vector-img/vector-service-v1.png"
            alt="vector-service"
          /> */}
          <div className="container">
            <div className="row wow fadeInUp">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>{title}</h2>
                  <div className="list-meta mt30">
                    {/* <a className="list-inline-item mb5-sm">
                      <span className="position-relative mr10">
                        <img
                          className="rounded-circle"
                          src="/images/team/fl-d-1.png"
                          alt="Freelancer Photo"
                        />
                        <span className="online-badge" />
                      </span>
                      <span className="fz14">{authorName}</span>
                    </a> */}


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