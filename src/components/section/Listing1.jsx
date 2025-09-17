import { product1 } from "@/data/product";
import ListingOption1 from "../element/ListingOption1";
import ListingSidebarModal1 from "../modal/ListingSidebarModal1";
import Pagination1 from "./Pagination1";
import TrendingServiceCard1 from "../card/TrendingServiceCard1";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import PopularServiceSlideCard1 from "../card/PopularServiceSlideCard1";

export default function Listing1({ services, CardComponent }) {
  const getDeliveryTime = listingStore((state) => state.getDeliveryTime);
  const getPriceRange = priceStore((state) => state.priceRange);
  const getLevel = listingStore((state) => state.getLevel);
  const getLocation = listingStore((state) => state.getLocation);
  const getBestSeller = listingStore((state) => state.getBestSeller);
  const getDesginTool = listingStore((state) => state.getDesginTool);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getSearch = listingStore((state) => state.getSearch);

  // 1) Accept either an array or a backend wrapper: { success, message, data: [] }
  const rawServices = Array.isArray(services)
    ? services
    : services?.success && Array.isArray(services?.data)
      ? services.data
      : [];

  // 2) Normalize items to the structure expected by cards/filters
  const normalized = rawServices.map((svc) => {
    const gallery = Array.isArray(svc?.imgURLs) && svc.imgURLs.length ? svc.imgURLs : null;

    // Parse advance (could be "20%", "20", or number). Fallback 0.
    const priceRaw = svc?.milestoneRules?.advance ?? 0;
    const price = typeof priceRaw === "string" ? parseFloat(priceRaw.replace("%", "")) : Number(priceRaw) || 0;

    return {
      id: svc.id,
      title: svc.name,
      gallery, // used to decide slide vs. static card
      img: gallery?.[0] || "/images/header-logo.svg",
      category: svc.shortDescription || svc.description || "",
      rating: 4.5,
      review: 12,
      author: { name: svc.createdBy || "Unknown", img: "/images/user-default.png" },
      price,
      // Optional fields used by filters (defaults avoid crashes)
      deliveryTime: svc.deliveryTime || "",
      level: svc.level || "",
      location: (svc.location || "").toString().toLowerCase(),
      language: svc.language || "",
      tool: svc.tool || "",
      sort: svc.sort || "best-seller",
      description: svc.description || "",
      // Keep original for specialized cards
      raw: svc,
    };
  });

  // Filters
  const deliveryFilter = (item) =>
    getDeliveryTime === "" || getDeliveryTime === "anytime" ? item : item.deliveryTime === getDeliveryTime;

  const priceFilter = (item) => getPriceRange.min <= item.price && getPriceRange.max >= item.price;

  const levelFilter = (item) => (getLevel?.length !== 0 ? getLevel.includes(item.level) : item);

  const locationFilter = (item) => (getLocation?.length !== 0 ? getLocation.includes(item.location) : item);

  const searchFilter = (item) =>
    getSearch !== "" ? item.location.split("-").join(" ").includes(getSearch.toLowerCase()) : item;

  const sortByFilter = (item) => (getBestSeller === "best-seller" ? item : item.sort === getBestSeller);

  const designToolFilter = (item) => (getDesginTool?.length !== 0 ? getDesginTool.includes(item.tool) : item);

  const speakFilter = (item) => (getSpeak?.length !== 0 ? getSpeak.includes(item.language) : item);

  const filtered = normalized
    .slice(0, 12)
    .filter(deliveryFilter)
    .filter(priceFilter)
    .filter(levelFilter)
    .filter(locationFilter)
    .filter(searchFilter)
    .filter(sortByFilter)
    .filter(designToolFilter)
    .filter(speakFilter);

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <ListingOption1 />
          <div className="row">
            {filtered.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <h5 className="mb-2">No services found</h5>
                  <p className="text-muted mb-0">Try adjusting filters or check back later.</p>
                </div>
              </div>
            ) : (
              filtered.map((item, i) => (
                <div key={i} className="col-sm-6 col-xl-3">
                  {CardComponent ? (
                    <CardComponent data={item} />
                  ) : item?.gallery ? (
                    <PopularServiceSlideCard1 data={item} />
                  ) : (
                    <TrendingServiceCard1 data={item} />
                  )}
                </div>
              ))
            )}
          </div>
          <Pagination1 />
        </div>
      </section>
      <ListingSidebarModal1 />
    </>
  );
}
