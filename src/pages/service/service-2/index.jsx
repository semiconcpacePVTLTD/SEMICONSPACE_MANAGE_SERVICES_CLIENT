import { useEffect, useState, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb4 from "@/components/breadcumb/Breadcumb4";
import TrendingService7 from "@/components/section/TrendingService7";
import TrendingService7Shimmer from "@/components/section/TrendingService7Shimmer";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";

const API_URL = "http://192.168.1.222:9003/catalog-service/listServices";

const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 2",
};

export default function ServicePage2() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { services } = location.state || {}; // may be undefined

  const [serviceData, setServiceData] = useState(services ?? null);
  const [loading, setLoading] = useState(!services); // Only load if services not provided

  // Get search and category parameters
  const searchQuery = searchParams.get('search');
  const categoryFilter = searchParams.get('category');

  // Filter services based on search and category parameters
  const filteredServices = useMemo(() => {
    if (!serviceData?.data) return null;

    let filtered = [...serviceData.data];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(service =>
        (service.name && service.name.toLowerCase().includes(query)) ||
        (service.title && service.title.toLowerCase().includes(query)) ||
        (service.description && service.description.toLowerCase().includes(query)) ||
        (service.category && service.category.toLowerCase().includes(query)) ||
        (service.tags && service.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter.trim()) {
      const category = categoryFilter.toLowerCase().trim();
      filtered = filtered.filter(service =>
        service.category && service.category.toLowerCase().includes(category)
      );
    }

    return {
      ...serviceData,
      data: filtered
    };
  }, [serviceData, searchQuery, categoryFilter]);

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
        if (!ignore) {
          setServiceData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setServiceData({ success: false, message: String(err), data: [] });
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [services]);

  // Generate dynamic title based on search/filter parameters
  const getPageTitle = () => {
    if (searchQuery && categoryFilter) {
      return `Search results for "${searchQuery}" in ${categoryFilter}`;
    } else if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    } else if (categoryFilter) {
      return `Services in ${categoryFilter}`;
    }
    return "Our Popular Services";
  };

  // Generate breadcrumb path based on parameters
  const getBreadcrumbPath = () => {
    const path = ["Home", "Services"];
    if (searchQuery) {
      path.push(`Search: ${searchQuery}`);
    } else if (categoryFilter) {
      path.push(categoryFilter);
    }
    return path;
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={getBreadcrumbPath()} />
      <Breadcumb4 />

      {/* Search/Filter Indicators */}
      {(searchQuery || categoryFilter) && (
        <section className="pt30 pb30">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="search-indicators mb20">
                  {searchQuery && (
                    <span className="badge bg-primary me-2 p-2">
                      <i className="fas fa-search me-1"></i>
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {categoryFilter && (
                    <span className="badge bg-success me-2 p-2">
                      <i className="fas fa-tag me-1"></i>
                      Category: {categoryFilter}
                    </span>
                  )}
                  <small className="text-muted ms-2">
                    {filteredServices?.data ?
                      `${filteredServices.data.length} service${filteredServices.data.length !== 1 ? 's' : ''} found` :
                      'Loading results...'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <TrendingService7Shimmer title={getPageTitle()} />
      ) : (
        <TrendingService7
          services={filteredServices ?? serviceData ?? services ?? []}
          title={getPageTitle()}
          link=""
        />
      )}
    </>
  );
}
