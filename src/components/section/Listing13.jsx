import { useState } from "react";
import listingStore from "@/store/listingStore";
import FreelancerCard1 from "../card/FreelancerCard1";
import FreelancerCardSkeleton from "../card/FreelancerCardSkeleton";
import ListingOption6 from "../element/ListingOption6";
import ListingOptionSkeleton from "../element/ListingOptionSkeleton";
import Pagination1 from "./Pagination1";
import PaginationSkeleton from "./PaginationSkeleton";
import { freelancer1 } from "@/data/product";
import priceStore from "@/store/priceStore";
import ListingSidebarModal5 from "../modal/ListingSidebarModal5";

export default function Listing13({ freelancers = [], isLoading = false, skeletonCount = 12 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    img: f?.profile_image || "/images/team/fl-1.png", // use profile image from API, fallback to static
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

  const filteredAll = normalized
    .filter(categoryFilter)
    .filter(priceFilter)
    .filter(locationFilter)
    .filter(searchFilter)
    .filter(levelFilter)
    .filter(languageFilter)
    .filter(sortByFilter);

  // Slice by current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginated = filteredAll.slice(startIndex, endIndex);

  return (
    <>
      <section className="pt30 pb90">
        <div className="container">

          <div className="row">
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4 col-xl-3">
                  <FreelancerCardSkeleton />
                </div>
              ))
              : filteredAll.length === 0 ? (
                <div className="col-12 text-center">
                  <p>No Freelancer found at the moment</p>
                </div>
              ) : (
                paginated.map((item, i) => (
                  <div key={i} className="col-md-6 col-lg-4 col-xl-3">
                    <FreelancerCard1 data={item} />
                  </div>
                ))
              )}
          </div>
          {isLoading ? (
            <PaginationSkeleton />
          ) : (
            <div className="row mt30">
              <Pagination1
                totalItems={filteredAll.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>
      <ListingSidebarModal5 />
    </>
  );
}
