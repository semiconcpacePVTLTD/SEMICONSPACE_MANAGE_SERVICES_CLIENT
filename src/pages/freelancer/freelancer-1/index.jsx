import Breadcumb16 from "@/components/breadcumb/Breadcumb16";
import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import { useEffect, useState } from "react";

import Listing13 from "@/components/section/Listing13";

import MetaComponent from "@/components/common/MetaComponent";


const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Freelancer 1",
};

export default function FreelancerPage1() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const host = import.meta.env.VITE_BACKEND_HOST || "192.168.1.30";
        const port = import.meta.env.VITE_BACKEND_PROFILE_API_PORT || import.meta.env.VITE_BACKEND_PROFILE_PORT || "8003";
        const url = `http://${host}:${port}/profile-service/freelance`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        setFreelancers(json?.data || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to load freelancers", e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Freelancer"]} />
      <Breadcumb16 />
      <Listing13 freelancers={freelancers} isLoading={loading} />
    </>
  );
}