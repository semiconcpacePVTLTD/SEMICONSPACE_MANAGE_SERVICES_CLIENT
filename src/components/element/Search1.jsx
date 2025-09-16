import listingStore from "@/store/listingStore";
import { useLocation } from "react-router-dom";

export default function Search1() {
  const getSearch = listingStore((state) => state.getSearch);
  const setSearch = listingStore((state) => state.setSearch);

  const { pathname } = useLocation();
  return (
    <>
      <div
        className={`default-box-shadow1 ${
          pathname === "/service-1" ? "mb15" : "mb30"
        }`}
      >
        <div className="search_area">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setSearch(e.target.value)}
            value={getSearch}
            placeholder={
              pathname === "/service-1" ? "What are you looking for?" : "Search"
            }
          />
          <label>
            <span className="flaticon-loupe" />
          </label>
        </div>
      </div>
    </>
  );
}
