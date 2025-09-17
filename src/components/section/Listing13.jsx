import listingStore from "@/store/listingStore";
import FreelancerCard1 from "../card/FreelancerCard1";
import ListingOption6 from "../element/ListingOption6";
import Pagination1 from "./Pagination1";
import { freelancer1 } from "@/data/product";
import priceStore from "@/store/priceStore";
import ListingSidebarModal5 from "../modal/ListingSidebarModal5";

export default function Listing13({ freelancers = [] }) {
  const getCategory = listingStore((state) => state.getCategory);
  const priceRange = priceStore((state) => state.priceRange);
  const getLocation = listingStore((state) => state.getLocation);
  const getSearch = listingStore((state) => state.getSearch);
  const getLevel = listingStore((state) => state.getLevel);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getBestSeller = listingStore((state) => state.getBestSeller);

  // category filter
  const categoryFilter = (item) =>
    getCategory?.length !== 0 ? getCategory.includes(item.skill) : item;

  // salary filter
  const priceFilter = (item) =>
    priceRange.min <= (item.price ?? 0) && priceRange.max >= (item.price ?? 0);

  // location filter
  const locationFilter = (item) => {
    const loc = (item.location || "").toString().split(" ").join("-").toLowerCase();
    return getLocation?.length !== 0 ? getLocation.includes(loc) : item;
  };

  const searchFilter = (item) =>
    getSearch !== ""
      ? (item.location || "").toString().split("-").join(" ").toLowerCase().includes(getSearch.toLowerCase())
      : item;

  // level filter
  const levelFilter = (item) =>
    getLevel?.length !== 0 ? getLevel.includes(item.level) : item;

  // speak filter
  const languageFilter = (item) =>
    getSpeak?.length !== 0
      ? getSpeak.includes((item.language || "").toString().toLowerCase())
      : item;

  // sort by filter
  const sortByFilter = (item) =>
    getBestSeller === "best-seller" ? item : item.sort === getBestSeller;

  // Normalize incoming freelancers (API or local) to card shape
  const sourceArr = Array.isArray(freelancers)
    ? freelancers
    : freelancers?.success && Array.isArray(freelancers?.data)
      ? freelancers.data
      : freelancer1; // fallback to static if not provided

  const normalized = sourceArr.map((f, idx) => ({
    id: f.uuid || f.id || idx + 1,
    img: "/images/team/fl-1.png", // keep existing design avatar
    name: f?.name ?? f?.title ?? undefined,
    profession: f?.company_name ?? f?.profession ?? undefined,
    rating: f?.rating ?? undefined,
    reviews: f?.reviews ?? undefined,
    tags: Array.isArray(f?.skills) ? f.skills : f?.tags ?? [],
    skill: (Array.isArray(f?.skills) ? f.skills[0] : f?.skill) ?? undefined,
    price: typeof f?.hourlyRate === "number" ? f.hourlyRate : undefined,
    location: f?.location ?? undefined,
    level: f?.level ?? undefined,
    language: f?.language ?? undefined,
    sort: f?.sort ?? "best-seller",
    jobSuccess: typeof f?.job_success === "number" ? f.job_success : f?.jobSuccess ?? undefined,
  }));

  const filtered = normalized
    .slice(0, 12)
    .filter(categoryFilter)
    .filter(priceFilter)
    .filter(locationFilter)
    .filter(searchFilter)
    .filter(levelFilter)
    .filter(languageFilter)
    .filter(sortByFilter);

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <ListingOption6 />
          <div className="row">
            {filtered.map((item, i) => (
              <div key={i} className="col-md-6 col-lg-4 col-xl-3">
                <FreelancerCard1 data={item} />
              </div>
            ))}
          </div>
          <div className="row mt30">
            <Pagination1 />
          </div>
        </div>
      </section>
      <ListingSidebarModal5 />
    </>
  );
}
