import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function BlogCard1({ data, isContentExpanded = false }) {
  const { pathname } = useLocation();
  return (
    <>
      <div
        className={`blog-style1 ${
          pathname === "/home-5" ? "bdr1 at-home5 overflow-hidden" : ""
        } ${
          pathname === "/home-6" ||
          pathname === "/home-18" ||
          pathname === "/home-13" ||
          pathname === "/home-12"
            ? "at-home6"
            : ""
        } ${pathname === "/home-7" ? "at-home7 bdr1" : ""} ${
          pathname === "/home-8" ? "at-home8" : ""
        }`}
      >
        <div
          className={`blog-img ${
            pathname === "/home-6" ? "bdrs4 over-flowhidden" : ""
          }`}
        >
          <img
            className="w-100 h-100 object-fit-cover"
            src={data.img}
            alt="thumbnail"
          />
        </div>
        <div className={`blog-content ${isContentExpanded ? "px-0" : ""}`}>
          <a className="date">{data.date}</a>
          <h4 className="title mt-1">
            <Link to={`/blog-single/${data.id}`}>{data.title}</Link>
          </h4>
          <p className="text mb-0">{data.brief}</p>
        </div>
      </div>
    </>
  );
}
