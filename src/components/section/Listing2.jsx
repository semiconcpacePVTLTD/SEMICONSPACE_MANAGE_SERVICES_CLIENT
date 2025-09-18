import { useState } from "react";
import ListingOption1 from "../element/ListingOption1";
import ListingSidebarModal1 from "../modal/ListingSidebarModal1";
import Pagination1 from "./Pagination1";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import PopularServiceCard2 from "../card/PopularServiceCard2";
import PopularServiceSlideCard2 from "../card/PopularServiceSlideCard2";

export default function Listing2({ services, CardComponent }) {
  const getDeliveryTime = listingStore((state) => state.getDeliveryTime);
  const getPriceRange = priceStore((state) => state.priceRange);
  const getLevel = listingStore((state) => state.getLevel);
  const getLocation = listingStore((state) => state.getLocation);
  const getBestSeller = listingStore((state) => state.getBestSeller);
  const getDesginTool = listingStore((state) => state.getDesginTool);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getSearch = listingStore((state) => state.getSearch);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Normalize services
  const rawServices = Array.isArray(services)
    ? services
    : services?.success && Array.isArray(services?.data)
      ? services.data
      : [];

  const normalized = rawServices.map((svc) => ({
    id: svc.id,
    img2: Array.isArray(svc?.imgURLs) && svc.imgURLs.length ? svc.imgURLs[0] : "/images/noimage.png",
    category: svc.shortDescription || svc.description || "Design & Creative",
    title: svc.name,
    rating: 4.82,
    review: 94,
    author: { img: "/images/team/fl-s-1.png", name: svc.createdBy || "Unknown" },
    price: Number(typeof svc?.milestoneRules?.advance === "string"
      ? parseFloat(svc.milestoneRules.advance.replace("%", ""))
      : svc?.milestoneRules?.advance || 0),
    deliveryTime: svc.deliveryTime || "",
    level: svc.level || "",
    location: (svc.location || "").toLowerCase(),
    language: svc.language || "",
    tool: svc.tool || "",
    sort: svc.sort || "best-seller",
  }));

  // Filters
  const deliveryFilter = (item) =>
    getDeliveryTime === "" || getDeliveryTime === "anytime" ? item : item.deliveryTime === getDeliveryTime;
  const priceFilter = (item) => getPriceRange.min <= item.price && getPriceRange.max >= item.price;
  const levelFilter = (item) => (getLevel?.length ? getLevel.includes(item.level) : item);
  const locationFilter = (item) => (getLocation?.length ? getLocation.includes(item.location) : item);
  const searchFilter = (item) =>
    getSearch !== "" ? item.location.split("-").join(" ").includes(getSearch.toLowerCase()) : item;
  const sortByFilter = (item) => (getBestSeller === "best-seller" ? item : item.sort === getBestSeller);
  const designToolFilter = (item) => (getDesginTool?.length ? getDesginTool.includes(item.tool) : item);
  const speakFilter = (item) => (getSpeak?.length ? getSpeak.includes(item.language) : item);

  // Apply all filters
  const filtered = normalized
    .filter(deliveryFilter)
    .filter(priceFilter)
    .filter(levelFilter)
    .filter(locationFilter)
    .filter(searchFilter)
    .filter(sortByFilter)
    .filter(designToolFilter)
    .filter(speakFilter);

  // Paginate
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <ListingOption1 />

          <div className="row">
            {paginated.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h5 className="mb-2">No services found</h5>
                <p className="text-muted mb-0">Try adjusting filters or check back later.</p>
              </div>
            ) : (
              paginated.map((item, i) => (
                <div key={i} className="col-12 col-md-6">
                  {CardComponent ? (
                    <CardComponent data={item} />
                  ) : item?.gallery ? (
                    <PopularServiceSlideCard2 data={item} />
                  ) : (
                    <PopularServiceCard2 data={item} />
                  )}
                </div>
              ))
            )}
          </div>

          <Pagination1
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>
      <ListingSidebarModal1 />
    </>
  );
}
