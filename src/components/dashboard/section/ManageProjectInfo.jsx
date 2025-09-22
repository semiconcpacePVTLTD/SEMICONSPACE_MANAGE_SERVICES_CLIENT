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
    // Build new endpoint based on role: role_id === 1 -> pass userId, else pass freelancerId
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
    const userId = getUserIdFromStorage() || "aead429f-6359-40a8-b4f4-0facc7e09b07";

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
const paramName = roleId === 1 ? "userId" : "freelancerId";
const idVal = roleId === 1 ? userId : (freelancerId || userId);

if (!idVal) return;

const url = `http://192.168.1.222:9006/project-service/userFreelancerAllProject?${paramName}=${encodeURIComponent(idVal)}`;

let mounted = true;
setLoading(true);
setError("");

fetch(url, {
  method: "POST", // <-- POST method
  headers: {
    "Content-Type": "application/json",
  },
  // no body needed since param is in URL
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
      <style>{`
        .ud-btn.btn-dark.default-box-shadow2:disabled,
        .ud-btn.btn-dark.default-box-shadow2.disabled {
          background-color: #adb5bd !important;
          border-color: #adb5bd !important;
          color: #fff !important;
          opacity: 1 !important;
          cursor: not-allowed !important;
        }
        .btn-outline-success:disabled,
        .btn-outline-danger:disabled {
          color: #6c757d !important;
          border-color: #ced4da !important;
          background-color: #e9ecef !important;
          opacity: 1 !important;
          cursor: not-allowed !important;
        }
        .btn-outline-success:disabled i,
        .btn-outline-danger:disabled i {
          color: #6c757d !important;
        }
      `}</style>
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
                          <td colSpan={4}>
                            <div className="py-5 d-flex flex-column align-items-center justify-content-center text-muted">
                              <i className="fal fa-folder-open fa-3x mb-3" />
                              <div className="fw-semibold">No projects found for you</div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        !error &&
                        paginatedProjects.map((p) => (
                          <ManageProjectCard
                            key={p._id || p.projectId}
                            project={p}
                            actionsMode="tickets"
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
