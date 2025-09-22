import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

import { teamDataThree } from "@/data/testimonials";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

export default function HighestRated18() {
  const [showSwiper, setShowSwiper] = useState(false);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static images to use with dynamic data
  const staticImages = [
    "/images/team/home18-team-1.jpg",
    "/images/team/home18-team-2.jpg",
    "/images/team/home18-team-3.jpg",
    "/images/team/home18-team-4.jpg"
  ];

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const host = import.meta.env.VITE_BACKEND_HOST || "192.168.1.30";
        const port = import.meta.env.VITE_BACKEND_PROFILE_API_PORT || import.meta.env.VITE_BACKEND_PROFILE_PORT || "8002";
        const url = `http://${host}:${port}/profile-service/freelance`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch freelancers");

        const json = await response.json();
        const freelancerData = json?.data || [];

        // Map API data to component format and limit to 4 for the carousel
        const mappedFreelancers = freelancerData.slice(0, 4).map((freelancer, index) => ({
          id: freelancer.uuid || freelancer.id || index + 1,
          name: freelancer.name || freelancer.title || "Unknown Freelancer",
          role: freelancer.company_name || freelancer.profession || "Freelancer",
          imageSrc: freelancer.profile_image || staticImages[index] || "/images/team/home18-team-1.jpg", // Use profile image from API, fallback to static
          rating: freelancer.rating || 4.9 // Default rating if not provided
        }));

        setFreelancers(mappedFreelancers);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        // Fallback to static data if API fails
        setFreelancers(teamDataThree);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Shuffle the freelancers for variety
  const shuffledFreelancers = useMemo(
    () => [...freelancers].sort(() => Math.random() - 0.5),
    [freelancers]
  );

  useEffect(() => {
    setShowSwiper(true);
  }, []);
  if (loading) {
    return (
      <section className="pb90 pb30-md bdrt1">
        <div className="container">
          <div className="row align-items-center wow fadeInUp">
            <div className="col-lg-9">
              <div className="main-title">
                <h2 className="title">Highest Rated Freelancers</h2>
                <p className="paragraph">
                  Most viewed and all-time top-selling services
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-lg-end mb-2">
                <Link to="/freelancer-1" className="ud-btn2">
                  All Freelancers <i className="fal fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading freelancers...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb90 pb30-md bdrt1">
      <div className="container">
        <div className="row align-items-center wow fadeInUp">
          <div className="col-lg-9">
            <div className="main-title">
              <h2 className="title">Highest Rated Freelancers</h2>
              <p className="paragraph">
                Most viewed and all-time top-selling services
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-lg-end mb-2">
              <Link to="/freelancer-1" className="ud-btn2">
                All Freelancers <i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            {freelancers.length === 0 ? (
              <div className="text-center py-5">
                <p>No Freelancer found at the moment</p>
              </div>
            ) : (
              <div className="position-relative">
                {showSwiper && (
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={{
                      prevEl: ".unique-9-pre",
                      nextEl: ".unique-9-next",
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                    loop={true}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      992: {
                        slidesPerView: 3,
                      },
                      1200: {
                        slidesPerView: 4,
                      },
                    }}
                  >
                    {shuffledFreelancers.map((elm, i) => (
                      <SwiperSlide key={elm.id || i}>
                        <div className="item">
                          <div className="feature-style2 mb30">
                            <div className="feature-img bdrs12">
                              <img
                                className="bdrs12"
                                src={elm.imageSrc}
                                alt={`${elm.name} avatar`}
                                style={{ width: '329px', height: '466px', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="feature-content pt15">
                              <h5 className="title mb-2">
                                {elm.name}{" "}
                                <span className="float-end fz15">
                                  <i className="fas fa-star fz10 pr10"></i>
                                  {elm.rating}
                                </span>
                              </h5>
                              <p className="text fz15">{elm.role}</p>
                              <div className="d-grid mt15">
                                <Link
                                  to={`/freelancer-single/${elm.id}`}
                                  className="ud-btn btn-light-thm"
                                >
                                  View Profile
                                  <i className="fal fa-arrow-right-long" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
                <button
                  type="button"
                  className="prev-btn pre-slide3 unique-9-pre"
                >
                  <i className="far fa-chevron-left" />
                </button>
                <button
                  type="button"
                  className="next-btn next-slide3 unique-9-next"
                >
                  <i className="far fa-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
