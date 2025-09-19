import React, { useEffect, useState } from "react";
import Header19 from "@/components/header/Header19";
import Hero18 from "@/components/hero/Hero18";
import BrowserCategory3 from "@/components/section/BrowserCategory3";
import CounterInfo1 from "@/components/section/CounterInfo1";
import ForClient from "@/components/section/ForClient";
import HighestRated18 from "@/components/section/HighestRated18";
import NeedSomething18 from "@/components/section/NeedSomething18";
import Testimonials18 from "@/components/section/Testimonials18";
import TrendingService3 from "@/components/section/TrendingService3";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 18",
};

export default function HomePage18() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        console.error("Error fetching services:", err);
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
        <TrendingService3 services={services} isLoading={loading} />
        <NeedSomething18 />
        {/* <CounterInfo1 /> */}
        <HighestRated18 />
        <Testimonials18 />
        <ForClient />
      </div>
    </>
  );
}
