import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";

import ServiceDetail1 from "@/components/section/ServiceDetail1";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";

const API_URL = "http://192.168.1.222:9003/catalog-service/getServiceById";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service Single",
};

export default function ServicePageSingle11() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const url = `${API_URL}?id=${encodeURIComponent(id)}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!ignore) setService(json?.data ?? null);
      } catch (e) {
        if (!ignore) setService(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Services"]} />
      <Breadcumb8 service={service} loading={loading} />
      <ServiceDetail1 service={service} loading={loading} />
    </>
  );
}
