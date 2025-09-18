import ServiceDetailComment1 from "../element/ServiceDetailComment1";
import ServiceDetailExtra1 from "../element/ServiceDetailExtra1";
import ServiceDetailFaq1 from "../element/ServiceDetailFaq1";
import { useNavigate } from "react-router-dom";

import ServiceDetailReviewInfo1 from "../element/ServiceDetailReviewInfo1";
import { Sticky, StickyContainer } from "react-sticky";
import useScreen from "@/hook/useScreen";
import ServiceContactWidget1 from "../element/ServiceContactWidget1";
import ServiceDetailSlider2 from "../element/ServiceDetailSlider2";

import { useParams } from "react-router-dom";
import { product1 } from "@/data/product";

export default function ServiceDetail3({ service, loading }) {
  const isMatchedScreen = useScreen(1216);
  const { id } = useParams();

  const navigate = useNavigate();

  // Use service prop if provided, otherwise fallback to product1 lookup
  const data = service || (id ? product1.find((item) => item.id == id) : null);

  // PCB-specific sidebar freelancer data
  const freelancers = [
    {
      name: "Alice Kim",
      avatar: "/images/team/fl-d-1.png",
      location: "San Jose, CA",
      rate: 45,
      rating: 4.9,
      reviews: 120,
      success: 98,
    },
    {
      name: "Rahul Verma",
      avatar: "/images/team/fl-d-2.png",
      location: "Bengaluru, IN",
      rate: 35,
      rating: 4.8,
      reviews: 86,
      success: 96,
    },
    {
      name: "Sophia Martinez",
      avatar: "/images/team/fl-d-3.png",
      location: "Austin, TX",
      rate: 55,
      rating: 5.0,
      reviews: 64,
      success: 99,
    },
  ];

  // PCB-related projects under About section
  const projects = [
    {
      title: "4-layer High-Speed PCB for IoT Gateway",
      description:
        "Need Altium layout with impedance control, EMI best practices, and design for prototype assembly.",
      budget: "$800 - $1,200 • Fixed",
      posted: "2 days ago",
    },
    {
      title: "Power Supply Board (48V to 12V) with Protections",
      description:
        "DC-DC converter design with thermal analysis, short-circuit/OVP/UVP protections, and test plan.",
      budget: "$35 - $60/hr • Hourly",
      posted: "5 days ago",
    },
    {
      title: "RF PCB for BLE + GPS Tracker",
      description:
        "2.4GHz RF layout, controlled stack-up, ground stitching, and antenna matching network recommendations.",
      budget: "$1,500 • Fixed",
      posted: "1 week ago",
    },
  ];

  return (
    <>
      <StickyContainer>
        <section className="pt10 pb90 pb30-md">
          <div className="container">
            <div className="row wrap">
              <div className="col-lg-8">
                <div className="column">
                  <div className="row  px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                    <div className="col-xl-12 mb30 pb30 bdrb1">
                      <div className="position-relative">
                        {loading ? (
                          <h2>Loading...</h2>
                        ) : data ? (
                          <h2>{data.title}</h2>
                        ) : (
                          <h2>
                            Professional PCB Design, Layout & Prototyping
                            Services
                          </h2>
                        )}
                        {/* <div className="list-meta mt30">
                          <a className="list-inline-item mb5-sm" href="#">
                            <span className="position-relative mr10">
                              <img
                                className="rounded-circle"
                                src="/images/team/fl-d-1.png"
                                alt="Freelancer Photo"
                              />
                              <span className="online-badge"></span>
                            </span>
                            <span className="fz14">Eleanor Pena</span>
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
                        </div> */}
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

                  <ServiceDetailSlider2 images={data?.imgURLs} />
                  <div className="service-about">
                    <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>About</h4>
                      <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                        {loading ? "Loading..." : data?.longDescription || data?.description || "No description available."}
                      </p>
                      {data?.capabilities && (
                        <>
                          <p className="text mb-0">Capabilities:</p>
                          <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                            {data.capabilities}
                          </p>
                        </>
                      )}
                      {data?.tools && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          Tools: {data.tools}
                        </p>
                      )}
                      {data?.other1 && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {data.other1}
                        </p>
                      )}
                      {data?.other2 && (
                        <p className="text mb30" style={{ whiteSpace: "pre-line" }}>
                          {data.other2}
                        </p>
                      )}
                      <div className="d-flex align-items-start mb50">
                        <div className="list1">
                          <h6>Design tools</h6>
                          <p className="text mb-0">Altium Designer, KiCad</p>
                          <p className="text">OrCAD (on request)</p>
                        </div>
                        <div className="list1 ml80">
                          <h6>Board types</h6>
                          <p className="text mb-0">
                            2–8 layers, HDI (on request)
                          </p>
                          <p className="text">Rigid / Rigid‑Flex</p>
                        </div>
                        <div className="list1 ml80">
                          <h6>Deliverables</h6>
                          <p className="text">
                            Schematics, PCB files, Gerbers, BoM, Fab &amp; Assy
                            files
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <hr className="opacity-100 mb60" /> */}
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>Related Projects</h4>
                      <div className="row mt30 mb40">
                        {projects.map((p, i) => (
                          <div key={i} className="col-12 mb20">
                            <div className="bdr1 bdrs12 p30 d-flex align-items-start justify-content-between">
                              <div>
                                <h5 className="mb10">{p.title}</h5>
                                <p className="text mb10">{p.description}</p>
                                <p className="text mb0">
                                  <strong>{p.budget}</strong> •{" "}
                                  <span className="text-muted">
                                    Posted {p.posted}
                                  </span>
                                </p>
                              </div>
                              <div className="ml20 d-flex align-items-center">
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "#16a34a",
                                    padding: "8px 18px",
                                    borderRadius: "30px", // pill-style
                                    border: "2px solid #16a34a",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "all 0.3s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#16a34a";
                                    e.currentTarget.style.color = "#fff";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.color = "#16a34a";
                                  }}
                                >
                                  Open Project{" "}
                                  <i className="fal fa-arrow-right-long"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}
                    {/* <hr className="opacity-100 mb60" /> */}
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>Frequently Asked Questions</h4>
                      <ServiceDetailFaq1 />{" "}
                    </div> */}
                    {/* <hr className="opacity-100 mb60" /> */}
                    {/* <div className="px30 bdr1 pt30 pb-0 mb30 bg-white bdrs12 wow fadeInUp default-box-shadow1">
                      <h4>Add Extra Services</h4>
                      <ServiceDetailExtra1 />{" "}
                    </div> */}
                    {/* <hr className="opacity-100 mb15" /> */}
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
                              style={{ maxHeight: "900px", minHeight: "700px" }} // increased height
                            >
                              <h4>PCB Freelancers</h4>
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
                                ))}
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
                          <h4>PCB Freelancers</h4>
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
