import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb8 from "@/components/breadcumb/Breadcumb8";

import ServiceDetails3 from "@/components/section/ServiceDetails3";

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
    if (!id) return;

    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const url = `${API_URL}?id=${encodeURIComponent(id)}`;
        console.log('Fetching service:', url);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        console.log('Service data received:', json);
        if (!ignore) {
          // Handle different API response formats
          const serviceData = json.data ? json.data : json;
          setService(serviceData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading service:', err);
        if (!ignore) {
          setService({ success: false, message: String(err), data: null });
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  // Show error state if service failed to load
  if (!loading && service?.success === false) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <Breadcumb3 path={["Home", "Services", "Error"]} />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle text-warning mb-3" style={{ fontSize: "3rem" }}></i>
                <h3 className="mb-3">Service Not Found</h3>
                <p className="text-muted mb-4">
                  The service you're looking for could not be found or may have been removed.
                </p>
                <p className="small text-muted mb-4">
                  Service ID: {id}<br />
                  Error: {service?.message}
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-primary me-2"
                >
                  Go Back
                </button>
                <a href="/service-2" className="btn btn-outline-primary">
                  Browse Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Services", service?.title || service?.name || "Service Details"]} />
      <Breadcumb8 service={service} loading={loading} />
      <ServiceDetails3 service={service} loading={loading} />
    </>
  );
}