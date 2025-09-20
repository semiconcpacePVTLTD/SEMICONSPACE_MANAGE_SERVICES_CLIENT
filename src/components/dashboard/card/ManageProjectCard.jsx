import { useNavigate } from "react-router-dom";

export default function ManageProjectCard({ project }) {
  const navigate = useNavigate();

  // Core fields from payload (with fallbacks for minor key typos)
  const title = project?.projectTitle || "Untitled Project";
  const category = project?.serviceType || "—";
  const status = project?.status || "—";
  const createdAt = project?.createdAt
    ? new Date(project.createdAt).toLocaleString()
    : "—";
  const userName = project?.userName || project?.userNmae || "—";
  const userEmail = project?.userEmail || "";
  const freelancerName = project?.freelancerName || project?.freelancerNmae || "—";
  const freelancerEmail = project?.freelancerEmail || "";
  const amount = project?.total_amount ?? 0;

  // Prefer backend projectId (UUID) if present; fallback to _id
  const projectParam = project?.projectId || project?._id;

  const handleViewTickets = () => {
    if (!projectParam) return;
    // Navigate to /message with the correct project identifier and pass freelancer name for ticket creation
    navigate(`/message?projectId=${encodeURIComponent(projectParam)}`, {
      state: { projectId: projectParam, freelancerName, project },
    });
  };

  return (
    <>
      <tr>
        <th scope="row">
          <div className="freelancer-style1 box-shadow-none row m-0 p-0 align-items-lg-end">
            <div className="d-lg-flex px-0">
              <div className="details mb15-md-md">
                <h5 className="title mb10">{title}</h5>

                <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                  <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                  {createdAt}
                </p>

                <p className="mb-0 fz14 list-inline-item mb5-sm text-thm">
                  <i className="flaticon-contract fz16 vam me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                  Status: {status}
                </p>

                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <strong>Service:</strong> {category}
                </p>

                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <strong>Client:</strong> {userName}
                  {userEmail ? ` (${userEmail})` : ""}
                </p>

                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <strong>Freelancer:</strong> {freelancerName}
                  {freelancerEmail ? ` (${freelancerEmail})` : ""}
                </p>

                <p className="mb-0 fz14 list-inline-item mb5-sm">
                  <strong>Amount:</strong> {amount}
                </p>
              </div>
            </div>
          </div>
        </th>
        <td className="vam">
          <span className="fz15 fw400">{category}</span>
        </td>
       <td>
  <div className="d-flex">
    <button
      className="btn btn-success rounded-pill px-4 fw-bold d-flex align-items-center"
      id={`view-${projectParam}`}
      onClick={handleViewTickets}
    >
      <span className="text-white">View Tickets</span>
      <span className="ms-2 text-white">&gt;</span>
    </button>
  </div>
</td>


      </tr>
    </>
  );
}