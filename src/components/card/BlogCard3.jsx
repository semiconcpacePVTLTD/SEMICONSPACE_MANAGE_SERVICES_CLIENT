import { Link } from "react-router-dom";

export default function BlogCard3({ data }) {
  return (
    <>
      <div className="blog-style1 list-style bgc-white d-block d-md-flex align-items-md-center mb60">
        <div className="blog-img flex-shrink-0 mb20-sm">
          <img className="bdrs4 object-fit-cover" src={data.img} alt="blog" />
        </div>
        <div className="blog-content pl0-sm pl30-lg pl60 py-0 pe-0 flex-grow-1">
          <a className="date">Business</a>
          <h3 className="title mt-1 mb20">
            <Link to={`/blog-single/${data.id}`}>{data.title}</Link>
          </h3>
          <p className="text mb0">{data.description}</p>
          <div className="d-flex mt50 mt30-lg">
            <img
              className="object-fit-contain"
              src={data.author.img}
              alt="avatar"
            />
            <div className="details ml20">
              <div className="h6">{data.author.name}</div>
              <p className="mb-0">{data.date}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
