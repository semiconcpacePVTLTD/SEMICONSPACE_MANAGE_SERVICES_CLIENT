import React, { useEffect, useState } from "react";
import Header19 from "@/components/header/Header19";
import Hero18 from "@/components/hero/Hero18";
import BrowserCategory3 from "@/components/section/BrowserCategory3";
import CounterInfo1 from "@/components/section/CounterInfo1";
import ForClient from "@/components/section/ForClient";
import HighestRated18 from "@/components/section/HighestRated18";
import HighestRated18Shimmer from "@/components/section/HighestRated18Shimmer";
import NeedSomething18 from "@/components/section/NeedSomething18";
import Testimonials18 from "@/components/section/Testimonials18";
import TrendingService3 from "@/components/section/TrendingService3";
import TrendingService3Shimmer from "@/components/section/TrendingService3Shimmer";
import MetaComponent from "@/components/common/MetaComponent";
import LazySection from "@/components/common/LazySection";
import Footer18 from "@/components/footer/Footer18";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 18",
};

export default function HomePage18() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_BACKEND_HOST_ADMIN}:${import.meta.env.VITE_BACKEND_CATALOG_PORT}/catalog-service/listServices`
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const result = await response.json();

        const allServices = result?.data || [];
        setServices(allServices);

        // Filter service with name = "newewqdw"
        const target = allServices.find((s) => s.name === "newewqdw");
        if (target) setSelectedService(target);

        setServicesLoaded(true);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServicesLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header19 service={selectedService} services={services} />
      <div className="body_content">
        <Hero18 services={services} />
        <BrowserCategory3 />

        {/* Lazy loaded Trending Services with shimmer */}
        <LazySection
          shimmer={<TrendingService3Shimmer />}
          delay={300}
          rootMargin="50px"
        >
          <TrendingService3 services={servicesLoaded ? services : []} />
        </LazySection>

        <NeedSomething18 />
        {/* <CounterInfo1 /> */}

        {/* Lazy loaded Highest Rated Freelancers with shimmer */}
        <LazySection
          shimmer={<HighestRated18Shimmer />}
          delay={500}
          rootMargin="50px"
        >
          <HighestRated18 />
        </LazySection>

        <Testimonials18 />
        <ForClient />

      </div>
    </>
  );
}
