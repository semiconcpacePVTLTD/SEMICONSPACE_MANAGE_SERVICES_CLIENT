import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function OurCta1() {
  const { pathname } = useLocation();

  return (
    <>
      <section
        className={`our-cta pt90 pb90 pt60-md pb60-md mt100 mt0-lg ${
          pathname === "/" || pathname === "/about-1"
            ? "bgc-thm4"
            : pathname === "/home-3"
            ? "cta-home3-last"
            : pathname === "/home-10"
            ? "cta-home3-last mt150 bdrs24"
            : ""
        }`}
      >
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6 col-lg-7 col-xl-5 wow fadeInLeft">
              <div className="cta-style3">
                <h2 className="cta-title">
                  Find the talent needed to get your business growing.
                </h2>
                <p className="cta-text">
                  Advertise your jobs to millions of monthly users and search
                  15.8 million CVs
                </p>
                <Link to="/contact" className="ud-btn btn-thm2">
                  Get Started <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-5 col-xl-5 position-relative wow zoomIn">
              <div className="cta-img">
                <img
                  className="w-100 h-100 object-fit-contain"
                  src={
                    pathname === "/" || pathname === "/about-1"
                      ? "/images/about/about-3.png"
                      : pathname === "/home-3" || pathname === "/home-10"
                      ? "/images/about/about-5.png"
                      : ""
                  }
                  alt="woman"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
