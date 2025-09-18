import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb4 from "@/components/breadcumb/Breadcumb4";
import Listing1 from "@/components/section/Listing1";
import MetaComponent from "@/components/common/MetaComponent";
import ServiceCardService1 from "@/components/card/ServiceCardService1";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 1",
};

const API_URL = "http://192.168.1.222:9003/catalog-service/listServices";

export default function ServicePage1() {
  const location = useLocation();
  const { services } = location.state || {}; // may be undefined

  // Use navigation state if present, otherwise fetch
  const [serviceData, setServiceData] = useState(services ?? null);

  const didFetchRef = useRef(false);

  useEffect(() => {
    if (services) return; // already provided via navigation
    if (didFetchRef.current) return; // prevent double-fetch in StrictMode
    didFetchRef.current = true;

    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!ignore) setServiceData(json); // Listing1 can handle wrapper {success, message, data}
      } catch (err) {
        if (!ignore) setServiceData({ success: false, message: String(err), data: [] });
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
      {/* <TabSection1 /> */}
      <Breadcumb3 path={["Home", "Services"]} />
      <Breadcumb4 />
      <Listing1 services={serviceData ?? services ?? []} CardComponent={ServiceCardService1} />
    </>
  );
}