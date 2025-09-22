import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { Navigation, Pagination } from "swiper";

import TrendingServiceCard1 from "../card/TrendingServiceCard1";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TrendingService3({ services, title = "Trending Services", link = "/service-2", linkText = "All Services" }) {
  console.log("services in trending", services);

  const [showSwiper, setShowSwiper] = useState(false);
  useEffect(() => {
    setShowSwiper(true);
  }, []);

  // Normalize backend services to card schema
  const rawServices = Array.isArray(services)
    ? services
    : services?.success && Array.isArray(services?.data)
      ? services.data
      : [];

  const normalized = rawServices.map((svc) => {
    const gallery = Array.isArray(svc?.imgURLs) && svc.imgURLs.length ? svc.imgURLs : null;
    const priceRaw = svc?.milestoneRules?.advance ?? 0;
    const price = typeof priceRaw === "string" ? parseFloat(priceRaw.replace("%", "")) : Number(priceRaw) || 0;
    return {
      id: svc.id,
      title: svc.name,
      gallery,
      img: gallery?.[0] || "/images/header-logo.svg",
      category: svc.shortDescription || svc.description || "",
      rating: 4.5,
      review: 12,
      author: { name: svc.createdBy || "Unknown", img: "/images/user-default.png" },
      price,
      raw: svc,
    };
  });

  // limit and count for swiper config
  const items = normalized.slice(0, 8);
  const count = items.length;

  return (
    <>
      <section className="pt-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-9 wow fadeInUp">
              <div className="main-title">
                <h2 className="title">Services we Offer</h2>
                <p className="paragraph">
                  Explore a variety of fresh and creative services tailored to your needs.
                </p>
              </div>
            </div>

          </div>

          <div className="row align-items-center">
            <div className="col-lg-12">
              {showSwiper && count > 0 && (
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  freeMode={true}
                  loop={count > 1}
                  className="mySwiper"
                  navigation={{
                    prevEl: ".btn__prev__011",
                    nextEl: ".btn__next__011",
                  }}
                  pagination={{
                    el: ".swiper__pagination__011",
                    clickable: true,
                  }}
                  modules={[Navigation, Pagination]}
                  breakpoints={{
                    0: {
                      slidesPerView: Math.min(1, count),
                      slidesPerGroup: Math.min(1, count),
                    },
                    768: {
                      slidesPerView: Math.min(2, count),
                      slidesPerGroup: Math.min(2, count),
                    },
                    992: {
                      slidesPerView: Math.min(3, count),
                      slidesPerGroup: Math.min(3, count),
                    },
                    1200: {
                      slidesPerView: Math.min(4, count),
                      slidesPerGroup: Math.min(4, count),
                    },
                  }}
                >
                  {items.map((item, i) => (
                    <SwiperSlide key={i}>
                      <TrendingServiceCard1 data={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
