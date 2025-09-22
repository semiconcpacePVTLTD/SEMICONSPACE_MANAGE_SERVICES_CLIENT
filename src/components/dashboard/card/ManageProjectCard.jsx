import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageProjectCard({ project, actionsMode = "verify", onRefresh }) {
  // Core fields from payload (with fallbacks for minor key typos)
  const title = project?.projectTitle || "Untitled Project";
  const category = project?.serviceType || "—";
  const status = project?.status || "—";
  const createdAt = project?.createdAt ? new Date(project.createdAt).toLocaleString() : "—";
  const userName = project?.userName || project?.userNmae || "—";
  const userEmail = project?.userEmail || "";
  const freelancerName = project?.freelancerName || project?.freelancerNmae || "—";
  const freelancerEmail = project?.freelancerEmail || "";
  const amount = project?.total_amount ?? 0;

  // Prefer backend projectId (UUID) if present; fallback to _id
  const projectParam = project?.projectId || project?._id;

  // Milestones (might be missing)
  const milestones = Array.isArray(project?.finalized_milestones) ? project.finalized_milestones : [];

  // UI helpers
  const statusPillClass = (() => {
    const s = String(status || "").toLowerCase();
    if (s.includes("active") || s.includes("approved") || s.includes("success")) return "bg-success-subtle text-success";
    if (s.includes("development") || s.includes("in progress") || s.includes("pending")) return "bg-secondary-subtle text-secondary";
    if (s.includes("rejected")) return "bg-danger-subtle text-danger";
    return "bg-secondary-subtle text-secondary";
  })();

  function isImageUrl(url) {
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(String(url || ""));
  }

  function getMilestoneStatus(ms = {}) {
    const approved = !!ms?.approvalAt;
    const s = String(ms?.status || (approved ? "approved" : ""))?.toLowerCase?.() || "";
    let cls = "bg-secondary-subtle text-secondary";
    if (approved || s.includes("approved") || s.includes("completed")) cls = "bg-success-subtle text-success";
    else if (s.includes("rejected")) cls = "bg-danger-subtle text-danger";
    else if (s.includes("pending") || s.includes("approval")) cls = "bg-warning-subtle text-warning";
    const label = approved ? "Approved" : (ms?.status || "—");
    return { label, cls, approved };
  }

  // Normalize a milestone to backend-required shape
  function toISODate(v) {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d) ? "" : d.toISOString();
  }
  function normalizeMilestone(m = {}) {
    return {
      title: m?.title || m?.name || m?.milestone || "milestone_Advance",
      amount: Number(m?.amount ?? m?.advance ?? m?.milestoneAmount ?? m?.price ?? 0),
      start_date: toISODate(m?.start_date || m?.startDate || m?.start || m?.from),
      end_date: toISODate(m?.end_date || m?.endDate || m?.end || m?.to),
      notes: m?.notes || m?.description || "",
    };
  }

  // Helpers to read IDs from localStorage
  function getUserIdFromStorage() {
    const direct = localStorage.getItem("userId");
    if (direct) return direct;
    try {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        const auth = JSON.parse(authRaw);
        return (
          auth?.data?.user?.userId ||
          auth?.data?.user?.id ||
          auth?.user?.userId ||
          auth?.user?.id ||
          auth?.userId ||
          null
        );
      }
    } catch {}
    return null;
  }

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

  const roleId = getRoleId();

  // UI state for modal, milestone selection and attachments (freelancer-only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Verify modal state (client role)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyMilestoneIndex, setVerifyMilestoneIndex] = useState(0);
  const [verifyingId, setVerifyingId] = useState("");

  useEffect(() => {
    if (isModalOpen && milestones.length > 0) {
      const firstAvailable = milestones.findIndex((m) => !m?.approvalAt);
      setSelectedMilestoneIndex(firstAvailable > -1 ? firstAvailable : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectParam, isModalOpen]);

  const closeModal = () => {
    if (saving) return; // prevent closing while saving
    setIsModalOpen(false);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitError("");
    setSubmitSuccess("");

    if (!projectParam) {
      Swal.fire({ icon: "error", title: "Missing projectId" });
      return;
    }
    const selectedMilestoneObj = milestones?.[selectedMilestoneIndex];
    if (!selectedMilestoneObj) {
      Swal.fire({ icon: "error", title: "Please select a milestone" });
      return;
    }
    if (!attachmentFile) {
      Swal.fire({ icon: "error", title: "Please select a document to upload" });
      return;
    }

    const userId = getUserIdFromStorage();
    const freelancerId = project?.freelancerId || getFreelancerIdFromStorage();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("projectId", String(projectParam));
      if (userId) formData.append("userId", String(userId));
      if (freelancerId) formData.append("freelancerId", String(freelancerId));
      formData.append("document", attachmentFile);
      // Backend expects an array with the full milestone JSON
      const normalized = normalizeMilestone(selectedMilestoneObj);
      formData.append("finalized_milestones", JSON.stringify([normalized]));
      formData.append("uploadDescription", String(description || ""));

      const res = await fetch(
        "http://192.168.1.222:9006/project-service/milestonesUpload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || `Upload failed with ${res.status}`;
        throw new Error(msg);
      }

      setSubmitSuccess(data?.message || "Milestone uploaded successfully");
      await Swal.fire({ icon: "success", title: data?.message || "Milestone uploaded successfully" });

      // Optionally clear fields
      setAttachmentFile(null);
      setDescription("");

      // Trigger parent refresh after user confirms success
      try { typeof onRefresh === "function" && onRefresh(); } catch {}

      // Close after a short delay so user can read success
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
    } catch (err) {
      setSubmitError(err?.message || "Failed to upload milestone");
      Swal.fire({ icon: "error", title: err?.message || "Failed to upload milestone" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr>
        <th scope="row">
          <div className="bg-white rounded-3 shadow-sm p-3 w-100">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h5 className="mb-1 fw-semibold">{title}</h5>
                <div className="small text-muted d-flex align-items-center gap-2">
                  <i className="flaticon-30-days fz16 vam text-thm2" />
                  <span>{createdAt}</span>
                </div>
              </div>
              <div className="text-end">
                <div className="fw-semibold">₹ {Number(amount || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-2 d-flex align-items-center gap-2 flex-wrap">
              <span className={`badge rounded-pill ${statusPillClass}`}>{status}</span>
              <span className="badge rounded-pill bg-secondary-subtle text-secondary">{category}</span>
            </div>

            <div className="mt-2 small text-muted">
              <div>Client: {userName}{userEmail ? ` (${userEmail})` : ""}</div>
              <div>Freelancer: {freelancerName}{freelancerEmail ? ` (${freelancerEmail})` : ""}</div>
            </div>
          </div>
        </th>
        <td className="vam">
          <span className="fz15 fw400">{category}</span>
        </td>
        <td className="d-flex gap-2 align-items-center">
          {actionsMode !== "tickets" && (roleId === 2 || roleId === 3) && (
            <button
              className="ud-btn btn-dark default-box-shadow2"
              onClick={handleOpenModal}
              disabled={milestones.length === 0 || milestones.every(m => !!m?.approvalAt)}
              title={milestones.length === 0 ? "No milestones available" : (milestones.every(m => !!m?.approvalAt) ? "All milestones are approved" : "Upload milestone")}
            >
              <span>{milestones.length === 0 ? "No milestones available" : (milestones.every(m => !!m?.approvalAt) ? "All milestones are approved" : "Upload Milestone")}</span>
            </button>
          )}

          {roleId === 1 && actionsMode !== "tickets" && (
            (() => {
              // Determine if any milestone has uploadHistory entries
              const msWithUploads = (milestones || []).filter((m) => Array.isArray(m?.uploadHistory) && m.uploadHistory.length > 0);
              const hasUploads = msWithUploads.length > 0;
              // Determine if all milestones are already approved
              const allApproved = (milestones || []).length > 0 && (milestones || []).every((m) => !!m?.approvalAt);

              // Default (working-projects): Verify Milestones
              return (
                <button
                  className="ud-btn btn-dark default-box-shadow2"
                  onClick={() => {
                    if (!hasUploads) return; // allow opening even if all approved to view history
                    const firstIdx = (milestones || []).findIndex(
                      (m) => Array.isArray(m?.uploadHistory) && m.uploadHistory.length > 0
                    );
                    setVerifyMilestoneIndex(firstIdx > -1 ? firstIdx : 0);
                    setIsVerifyModalOpen(true);
                  }}
                  disabled={!hasUploads}
                  title={allApproved ? "View upload history" : (hasUploads ? "Verify milestones" : "No updates to verify")}
                >
                  <span>{allApproved ? "Verified all milestones" : (hasUploads ? "Verify Milestones" : "No updates to verify")}</span>
                </button>
              );
            })()
          )}

          {actionsMode === "tickets" && (
            <Link
              to={{ pathname: "/dashboard/message", search: projectParam ? `?projectId=${encodeURIComponent(projectParam)}` : "" }}
              state={{
                projectId: projectParam,
                project,
                freelancerName,
                clientName: userName,
                clientEmail: userEmail,
                freelancerEmail,
              }}
              className="ud-btn btn-dark default-box-shadow2"
              title="View Tickets"
            >
              <i className="far fa-ticket-alt me-2" />
              <span>View Tickets</span>
            </Link>
          )}
        </td>
      </tr>

      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        >
          {/* Inline style override to ensure button remains visible on hover */}
          <style>{`
            .upload-ms-btn {
              color: #fff !important;
              background-color: var(--bs-primary) !important;
              border-color: var(--bs-primary) !important;
            }
            .upload-ms-btn:hover,
            .upload-ms-btn:focus {
              color: #fff !important;
              background-color: #0a58ca !important; /* darker primary */
              border-color: #0a58ca !important;
            }
            .verify-title { font-weight: 600; }
            .verify-label { font-weight: 500; color: #6c757d; }
            .verify-value { color: #212529; }
            .verify-divider { border-top: 1px solid #eee; margin: 12px 0; }
          `}</style>
          <div className="ps-widget bgc-white bdrs4 p30" style={{ width: "min(720px, 95vw)" }}>
            <div className="d-flex align-items-start justify-content-between mb-3">
              <h5 className="mb-0">Upload Milestone</h5>
              <button className="btn btn-light" onClick={closeModal} aria-label="Close" disabled={saving}>
                <i className="far fa-times" />
              </button>
            </div>

            {submitError && (
              <div className="alert alert-danger py-2" role="alert">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="alert alert-success py-2" role="alert">{submitSuccess}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="mb-2 fw-semibold">Select Milestone</div>
                {milestones.length === 0 ? (
                  <div className="text-muted">No milestones available</div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {milestones.map((m, idx) => {
                      const isApproved = !!m?.approvalAt;
                      return (
                        <label key={`${projectParam}-ms-${idx}`} className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name={`milestone-${projectParam}`}
                            value={String(idx)}
                            checked={selectedMilestoneIndex === idx}
                            onChange={(e) => setSelectedMilestoneIndex(Number(e.target.value))}
                            disabled={saving || isApproved}
                          />
                          <span className={isApproved ? "text-muted" : ""}>
  {m?.title || "Untitled Milestone"}
  {isApproved && (
    <span className="ms-2 d-inline-flex align-items-center text-success">
      <i className="far fa-check-circle me-1" title="Approved" />
      Approved
    </span>
  )}
</span>

                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="mb-2 fw-semibold">Upload Document</div>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                  disabled={saving}
                />
                {attachmentFile && (
                  <div className="mt-2 small text-muted">Selected: {attachmentFile.name}</div>
                )}
              </div>

              <div className="mb-3">
                <div className="mb-2 fw-semibold">Description</div>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Add a brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-thm" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isVerifyModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="ps-widget bgc-white bdrs4 p30" style={{ width: "min(720px, 95vw)", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="d-flex align-items-start justify-content-between mb-3">
              <h5 className="mb-0">Verify Milestone Update</h5>
              <button className="btn btn-light" onClick={() => setIsVerifyModalOpen(false)} aria-label="Close">
                <i className="far fa-times" />
              </button>
            </div>

            {(() => {
              const ms = milestones?.[verifyMilestoneIndex] || {};
              const history = Array.isArray(ms?.uploadHistory) ? ms.uploadHistory : [];
              // Prefer second item if exactly two entries, else latest, else first
              let selectedEntry = null;
              if (history.length === 2) selectedEntry = history[1];
              else if (history.length > 0) selectedEntry = history[history.length - 1];

              if (!selectedEntry) {
                return <div className="alert alert-secondary">No updates to verify</div>;
              }

            
            })()}

            {/* New: List each milestone with uploads and actions (table) */}
            <div className="verify-divider" />
            {(milestones || []).filter(m => Array.isArray(m?.uploadHistory) && m.uploadHistory.length > 0).length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date Range</th>
                      <th>Description</th>
                      <th>Attachments</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(milestones || []).map((ms, idx) => {
                      const history = Array.isArray(ms?.uploadHistory) ? ms.uploadHistory : [];
                      if (!history.length) return null;
                      const selectedEntry = history.length === 2 ? history[1] : history[history.length - 1];
                      const title = ms?.title || "Milestone";
                      const files = Array.isArray(selectedEntry?.files) ? selectedEntry.files : [];
                      const uploadedAt = selectedEntry?.uploadedAt ? new Date(selectedEntry.uploadedAt).toLocaleString() : "—";
                      const { label: msStatusLabel, cls: msStatusCls, approved: isApproved } = getMilestoneStatus(ms);
                      const isRejected = String(ms?.status || "").toLowerCase().includes("rejected");

                      return (
                        <tr key={`verify-row-${idx}`}>
                          <td className="fw-semibold">{title}<div className="small text-muted">Uploaded: {uploadedAt}</div></td>
                          <td>₹ {Number(ms?.amount ?? 0).toLocaleString()}</td>
                          <td><span className={`badge rounded-pill ${msStatusCls}`}>{msStatusLabel}</span></td>
                          <td>
                            <div className="small text-muted">
                              {ms?.start_date ? new Date(ms.start_date).toLocaleDateString() : "—"} → {ms?.end_date ? new Date(ms.end_date).toLocaleDateString() : "—"}
                            </div>
                          </td>
                          <td className="small text-muted" style={{maxWidth: 240}}>{selectedEntry?.uploadDescription || "—"}</td>
                          <td>
                            {files.length ? (
                              <div className="d-flex flex-wrap gap-2">
                                {files.map((f, i) => (
                                  <a key={`vfile-${idx}-${i}`} href={f} target="_blank" rel="noreferrer" className="d-inline-block">
                                    {isImageUrl(f) ? (
                                      <img src={f} alt={`file-${i}`} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }} />
                                    ) : (
                                      <span className="badge bg-light text-primary">Preview</span>
                                    )}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              {(() => {
                                const hardDisabled = isApproved || isRejected; // approved/rejected state
                                return (
                                  <>
                                    <button
                                      className={`btn btn-sm rounded-pill ${hardDisabled ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                      title="Approve"
                                      aria-label="Approve"
                                      disabled={!!verifyingId || hardDisabled}
                                      onClick={async () => {
                                        const userId = getUserIdFromStorage();
                                        const freelancerID = project?.freelancerId || getFreelancerIdFromStorage();
                                        if (!userId || !projectParam || !freelancerID) {
                                          Swal.fire({ icon: "error", title: "Missing IDs to approve" });
                                          return;
                                        }
                                        const body = {
                                          userId: String(userId),
                                          projectId: String(projectParam),
                                          freelancerID: String(freelancerID),
                                          finalized_milestones: [{ title: String(ms?.title || ""), amount: Number(ms?.amount ?? 0) }],
                                        };
                                        try {
                                          setVerifyingId(`approve-${idx}`);
                                          const res = await fetch("http://192.168.1.222:9006/project-service/userMilestoneApproval", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(body),
                                          });
                                          const data = await res.json().catch(() => ({}));
                                          if (!res.ok) throw new Error(data?.message || `Approve failed (${res.status})`);
                                          await Swal.fire({ icon: "success", title: data?.message || "Milestone approved" });
                                          try { typeof onRefresh === "function" && onRefresh(); } catch {}
                                          setIsVerifyModalOpen(false);
                                        } catch (err) {
                                          Swal.fire({ icon: "error", title: err?.message || "Approve failed" });
                                        } finally {
                                          setVerifyingId("");
                                        }
                                      }}
                                    >
                                      {verifyingId === `approve-${idx}` ? "..." : (
                                        <i className={`far fa-check-circle ${hardDisabled ? 'text-muted' : ''}`} />
                                      )}
                                    </button>
                                    <button
                                      className={`btn btn-sm rounded-pill ${hardDisabled ? 'btn-outline-secondary' : 'btn-outline-danger'}`}
                                      title="Reject"
                                      aria-label="Reject"
                                      disabled={!!verifyingId || hardDisabled}
                                      onClick={async () => {
                                        const { value: reason } = await Swal.fire({
                                          title: "Reject milestone",
                                          input: "text",
                                          inputLabel: "Reason",
                                          inputPlaceholder: "Enter a rejection reason",
                                          showCancelButton: true,
                                        });
                                        if (reason === undefined) return; // cancelled

                                        const userId = getUserIdFromStorage();
                                        const freelancerID = project?.freelancerId || getFreelancerIdFromStorage();
                                        if (!userId || !projectParam || !freelancerID) {
                                          Swal.fire({ icon: "error", title: "Missing IDs to reject" });
                                          return;
                                        }
                                        const body = {
                                          userId: String(userId),
                                          projectId: String(projectParam),
                                          freelancerID: String(freelancerID),
                                          finalized_milestones: [{ title: String(ms?.title || ""), status: "rejected" }],
                                          rejectedDescription: String(reason || ""),
                                        };
                                        try {
                                          setVerifyingId(`reject-${idx}`);
                                          const res = await fetch("http://192.168.1.222:9006/project-service/userMilestoneRejected", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(body),
                                          });
                                          const data = await res.json().catch(() => ({}));
                                          if (!res.ok) throw new Error(data?.message || `Reject failed (${res.status})`);
                                          await Swal.fire({ icon: "success", title: data?.message || "Milestone rejected" });
                                          try { typeof onRefresh === "function" && onRefresh(); } catch {}
                                          setIsVerifyModalOpen(false);
                                        } catch (err) {
                                          Swal.fire({ icon: "error", title: err?.message || "Reject failed" });
                                        } finally {
                                          setVerifyingId("");
                                        }
                                      }}
                                    >
                                      {verifyingId === `reject-${idx}` ? "..." : (
                                        <i className={`far fa-times-circle ${hardDisabled ? 'text-muted' : ''}`} />
                                      )}
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-light" onClick={() => setIsVerifyModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}