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
import { useEffect, useState } from "react";

export default function ServiceDetail3({ service, loading }) {
  const isMatchedScreen = useScreen(1216);
  const { id } = useParams();

  const navigate = useNavigate();

  // Use service prop if provided, otherwise fallback to product1 lookup
  const data = service || (id ? product1.find((item) => item.id == id) : null);

  // PCB-specific sidebar freelancers fetched dynamically (same as freelancer-1)
  const [sidebarFreelancers, setSidebarFreelancers] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSidebar = async () => {
      try {
        setSidebarLoading(true);
        const host = import.meta.env.VITE_BACKEND_HOST || "192.168.1.30";
        const port =
          import.meta.env.VITE_BACKEND_PROFILE_API_PORT ||
          import.meta.env.VITE_BACKEND_PROFILE_PORT ||
          "8003";
        const url = `http://${host}:${port}/profile-service/freelance`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        setSidebarFreelancers(json?.data || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to load sidebar freelancers", e);
        }
      } finally {
        setSidebarLoading(false);
      }
    };
    fetchSidebar();
    return () => controller.abort();
  }, []);

  // Normalize to sidebar card shape
  const sidebarList = (Array.isArray(sidebarFreelancers) ? sidebarFreelancers : [])
    .slice(0, 8)
    .map((f, idx) => ({
      id: f?.uuid || f?.id || idx + 1,
      name: f?.name ?? f?.title ?? "Unknown",
      avatar: f?.profile_image || "/images/team/fl-d-1.png",
      location: f?.location ?? "—",
      rate: typeof f?.hourlyRate === "number" ? f.hourlyRate : undefined,
      rating: f?.rating ?? undefined,
      reviews: f?.reviews ?? undefined,
      success:
        typeof f?.job_success === "number"
          ? f.job_success
          : f?.jobSuccess ?? undefined,
    }));

  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    // Shuffle once on mount
    const copy = [...sidebarList];
    const shuffledArr = copy.sort(() => 0 - Math.random()).slice(0, 4);
    setShuffled(shuffledArr);
  }, [sidebarList]);
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

                  <ServiceDetailSlider2
                    images={data?.imgURLs?.length ? data.imgURLs : ["/images/image_not_fount.webp"]}
                  />
                  <div className="service-about">
                    <div className="row g-4">
                      {/* About Card */}
                      <div className="col-12">
                        <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                          <h5 className="fw600 mb2">About</h5>
                          <p
                            className="text mb0"
                            style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
                          >
                            {loading
                              ? "Loading..."
                              : data?.longDescription ||
                              data?.description ||
                              "No description available."}
                          </p>
                        </div>
                      </div>

                      {/* Capabilities */}
                      {data?.capabilities && (
                        <div className="col-md-6">
                          <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                            <h6 className="fw600 mb2">Capabilities</h6>
                            <ul className="list-unstyled mb0" style={{ lineHeight: "1.4" }}>
                              <li>High-speed DDR/USB/Ethernet routing with impedance control</li>
                              <li>RF/BLE/Wi-Fi layout with ground stitching and matching</li>
                              <li>Power electronics: DC-DC, protections, thermal design</li>
                              <li>EMC/EMI best practices and compliance-oriented layout</li>
                              <li>Rapid prototyping and small-batch production support</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Tools */}
                      {data?.tools && (
                        <div className="col-md-6">
                          <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                            <h6 className="fw600 mb3">Tools</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {["Altium Designer", "KiCad", "OrCAD (on request)"].map((tool, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-pill bg-light border text-dark small"
                                  style={{ fontWeight: 500 }}
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      {data?.other1 && (
                        <div className="col-md-6">
                          <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                            <h6 className="fw600 mb2">Board types</h6>
                            <ul className="list-unstyled mb0" style={{ lineHeight: "1.4" }}>
                              <li>2–8 layers, HDI (on request)</li>
                              <li>Rigid / Rigid-Flex</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Deliverables */}
                      {data?.deliverables && (
                        <div className="col-md-6">
                          <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                            <h6 className="fw600 mb3">Deliverables</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {["Schematics", "PCB files", "Gerbers", "BoM", "Fab & Assy files"].map(
                                (item, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 rounded-pill bg-light border text-dark small"
                                    style={{ fontWeight: 500 }}
                                  >
                                    {item}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {data?.other2 && (
                        <div className="col-md-6">
                          <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                            <h6 className="fw600 mb2">More Details</h6>
                            <p
                              className="text mb0"
                              style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}
                            >
                              {data.other2}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Static Info Cards */}
                      <div className="col-md-4">
                        <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                          <h6 className="fw600 mb2">App type</h6>
                          <p className="text mb0">Business, Food &amp; Drink</p>
                          <p className="text mb0">Graphics &amp; Design</p>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                          <h6 className="fw600 mb2">Design tools</h6>
                          <p className="text mb0">Adobe XD, Figma</p>
                          <p className="text mb0">Adobe Photoshop</p>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-4 bg-white rounded shadow-sm h-100 border" style={{ borderWidth: "0.1rem" }}>
                          <h6 className="fw600 mb2">Device</h6>
                          <p className="text mb0">Mobile, Desktop</p>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
              <div className="col-lg-4">
                <div className="column">

                  <Sticky>
                    {({ style }) => (
                      <div className="scrollbalance-inner" style={style}>
                        <div className="blog-sidebar ms-lg-auto">
                          <div
                            className="px20 bdr1 pt20 pb20 mb30 bg-white bdrs12 default-box-shadow1 d-flex flex-column"
                            style={{ maxHeight: "600px", minHeight: "400px" }}
                          >
                            <h5 className="mb20 text-center">PCB Freelancers</h5>
                            <div className="flex-grow-1">
                              {shuffled.map((f, idx) => (
                                <div
                                  key={idx}
                                  className="d-flex align-items-center mb15 pb15 bdrb1"
                                >
                                  {/* Avatar */}
                                  <img
                                    className="rounded-circle me-3"
                                    src={f.avatar}
                                    alt={f.name}
                                    width="50"
                                    height="50"
                                  />

                                  {/* Details */}
                                  <div className="flex-grow-1">
                                    <h6 className="mb5">{f.name}</h6>
                                    <p className="fz14 fw500 mb2">{f.success}% Success Rate</p>
                                    <p className="text fz14 mb0">{f.location}</p>
                                  </div>

                                  {/* Action Button */}
                                  <button
                                    className="px-3 py-1 rounded-pill"
                                    style={{
                                      backgroundColor: "#2563eb",
                                      color: "#fff",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={() => navigate(`/freelancer-single/${f.id}`)}
                                  >
                                    View
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* View all button */}
                            <div className="text-center mt15">
                              <button
                                className="px-3 py-2 rounded-3"
                                style={{
                                  backgroundColor: "#2563eb",
                                  color: "#fff",
                                  border: "none",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                  fontSize: "14px",
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


                </div>
              </div>
            </div>
          </div>
        </section>
      </StickyContainer>
    </>
  );
}
