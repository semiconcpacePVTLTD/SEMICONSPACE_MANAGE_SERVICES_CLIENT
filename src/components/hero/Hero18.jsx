import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import HeroSearch1 from "../element/HeroSearch1";

const roleOptions = [
  "Graphics & Design",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Programming & Tech",
];

const popularTags = ["Designer", "Developer", "Web", "IOS", "PHP", "Senior"];

export default function Hero18({ service, services }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const onSearch = (e) => {
    e.preventDefault();
    // Simple navigation example; adjust as needed
    navigate("/project-1");
  };

  return (
    <section className="hero-home13 at-home18 m30 overflow-hidden">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7">
            <div className="home18-hero-content">
              <h1 className="banner-title animate-up-1 mb25">
                Freelance Services For <br className="d-none d-xl-block" />
                Your Business
              </h1>
              <p className="text-white text animate-up-2">
                Work with talented people at the most affordable price to get
                the most <br className="d-none d-lg-block" />
                out of your time and cost
              </p>
              <div className="d-sm-flex align-items-center mt30 animate-up-3">
                <Link
                  to="/service-1"
                  state={{ services }} // <-- pass services here
                  className="ud-btn btn-thm4 me-3 bdrs120 btn-1"
                >
                  Explore services
                </Link>
                <Link
                  to="/freelancer-1"
                  className="ud-btn btn-white bdr1 bdrs120 btn-2"
                >
                  Find Talent
                </Link>
              </div>
              <div className="advance-search-tab bgc-white p10 bdrs4-sm bdrs60 banner-btn position-relative zi1 animate-up-3 mt30">
                <div className="row">
                  <div className="col-md-5 col-lg-6 col-xl-6">
                    <div className="advance-search-field mb10-sm">
                      <HeroSearch1 />
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-4 col-xl-3">
                    <div className="bselect-style1  bdrl1 bdrn-sm">
                      <div className="dropdown bootstrap-select">
                        <button
                          type="button"
                          className="btn dropdown-toggle btn-light"
                          data-bs-toggle="dropdown"
                        >
                          <div className="filter-option">
                            <div className="filter-option-inner">
                              <div className="filter-option-inner-inner">
                                {selectedRole !== null ? selectedRole : "Choose Category"}
                              </div>
                            </div>
                          </div>
                        </button>
                        <div className="dropdown-menu ">
                          <div className="inner show">
                            <ul className="dropdown-menu inner show">
                              {roleOptions.map((item, index) => (
                                <li
                                  onClick={() => setSelectedRole(item)}
                                  key={index}
                                  className="selected active"
                                >
                                  <a
                                    className={`dropdown-item selected ${selectedRole === item ? "active" : ""
                                      }`}
                                  >
                                    <span className="text">{item}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-2 col-xl-3">
                    <div className="text-center text-xl-start">
                      <button
                        className="ud-btn btn-dark w-100 bdrs60"
                        type="button"
                        onClick={onSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="animate-up-2 text-white ff-heading mt30 mb15">Popular Searches</p>
              <div className="home9-tags at-home12 d-md-flex align-items-center animate-up-4">
                {popularTags.map((elm, i) => (
                  <a key={i} className="bdrs60 mb-2 mb-md-0" href="#">
                    {elm}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="col-xl-5 d-none d-xl-block">
            <div className="home18-hero-img text-end animate-up-1">
              <div className="thumb position-relative">
                <img
                  className="img"
                  src="/images/about/home18-hero-img1.png"
                  alt=" image "
                />
              </div>
              <div className="detail text-start">
                <h5 className="text-white">Leslie Alexander</h5>
                <p className="fz13 text-white mb-0">UX / UI Designer</p>
              </div>
              <div className="iconbox-small1 text-start d-flex wow fadeInRight default-box-shadow4 bounce-x">
                <span className="icon flaticon-badge"></span>
                <div className="details pl20">
                  <h6 className="mb-1">Proof of quality</h6>
                  <p className="text fz13 mb-0">Lorem Ipsum Dolar Amet</p>
                </div>
              </div>
              <img
                className="img-1 bounce-y"
                src="/images/about/happy-client-1.png"
                alt=" image "
              />
              <img
                className="img-2 bounce-y"
                src="/images/about/element-15.png"
                alt=" image "
              />
              <img
                className="img-3 spin-right"
                src="/images/about/element-16.png"
                alt=" image "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
