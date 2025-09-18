import listingStore from "@/store/listingStore";
import ListingOption2 from "../element/ListingOption2";
import ListingSidebar5 from "../sidebar/ListingSidebar5";
import Pagination1 from "./Pagination1";
import priceStore from "@/store/priceStore";
import { freelancer1 } from "@/data/product";
import FreelancerCard2 from "../card/FreelancerCard2";
import ListingSidebarModal5 from "../modal/ListingSidebarModal5";

export default function Listing14({ freelancers = [], isLoading = false, skeletonCount = 9 }) {
  const getCategory = listingStore((state) => state.getCategory);
  const priceRange = priceStore((state) => state.priceRange);
  const getLocation = listingStore((state) => state.getLocation);
  const getSearch = listingStore((state) => state.getSearch);
  const getLevel = listingStore((state) => state.getLevel);
  const getSpeak = listingStore((state) => state.getSpeak);
  const getBestSeller = listingStore((state) => state.getBestSeller);

  // Determine source and normalize to card shape
  const sourceArr = Array.isArray(freelancers)
    ? freelancers
    : freelancers?.success && Array.isArray(freelancers?.data)
      ? freelancers.data
      : freelancer1;

  const normalized = sourceArr.map((f, idx) => ({
    id: f?.uuid || f?.id || idx + 1,
    img: f?.img || "/images/team/fl-1.png",
    name: f?.name ?? f?.title ?? "",
    profession: f?.company_name ?? f?.profession ?? "",
    rating: typeof f?.rating === "number" ? f.rating : 0,
    reviews: typeof f?.reviews === "number" ? f.reviews : 0,
    tags: Array.isArray(f?.skills) ? f.skills : f?.tags ?? [],
    skill: (Array.isArray(f?.skills) ? f.skills[0] : f?.skill) ?? "",
    price:
      typeof f?.hourlyRate === "number"
        ? f.hourlyRate
        : typeof f?.price === "number"
          ? f.price
          : 0,
    location: (f?.location ?? "").toString(),
    level: f?.level ?? "",
    language: (f?.language ?? "").toString(),
    sort: f?.sort ?? "best-seller",
    jobSuccess:
      typeof f?.job_success === "number" ? f.job_success : f?.jobSuccess ?? undefined,
  }));

  // category filter
  const categoryFilter = (item) =>
    getCategory?.length !== 0 ? getCategory.includes(item.skill) : item;

  // salary filter
  const priceFilter = (item) =>
    priceRange.min <= (item.price ?? 0) && priceRange.max >= (item.price ?? 0);

  // location filter
  const locationFilter = (item) => {
    const loc = (item.location || "").split(" ").join("-").toLowerCase();
    return getLocation?.length !== 0 ? getLocation.includes(loc) : item;
  };

  const searchFilter = (item) =>
    getSearch !== ""
      ? (item.location || "").split("-").join(" ").toLowerCase().includes(getSearch.toLowerCase())
      : item;

  // level filter
  const levelFilter = (item) =>
    getLevel?.length !== 0 ? getLevel.includes(item.level) : item;

  // speak filter
  const languageFilter = (item) =>
    getSpeak?.length !== 0
      ? getSpeak.includes((item.language || "").toLowerCase())
      : item;

  // sort by filter
  const sortByFilter = (item) =>
    getBestSeller === "best-seller" ? item : item.sort === getBestSeller;

  const filtered = normalized
    .slice(0, 9)
    .filter(categoryFilter)
    .filter(priceFilter)
    .filter(locationFilter)
    .filter(searchFilter)
    .filter(levelFilter)
    .filter(languageFilter)
    .filter(sortByFilter);

  const SkeletonCard = () => (
    <div className="freelancer-style1 text-center bdr1 hover-box-shadow">
      <style>{`
        .skeleton { position: relative; overflow: hidden; background: #e9ecef; }
        .skeleton::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%);
          background: linear-gradient(90deg, rgba(233,236,239,0) 0%, rgba(255,255,255,0.6) 50%, rgba(233,236,239,0) 100%);
          animation: shimmer 1.2s infinite; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>
      <div className="thumb w90 mb25 mx-auto position-relative rounded-circle">
        <div className="rounded-circle mx-auto skeleton" style={{ width: 90, height: 90 }} />
      </div>
      <div className="details">
        <div className="skeleton mx-auto" style={{ width: 140, height: 16, borderRadius: 4 }} />
        <div className="skeleton mx-auto mt10" style={{ width: 100, height: 12, borderRadius: 4 }} />
        <div className="d-flex align-items-center justify-content-center mt15" style={{ gap: 8 }}>
          <span className="skeleton" style={{ width: 50, height: 22, borderRadius: 4 }} />
          <span className="skeleton" style={{ width: 60, height: 22, borderRadius: 4 }} />
          <span className="skeleton" style={{ width: 40, height: 22, borderRadius: 4 }} />
        </div>
        <hr className="opacity-100 mt20 mb15" />
        <div className="fl-meta d-flex align-items-center justify-content-between">
          <span className="skeleton" style={{ width: 70, height: 32, borderRadius: 4 }} />
          <span className="skeleton" style={{ width: 70, height: 32, borderRadius: 4 }} />
          <span className="skeleton" style={{ width: 90, height: 32, borderRadius: 4 }} />
        </div>
        <div className="d-grid mt15">
          <span className="skeleton" style={{ width: "100%", height: 38, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <ListingSidebar5 />
            </div>
            <div className="col-lg-9">
              <ListingOption2 itemLength={filtered?.length || 0} />
              <div className="row">
                {isLoading
                  ? Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={i} className="col-sm-6 col-xl-4">
                      <SkeletonCard />
                    </div>
                  ))
                  : filtered?.length
                    ? filtered.map((item, i) => (
                      <div key={i} className="col-sm-6 col-xl-4">
                        <FreelancerCard2 data={item} />
                      </div>
                    ))
                    : "Data not found!"}
              </div>
              <div className="row mt30">
                <Pagination1 totalItems={filtered.length} itemsPerPage={9} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ListingSidebarModal5 />
    </>
  );
}
