import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb4 from "@/components/breadcumb/Breadcumb4";
import TrendingService7 from "@/components/section/TrendingService7";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";

const API_URL = "http://192.168.1.222:9003/catalog-service/listServices";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 2",
};

export default function ServicePage2() {
  const location = useLocation();
  const { services } = location.state || {}; // may be undefined

  const [serviceData, setServiceData] = useState(services ?? null);
  const [loading, setLoading] = useState(!services); // loading if no services provided

  useEffect(() => {
    if (services) return; // already provided via navigation

    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!ignore) setServiceData(json);
      } catch (err) {
        if (!ignore) setServiceData({ success: false, message: String(err), data: [] });
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [services]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Services"]} />
      <Breadcumb4 />
      <TrendingService7 services={serviceData ?? services ?? []} title="Our Popular Services" link="" isLoading={loading} />
    </>
  );
}
