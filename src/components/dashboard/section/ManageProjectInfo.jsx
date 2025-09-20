import { Link } from "react-router-dom";
import DashboardNavigation from "../header/DashboardNavigation";
import { useEffect, useMemo, useState } from "react";
import Pagination1 from "@/components/section/Pagination1";
import ManageProjectCard from "../card/ManageProjectCard";
import ProposalModal1 from "../modal/ProposalModal1";
import DeleteModal from "../modal/DeleteModal";

const tab = [
  "Posted Projects",
  "Pending Projects",
  "Ongoing Services",
  "Expired Projects",
  "Completed Services",
  "Canceled Services",
];

const TAB_STATUS = {
  0: null, // all
  1: ["Created", "Pending"],
  2: ["Active", "Ongoing"],
  3: ["Expired"],
  4: ["Completed"],
  5: ["Canceled", "Cancelled"],
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

export default function ManageProjectInfo() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const host = import.meta.env.VITE_BACKEND_HOST_ADMIN;
    const port = import.meta.env.VITE_BACKEND_PROJECT_PORT;

    const userId =
      getUserIdFromStorage() || "aead429f-6359-40a8-b4f4-0facc7e09b07";

    if (!host || !port || !userId) return;

    const url = `http://${host}:${port}/project-service/userAllProject?userId=${encodeURIComponent(
      userId
    )}`;

    let mounted = true;
    setLoading(true);
    setError("");

    fetch(url)
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
        const list = Array.isArray(data?.projects) ? data.projects : [];
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
  }, []);

  // Filter by tab
  const filtered = useMemo(() => {
    const statuses = TAB_STATUS[selectedTab];
    if (!statuses) return projects;
    return projects.filter((p) => statuses.includes(p?.status));
  }, [projects, selectedTab]);

  // Apply pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProjects = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // reset to page 1 if filtered changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, projects]);

  return (
    <>
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <DashboardNavigation />
          </div>
          <div className="col-lg-9">
            <div className="dashboard_title_area">
              <h2>Manage Project</h2>
              <p className="text">Your projects fetched from Project Service.</p>
            </div>
          </div>
          {/* <div className="col-lg-3">
            <div className="text-lg-end">
              <Link
                to="/create-projects"
                className="ud-btn btn-dark default-box-shadow2"
              >
                Create Project <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div> */}
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
                          <td colSpan={4} className="text-danger">
                            {error}
                          </td>
                        </tr>
                      )}
                      {!loading && !error && paginatedProjects.length === 0 && (
                        <tr>
                          <td colSpan={4}>No projects found.</td>
                        </tr>
                      )}
                      {!loading &&
                        !error &&
                        paginatedProjects.map((p) => (
                          <ManageProjectCard
                            key={p._id || p.projectId}
                            project={p}
                          />
                        ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
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
      <ProposalModal1 />
      <DeleteModal />
    </>
  );
}
