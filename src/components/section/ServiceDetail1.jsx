import ServiceDetailPrice1 from "../element/ServiceDetailPrice1";
import ServiceDetailSlider1 from "../element/ServiceDetailSlider1";
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";
import ServiceContactWidget1 from "../element/ServiceContactWidget1";
import ServiceDetailComment1 from "../element/ServiceDetailComment1";
import ServiceDetailExtra1 from "../element/ServiceDetailExtra1";
import ServiceDetailFaq1 from "../element/ServiceDetailFaq1";
import ServiceDetailReviewInfo1 from "../element/ServiceDetailReviewInfo1";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ServiceDetail1({ service, loading }) {
  const isMatchedScreen = useScreen(1216);
  const navigate = useNavigate();

  const [freelancers, setFreelancers] = useState([]);
  const [freelancersLoading, setFreelancersLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchFreelancers = async () => {
      try {
        setFreelancersLoading(true);
        const host = import.meta.env.VITE_BACKEND_HOST || "192.168.1.30";
        const port = import.meta.env.VITE_BACKEND_PROFILE_API_PORT || import.meta.env.VITE_BACKEND_PROFILE_PORT || "8003";
        const url = `http://${host}:${port}/profile-service/freelance`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const mappedFreelancers = (json?.data || []).map(freelancer => ({
          avatar: freelancer.img,
          name: freelancer.name,
          rate: freelancer.price,
          location: freelancer.location,
          rating: freelancer.rating,
          reviews: freelancer.reviews,
          success: freelancer.jobSuccess || 95, // Default to 95% if not provided
        }));
        setFreelancers(mappedFreelancers);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to load freelancers", e);
        }
      } finally {
        setFreelancersLoading(false);
      }
    };
    fetchFreelancers();
    return () => controller.abort();
  }, []);

  // Dynamic fields
  const about = service?.longDescription || service?.description || "";
  const capabilities = service?.capabilities || "";
  const tools = service?.tools || "";
  const other1 = service?.other1 || "";
  const other2 = service?.other2 || "";
  const images = Array.isArray(service?.imgURLs) ? service?.imgURLs : undefined;

  return (
    <>
      <StickyContainer>
        <section className="pt10 pb90 pb30-md">
          <div className="container">
            <div className="row wrap">
              <div className="col-lg-8">
                <div className="column">
                  <div className="row px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                    <div className="col-xl-12 mb30 pb30 bdrb1">
                      <div className="position-relative">
                        <h2>{service?.title || "Service Title"}</h2>
                        <div className="list-meta mt30">
                          <a className="list-inline-item mb5-sm" href="#">
                            <span className="position-relative mr10">
                              <img
                                className="rounded-circle"
                                src="/images/team/fl-d-1.png"
                                alt="Freelancer Photo"
                              />
                              <span className="online-badge"></span>
                            </span>
                            <span className="fz14">Service Provider</span>
                          </a>
                          <p className="mb-0 dark-color fz14 list-inline-item ml25 ml15-sm mb5-sm ml0-xs">
                            <i className="fas fa-star vam fz10 review-color me-2"></i>{" "}
                            4.82 94 reviews
                          </p>
                          <p className="mb-0 dark-color fz14 list-inline-item ml25 ml15-sm mb5-sm ml0-xs">
                            <i className="flaticon-file-1 vam fz20 me-2"></i> 2
                            Order in Queue
                          </p>
                          <p className="mb-0 dark-color fz14 list-inline-item ml25 ml15-sm mb5-sm ml0-xs">
                            <i className="flaticon-website vam fz20 me-2"></i>{" "}
                            902 Views
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 col-md-4">
                        <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                          <div className="icon flex-shrink-0">
                            <span className="flaticon-calendar" />
                          </div>
                          <div className="details">
                            <h5 className="title">On-time Delivery</h5>
                            <p className="mb-0 text">
                              Projects delivered as scheduled
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-6 col-md-4">
                        <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                          <div className="icon flex-shrink-0">
                            <span className="flaticon-chat" />
                          </div>
                          <div className="details">
                            <h5 className="title">Technical Support</h5>
                            <p className="mb-0 text">
                              24/7 assistance for your projects
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-6 col-md-4">
                        <div className="iconbox-style1 contact-style d-flex align-items-start mb30">
                          <div className="icon flex-shrink-0">
                            <span className="flaticon-money" />
                          </div>
                          <div className="details">
                            <h5 className="title">Cost Efficiency</h5>
                            <p className="mb-0 text">
                              Affordable solutions without compromise
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ServiceDetailSlider1 images={images} />
                  <div className="service-about">
                    <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>About</h4>
                      <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                        {loading ? "Loading..." : about || "No description available."}
                      </p>
                      {capabilities && (
                        <>
                          <p className="text mb-0">Capabilities:</p>
                          <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                            {capabilities}
                          </p>
                        </>
                      )}
                      {tools && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          Tools: {tools}
                        </p>
                      )}
                      {other1 && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {other1}
                        </p>
                      )}
                      {other2 && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {other2}
                        </p>
                      )}
                    </div>
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>Frequently Asked Questions</h4>
                      <ServiceDetailFaq1 />
                    </div> */}
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>Add Extra Services</h4>
                      <ServiceDetailExtra1 />
                    </div> */}
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <ServiceDetailReviewInfo1 />
                      <ServiceDetailComment1 />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="column">
                  {isMatchedScreen ? (
                    <Sticky>
                      {({ style }) => (
                        <div className="scrollbalance-inner" style={style}>
                          <div className="blog-sidebar ms-lg-auto">
                            <div
                              className="px30 bdr1 pt30 pb30 mb30 bg-white bdrs12 default-box-shadow1 d-flex flex-column"
                              style={{ maxHeight: "900px", minHeight: "700px" }}
                            >
                              <h4>Available Freelancers</h4>
                              <div className="mt20 flex-grow-1 overflow-auto">
                                {freelancersLoading ? (
                                  <p className="text-center">Loading freelancers...</p>
                                ) : freelancers.length > 0 ? (
                                  freelancers.slice(0, 8).map((f, idx) => (
                                    <div
                                      key={idx}
                                      className="d-flex align-items-center pb20 mb20 bdrb1"
                                    >
                                      <img
                                        className="rounded-circle mr15"
                                        src={f.avatar}
                                        alt={f.name}
                                        width="48"
                                        height="48"
                                      />
                                      <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <h6 className="mb0">{f.name}</h6>
                                        </div>
                                        <span className="fz14 fw500">
                                          ${f.rate}/hr
                                        </span>
                                        <p className="text mb5">{f.location}</p>
                                        <p className="text mb0 fz14">
                                          <i className="fas fa-star review-color me-1"></i>{" "}
                                          {f.rating} ({f.reviews} reviews) •{" "}
                                          {f.success}% Job Success
                                        </p>
                                      </div>
                                      <button
                                        className="ml15"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "transparent",
                                          color: "#2563eb",
                                          padding: "8px 16px",
                                          borderRadius: "30px",
                                          border: "2px solid #2563eb",
                                          cursor: "pointer",
                                          fontWeight: "500",
                                          transition: "all 0.3s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "#2563eb";
                                          e.currentTarget.style.color = "#fff";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "transparent";
                                          e.currentTarget.style.color = "#2563eb";
                                        }}
                                        onClick={() =>
                                          navigate("/freelancer-single")
                                        }
                                      >
                                        <span
                                          style={{
                                            fontSize: "20px",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          👤
                                        </span>
                                        <span>View Profile</span>
                                      </button>
                                    </div>
                                  ))) : (
                                  <p className="text-center">No freelancers available.</p>
                                )}
                              </div>

                              {/* View all freelancers button at bottom */}
                              <div className="text-center mt20">
                                <button
                                  className="px-4 py-2 rounded-3"
                                  style={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                  }}
                                  onClick={() => navigate("/freelancer-1")}
                                >
                                  View All Freelancers
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Sticky>
                  ) : (
                    <div className="scrollbalance-inner">
                      <div className="blog-sidebar ms-lg-auto">
                        <div
                          className="px30 bdr1 pt30 pb30 mb30 bg-white bdrs12 default-box-shadow1 d-flex flex-column"
                          style={{ maxHeight: "600px" }}
                        >
                          <h4>Available Freelancers</h4>
                          <div className="mt20 flex-grow-1 overflow-auto">
                            {freelancers.slice(0, 8).map((f, idx) => (
                              <div
                                key={idx}
                                className="d-flex align-items-center pb20 mb20 bdrb1"
                              >
                                <img
                                  className="rounded-circle mr15"
                                  src={f.avatar}
                                  alt={f.name}
                                  width="48"
                                  height="48"
                                />
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb0">{f.name}</h6>
                                    <span className="fz14 fw500">
                                      ${f.rate}/hr
                                    </span>
                                  </div>
                                  <p className="text mb5">{f.location}</p>
                                  <p className="text mb0 fz14">
                                    <i className="fas fa-star review-color me-1"></i>{" "}
                                    {f.rating} ({f.reviews} reviews) •{" "}
                                    {f.success}% Job Success
                                  </p>
                                </div>
                                <button
                                  className="ml15"
                                  style={{
                                    backgroundColor: "#2563eb",
                                    color: "#fff",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#1d4ed8")
                                  }
                                  onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#2563eb")
                                  }
                                >
                                  Message Freelancer
                                </button>
                              </div>
                            ))}
                          </div>
                          {/* View all freelancers button */}
                          <div className="text-center mt20">
                            <button
                              className="px-4 py-2 rounded-3"
                              style={{
                                backgroundColor: "#2563eb",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                              }}
                              onClick={() => navigate("/freelancers")}
                            >
                              View All Freelancers
                            </button>
                          </div>
                        </div>
                        <ServiceDetailPrice1 />
                        <ServiceContactWidget1 />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </StickyContainer>
    </>
  );
}
