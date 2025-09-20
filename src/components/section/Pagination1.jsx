import { useLocation } from "react-router-dom";

export default function Pagination1({
  totalItems = 0,
  itemsPerPage = 12,
  currentPage = 1,
  setCurrentPage,
}) {
  const { pathname } = useLocation();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageClick(i)}
        >
          <a className="page-link">{i}</a>
        </li>
      );
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`mbp_pagination text-center ${pathname === "/blog-2" || pathname === "/blog-3" ? "mb40-md" : ""
        } ${pathname === "/shop-list" ? "mt30" : ""}`}
    >
      <ul className="page_navigation">
        <li className="page-item" onClick={() => handlePageClick(currentPage - 1)}>
          <a className="page-link">
            <span className="fas fa-angle-left" />
          </a>
        </li>
        {renderPageNumbers()}
        <li className="page-item" onClick={() => handlePageClick(currentPage + 1)}>
          <a className="page-link">
            <span className="fas fa-angle-right" />
          </a>
        </li>
      </ul>
      <p className="mt10 mb-0 pagination_page_count text-center">
        {startItem} – {endItem} of {totalItems} Freelancers
      </p>
    </div>
  );
}
