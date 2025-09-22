import { useEffect, useMemo, useState } from "react";
import DashboardNavigation from "../header/DashboardNavigation";
import Pagination1 from "@/components/section/Pagination1";
import ManageProjectCard from "../card/ManageProjectCard";

// Tabs reused from ManageProjectInfo but focused on active/ongoing
const tab = ["Active/Ongoing", "Completed", "Canceled"];
const TAB_STATUS = {
  0: ["Active", "Ongoing"],
  1: ["Completed"],
  2: ["Canceled", "Cancelled"],
};

function getUserIdFromStorage() {
  const direct = localStorage.getItem("userId");
  if (direct) return direct;
  const authRaw = localStorage.getItem("auth");
  if (authRaw) {
    try {
      const auth = JSON.parse(authRaw);
      return (
        auth?.data?.user?.userId ||
        auth?.data?.user?.id ||
        auth?.user?.userId ||
        auth?.user?.id ||
        auth?.userId ||
        null
      );
    } catch (e) {}
  }
  return null;
}

export default function WorkingProjectInfo() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProjects = () => {
    function getRoleId() {
      try {
        const direct = localStorage.getItem("role_id") ?? localStorage.getItem("roleid");
        if (direct) {
          try {
            const parsed = JSON.parse(direct);
            if (Array.isArray(parsed)) return Number(parsed[0]) || 0;
            return Number(parsed) || Number(direct) || 0;
          } catch {
            return Number(direct) || 0;
          }
        }
        const raw = localStorage.getItem("auth");
        if (raw) {
          const auth = JSON.parse(raw);
          const val = auth?.data?.user?.role_id ?? auth?.data?.role_id ?? auth?.user?.role_id ?? auth?.role_id ?? 0;
          if (Array.isArray(val)) return Number(val[0]) || 0;
          return Number(val) || 0;
        }
      } catch {}
      return 0;
    }

    const roleId = getRoleId();
    const userId = getUserIdFromStorage();

    function getFreelancerIdFromStorage() {
      try {
        const direct =
          localStorage.getItem("freelancerId") ||
          localStorage.getItem("freelancer_id") ||
          localStorage.getItem("freelancerUserId");
        if (direct) return direct;
        const raw = localStorage.getItem("auth");
        if (raw) {
          const auth = JSON.parse(raw);
          return (
            auth?.data?.user?.freelancerId ||
            auth?.data?.user?.freelancer_id ||
            auth?.user?.freelancerId ||
            auth?.user?.freelancer_id ||
            null
          );
        }
      } catch {}
      return null;
    }

    const freelancerId = getFreelancerIdFromStorage();

    // Per requirement: pass id in query only (do not send in body)
    // role_id === 1 -> send userId; role_id === 2/3 -> send freelancerId
    const baseUrl = "http://192.168.1.222:9006/project-service/userFreelancerActiveAllProject";
    const url = roleId === 1
      ? `${baseUrl}?userId=${encodeURIComponent(userId || "")}`
      : `${baseUrl}?freelancerId=${encodeURIComponent(freelancerId || userId || "")}`;

    let mounted = true;
    setLoading(true);
    setError("");

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.message || `Request failed with ${res.status}`;
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.projects)
          ? data.projects
          : [];
        setProjects(list);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load projects");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanup = fetchProjects();
    return cleanup;
  }, []);

  const filtered = useMemo(() => {
    const statuses = TAB_STATUS[selectedTab];
    if (!statuses) return projects;
    return projects.filter((p) => statuses.includes(p?.status));
  }, [projects, selectedTab]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProjects = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, projects]);

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <DashboardNavigation />
        </div>
        <div className="col-lg-9">
          <div className="dashboard_title_area">
            <h2>Working Projects</h2>
            <p className="text">Active/ongoing projects fetched from Project Service.</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="navtab-style1">
              <div className="packages_table table-responsive">
                <table className="table-style3 table at-savesearch">
                  <thead className="t-head">
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Category</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="t-body">
                    {loading && (
                      <tr>
                        <td colSpan={4}>Loading...</td>
                      </tr>
                    )}
                    {!loading && error && (
                      <tr>
                        <td colSpan={4} className="text-danger">{error}</td>
                      </tr>
                    )}
                    {!loading && !error && paginatedProjects.length === 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div className="py-5 d-flex flex-column align-items-center justify-content-center text-muted">
                            <i className="fal fa-folder-open fa-3x mb-3" />
                            <div className="fw-semibold">No working projects found</div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      !error &&
                      paginatedProjects.map((p) => (
                        <ManageProjectCard key={p._id || p.projectId} project={p} onRefresh={fetchProjects} />
                      ))}
                  </tbody>
                </table>

                {totalItems > itemsPerPage && (
                  <div className="mt30">
                    <Pagination1
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}