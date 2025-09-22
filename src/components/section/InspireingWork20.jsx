import { Link } from "react-router-dom";
import React from "react";

export default function InspireingWork20() {
  return (
    <section className="pb90 pb20-md pt-0">
      <div className="container">
        <div
          className="row align-items-center wow fadeInUp"
          data-wow-delay="00ms"
        >
          <div className="col-md-6">
            <div className="find-work bgc-light-yellow pb50 pt60 px20 bdrs24 text-center mb30">
              <img
                className="mb30"
                src="/images/about/home20-vector-1.png"
                alt=" image "
              />
              <h2 className="title mb30">Find great work</h2>
              <p className="text mb30">
                Work with the largest network of independent professionals and{" "}
                <br className="d-none d-lg-block" /> get things done—from quick
                turnaround.
              </p>
              <Link className="ud-btn btn-dark bdrs60" to="/job-1">
                Get Started <i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="find-work bgc-thm4 pb50 pt60 px20 bdrs24 text-center mb30">
              <img
                className="mb30"
                src="/images/about/home20-vector-2.png"
                alt=" image "
              />
              <h2 className="title mb30">Find talent your way</h2>
              <p className="text mb30">
                Work with the largest network of independent professionals and{" "}
                <br className="d-none d-lg-block" /> get things done—from quick
                turnaround.
              </p>
              <Link className="ud-btn btn-dark bdrs60" to="/freelancer-1">
                Get Started <i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
