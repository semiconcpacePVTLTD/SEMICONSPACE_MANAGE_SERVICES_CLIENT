import { Link } from "react-router-dom";

export default function TrendingServiceCard1({ data }) {
  // Limit category to 100 characters
  const maxLength = 100;
  const categoryText =
    data.category && data.category.length > maxLength
      ? data.category.slice(0, maxLength) + "..."
      : data.category;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full h-40 mb-3">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={data.img}
          alt={data.title}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h5 className="text-lg font-semibold leading-snug mb-1 line-clamp-2">
          <Link
            to={`/service-single/${data.id}`}
            className="hover:text-blue-600 transition"
          >
            {data.title}
          </Link>
        </h5>

        {/* Category with "Read more" */}
        <p className="text-sm text-gray-500 mb-3 min-h-[2.5rem]">
          {categoryText}
          {data.category && data.category.length > maxLength && (
            <Link
              to={`/service-single/${data.id}`}
              className="text-blue-600 ml-1 hover:underline"
            >
              Read more
            </Link>
          )}
        </p>

        {/* Price + Button */}
        {/* <div className="mt-auto flex items-center justify-between">
          <p className="text-base font-medium text-gray-700">
            <span className="text-gray-500 text-sm">Starting at</span>{" "}
            <span className="text-blue-600 font-bold">Rs.{data.price}</span>
          </p>
          <Link
            to={`/service-single/${data.id}`}
            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Book Now
          </Link>
        </div> */}
      </div>
    </div>
  );
}
