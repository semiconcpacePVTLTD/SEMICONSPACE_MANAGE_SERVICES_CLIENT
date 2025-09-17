import { product1 } from "@/data/product";
import ListingOption1 from "../element/ListingOption1";
import ListingSidebarModal1 from "../modal/ListingSidebarModal1";
import Pagination1 from "./Pagination1";
import listingStore from "@/store/listingStore";
import priceStore from "@/store/priceStore";
import PopularServiceCard2 from "../card/PopularServiceCard2";
import PopularServiceSlideCard2 from "../card/PopularServiceSlideCard2";

export default function Listing2({ services }) {
  const getDeliveryTime = listingStore((state) => state.getDeliveryTime);
  const getPriceRange = priceStore((state) => state.priceRange);
  const getLevel = listingStore((state) => state.getLevel);
  const getLocation = listingStore((state) => state.getLocation);
  const getBestSeller = listingStore((state) => state.getBestSeller);
  const getDesginTool = listingStore((state) => state.getDesginTool);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getSearch = listingStore((state) => state.getSearch);

  // If dynamic services are provided (either array or {success,data}), normalize them to card shape
  const rawServices = Array.isArray(services)
    ? services
    : services?.success && Array.isArray(services?.data)
      ? services.data
      : [];

  const normalized = rawServices.map((svc) => {
    const img = Array.isArray(svc?.imgURLs) && svc.imgURLs.length ? svc.imgURLs[0] : ""; // no fallback, allow blank
    const priceRaw = svc?.milestoneRules?.advance ?? 0;
    const price = typeof priceRaw === "string" ? parseFloat(priceRaw.replace("%", "")) : Number(priceRaw) || 0;

    return {
      id: svc.id,
      // PopularServiceCard2 expects img2 for the thumbnail
      img2: img || undefined,
      category: svc.shortDescription || svc.description || "Design & Creative",
      title: svc.name,
      rating: 4.82,
      review: 94,
      author: { img: "/images/team/fl-s-1.png", name: svc.createdBy || "Unknown" },
      price,
      // fields for filters
      deliveryTime: svc.deliveryTime || "",
      level: svc.level || "",
      location: (svc.location || "").toString().toLowerCase(),
      language: svc.language || "",
      tool: svc.tool || "",
      sort: svc.sort || "best-seller",
    };
  });

  // Choose data source: dynamic (if any) else fallback mock data
  const dataSource = normalized.length ? normalized : product1;

  // delivery filter
  const deliveryFilter = (item) =>
    getDeliveryTime === "" || getDeliveryTime === "anytime" ? item : item.deliveryTime === getDeliveryTime;

  // price filter
  const priceFilter = (item) => getPriceRange.min <= item.price && getPriceRange.max >= item.price;

  // level filter
  const levelFilter = (item) => (getLevel?.length !== 0 ? getLevel.includes(item.level) : item);

  // location filter
  const locationFilter = (item) => (getLocation?.length !== 0 ? getLocation.includes(item.location) : item);

  const searchFilter = (item) => (getSearch !== "" ? item.location.split("-").join(" ").includes(getSearch.toLowerCase()) : item);

  // sort by filter
  const sortByFilter = (item) => (getBestSeller === "best-seller" ? item : item.sort === getBestSeller);

  // design tool filter
  const designToolFilter = (item) => (getDesginTool?.length !== 0 ? getDesginTool.includes(item.tool) : item);

  // speak filter
  const speakFilter = (item) => (getSpeak?.length !== 0 ? getSpeak.includes(item.language) : item);

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <ListingOption1 />
          <div className="row">
            {dataSource
              .slice(0, 12)
              .filter(deliveryFilter)
              .filter(priceFilter)
              .filter(levelFilter)
              .filter(locationFilter)
              .filter(searchFilter)
              .filter(sortByFilter)
              .filter(designToolFilter)
              .filter(speakFilter)
              .map((item, i) => (
                <div key={i} className="col-sm-6">
                  {item?.gallery?.length > 0 ? (
                    <PopularServiceSlideCard2 data={item} />
                  ) : (
                    <PopularServiceCard2 data={item} />
                  )}
                </div>
              ))}
          </div>
          <Pagination1 />
        </div>
      </section>
      <ListingSidebarModal1 />
    </>
  );
}