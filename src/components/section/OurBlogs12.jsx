import { blog1 } from "@/data/blog";
import BlogCard1 from "../card/BlogCard1";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

export default function OurBlog12() {
  const { pathname } = useLocation();

  return (
    <>
      <section
        className={`pb90 pb20-md ${
          pathname === "/home-4" || pathname === "/home-7" ? "pt0" : ""
        }`}
      >
        <div className="container">
          <div
            className="row align-items-center wow fadeInUp"
            data-wow-delay="00ms"
          >
            <div className="col-lg-9">
              <div className="main-title">
                <h2 className="title">Our Blog</h2>
                <p className="paragraph">
                  See how you can up your career status
                </p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-start text-lg-end mb-4 mb-lg-2">
                <Link className="ud-btn2" to="/blog-1">
                  All Categories<i className="fal fa-arrow-right-long"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="row wow fadeInUp" data-wow-delay="300ms">
            {blog1.slice(0, 4).map((item, i) => (
              <div key={i} className="col-sm-6 col-xl-3">
                <BlogCard1
                  data={item}
                  isContentExpanded={pathname === "/home-6" ? true : false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
