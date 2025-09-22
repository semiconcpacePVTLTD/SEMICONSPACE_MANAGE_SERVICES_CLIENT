import Breadcumb10 from "@/components/breadcumb/Breadcumb10";
import Breadcumb10Shimmer from "@/components/breadcumb/Breadcumb10Shimmer";
import Breadcumb17 from "@/components/breadcumb/Breadcumb17";
import Breadcumb17Shimmer from "@/components/breadcumb/Breadcumb17Shimmer";
import TabSection1 from "@/components/section/TabSection1";
import FreelancerDetail1 from "@/components/section/FreelancerDetail1";
import FreelancerDetail1Shimmer from "@/components/section/FreelancerDetail1Shimmer";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Freelancer Single",
};

export default function FreelancerPageSingle11() {
  const { id } = useParams();
  const [data, setData] = useState(null); // { profile, profile_details }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const host = import.meta.env.VITE_BACKEND_HOST || "192.168.1.30";
        const port = import.meta.env.VITE_BACKEND_PROFILE_PORT || "8002";
        const url = `http://${host}:${port}/profile-service/getdetails`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: id }),
          signal: controller.signal,
        });
        const json = await res.json();
        // Accept either {profile, profile_details} or {data: {profile, profile_details}}
        setData(json?.data ?? json);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Failed to load profile details", e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    return () => controller.abort();
  }, [id]);

  return (
    <>
      <MetaComponent meta={metadata} />
      {loading ? (
        <>
          <Breadcumb10Shimmer />
          <Breadcumb17Shimmer />
          <FreelancerDetail1Shimmer />
        </>
      ) : (
        <>
          <Breadcumb10 path={["Home", "Services"]} />
          <Breadcumb17 data={data} />
          <FreelancerDetail1 data={data} />
        </>
      )}
    </>
  );
}
