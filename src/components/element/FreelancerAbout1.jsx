import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function FreelancerAbout1({ data }) {
  const location = data?.profile_details?.location ?? data?.profile?.location ?? "N/A";
  const hourlyRate = data?.profile_details?.hourly_rate;
  const MemberSince = data?.profile_details?.created_at ?? "N/A";


  // Modal + form state (only project creation now)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create form
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceOptions, setServiceOptions] = useState([]); // normalized strings
  const [loadingServices, setLoadingServices] = useState(false);
  const hasFetchedServices = useRef(false); // guard double calls (StrictMode / re-renders)

  // Schedule Meeting state
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(""); // datetime-local string
  const [duration, setDuration] = useState(30); // minutes
  const [topic, setTopic] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [meetingResult, setMeetingResult] = useState(null);
  const [meetingService, setMeetingService] = useState("");

  // Get role_ids from localStorage.auth in a robust way
  function getRoleIdsFromStorage() {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return [];
      const auth = JSON.parse(raw);
      const val =
        auth?.data?.profile?.role_id ??
        auth?.profile?.role_id ??
        auth?.data?.role_id ??
        auth?.role_id ?? [];
      if (Array.isArray(val)) return val.map((v) => Number(v)).filter((v) => !Number.isNaN(v));
      if (typeof val === "number") return [val];
      if (typeof val === "string") {
        return val
          .split(/[\s,;]+/)
          .map((v) => Number(v))
          .filter((v) => !Number.isNaN(v));
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  // Get userId from localStorage.auth in a robust way
  function getUserIdFromStorage() {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const auth = JSON.parse(raw);
      return (
        auth?.data?.userId ||
        auth?.userId ||
        auth?.data?.user_id ||
        auth?.user_id ||
        auth?.data?.profile?.user_id ||
        auth?.profile?.user_id ||
        null
      );
    } catch (_) {
      return null;
    }
  }

  // Compute profile completion percent based on key fields
  function getProfileCompletion(profileDetails = {}, profile = {}) {
    const candidates = [
      profileDetails.full_name ?? profile.name,
      profileDetails.email ?? profile.email,
      profileDetails.phone ?? profile.phone,
      profileDetails.location ?? profile.location,
      profileDetails.hourly_rate,
      profileDetails.services ?? profile.services,
      profileDetails.skills ?? profile.skills,
      profileDetails.bio ?? profile.bio,
      profileDetails.experience ?? profile.experience,
      profileDetails.education ?? profile.education,
      profileDetails.company ?? profile.company,
      profileDetails.website ?? profile.website,
      profileDetails.avatar ?? profile.avatar,
    ];
    const toFilled = (v) => {
      if (v == null) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    };
    const total = candidates.length;
    const filled = candidates.filter(toFilled).length;
    if (!total) return 0;
    return Math.max(0, Math.min(100, Math.round((filled / total) * 100)));
  }

  // Normalize various service payload shapes to [string]
  function normalizeServices(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
    if (typeof raw === "string") {
      return raw
        .split(/[\s,;|]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof raw === "object") {
      // If backend returns object or set-like structure, prefer keys; if keys empty, try values
      const keys = Object.keys(raw || {});
      if (keys.length > 0) return keys.map(String);
      const vals = Object.values(raw || {});
      return vals.map(String).filter(Boolean);
    }
    return [];
  }

  async function fetchServicesOnce() {
    if (hasFetchedServices.current) return;
    hasFetchedServices.current = true; // set early to avoid race/double
    setLoadingServices(true);
    try {
      const token = localStorage.getItem("access_token");
      const resp = await fetch("http://192.168.1.30:8002/profile-service/getdetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await resp.json().catch(() => ({}));
      const servicesRaw =
        json?.data?.profile_details?.services ??
        json?.profile_details?.services ??
        json?.data?.services ??
        json?.services ?? null;

      let options = normalizeServices(servicesRaw);

      // Fallback to the freelancer data passed to this component
      if (!options.length) {
        const freelancerServices = data?.profile_details?.services ?? data?.services;
        options = normalizeServices(freelancerServices);
      }

      setServiceOptions(options);
    } catch (e) {
      // Fallback: try from passed-in freelancer data
      const freelancerServices = data?.profile_details?.services ?? data?.services;
      const options = normalizeServices(freelancerServices);
      setServiceOptions(options);
    } finally {
      setLoadingServices(false);
    }
  }

  function handleOpenModal() {
    const roles = getRoleIdsFromStorage();
    const isCustomer = roles.includes(1);
    if (!isCustomer) {
      Swal.fire({
        icon: "warning",
        title: "Access restricted",
        text: "Only Customers can create a project.",
      });
      return;
    }
    // Reset selections so the form shows defaults on each open
    setServiceType("");
    setIsModalOpen(true);
    // load services once when opening modal
    fetchServicesOnce();
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  async function handleCreateProject(e) {
    e?.preventDefault?.();

    const trimmedTitle = projectTitle?.trim();
    const trimmedDesc = projectDescription?.trim();

    if (!trimmedTitle || !trimmedDesc || !serviceType) {
      Swal.fire({ icon: "error", title: "Missing details", text: "Please fill Project Title, Description and select Service Type." });
      return;
    }

    const host = import.meta.env.VITE_BACKEND_HOST_ADMIN;
    const port = import.meta.env.VITE_BACKEND_PROJECT_PORT;
    if (!host || !port) {
      Swal.fire({ icon: "error", title: "Configuration error", text: "Project service host/port is not configured." });
      return;
    }

    // Read auth info from localStorage
    let auth = {};
    try {
      const raw = localStorage.getItem("auth");
      auth = raw ? JSON.parse(raw) : {};
    } catch (_) {
      auth = {};
    }

    const token = localStorage.getItem("access_token");
    const userId = getUserIdFromStorage();
    const userName = auth?.data?.name || auth?.name || localStorage.getItem("name") || "";
    const userEmail = auth?.data?.email || auth?.email || localStorage.getItem("email") || "";

    const freelancerId =
      data?.profile?.user_id || data?.profile_details?.user_id || data?.user_id || null;
    const freelancerName =
      data?.profile_details?.full_name || data?.profile?.name || data?.author?.name || data?.name || "";
    const freelancerEmail =
      data?.profile_details?.email || data?.profile?.email || data?.email || "";

    if (!userId || !freelancerId) {
      Swal.fire({ icon: "error", title: "Missing user info", text: "Please login again and ensure freelancer details are available." });
      return;
    }

    const base = `http://${host}:${port}`;
    const body = {
      userId: String(userId),
      userName: String(userName), // as per backend key
      userEmail: String(userEmail),
      freelancerId: String(freelancerId),
      freelancerName: String(freelancerName), // as per backend key
      freelancerEmail: String(freelancerEmail),
      projectTitle: trimmedTitle,
      projectDescription: trimmedDesc,
      serviceType: serviceType,
      createdBy: String(userId),
    };

    try {
      const resp = await fetch(`${base}/project-service/createProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = json?.message || `Failed to create project (status ${resp.status})`;
        Swal.fire({ icon: "error", title: "Create failed", text: msg });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Project created",
        text: "Project created successfully. You can raise the ticket from your dashboard.",
      });

      // Close modal and reset fields
      setIsModalOpen(false);
      setProjectTitle("");
      setProjectDescription("");
      setServiceType("");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Network error", text: "Unable to create project. Please try again." });
    }
  }

  // Meeting scheduling helpers and handlers
  function toDatetimeLocalValue(date) {
    try {
      const d = date instanceof Date ? date : new Date(date);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch (_) {
      return "";
    }
  }

  function handleOpenMeetingModal() {
    setMeetingResult(null);
    // Prefill topic and default time (next hour)
    const authRaw = localStorage.getItem("auth");
    let auth = {};
    try { auth = authRaw ? JSON.parse(authRaw) : {}; } catch (_) { }
    const userName = auth?.data?.name || auth?.name || localStorage.getItem("name") || "";
    const freelancerName =
      data?.profile_details?.full_name || data?.profile?.name || data?.author?.name || data?.name || "Freelancer";
    if (!topic) setTopic(`${userName ? userName + " & " : ""}${freelancerName} Discussion`);
    if (!scheduledTime) {
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      setScheduledTime(toDatetimeLocalValue(now));
    }
    // Preselect first available service for meeting if missing
    const options = Array.isArray(serviceOptions) && serviceOptions.length > 0
      ? serviceOptions
      : normalizeServices(data?.profile_details?.services ?? data?.services);
    if (!meetingService && options && options.length > 0) setMeetingService(String(options[0]));

    setDuration((v) => v || 30);
    setIsMeetingModalOpen(true);
  }

  function handleCloseMeetingModal() {
    setIsMeetingModalOpen(false);
  }

  async function handleScheduleMeeting(e) {
    e?.preventDefault?.();
    const trimmedTopic = topic?.trim();
    if (!trimmedTopic || !scheduledTime || !duration) {
      Swal.fire({ icon: "error", title: "Missing details", text: "Please fill Topic, Scheduled Time and Duration." });
      return;
    }

    // Build payload
    let auth = {};
    try {
      const raw = localStorage.getItem("auth");
      auth = raw ? JSON.parse(raw) : {};
    } catch (_) { auth = {}; }

    const token = localStorage.getItem("access_token");
    const userId = getUserIdFromStorage();
    const userEmail = auth?.data?.email || auth?.email || localStorage.getItem("email") || "";

    const freelancerId =
      data?.profile?.user_id || data?.profile_details?.user_id || data?.user_id || null;
    const freelancerEmail =
      data?.profile_details?.email || data?.profile?.email || data?.email || "";

    if (!userId || !freelancerId) {
      Swal.fire({ icon: "error", title: "Missing user info", text: "Please login again and ensure freelancer details are available." });
      return;
    }

    const serviceId = String(meetingService || serviceType || data?.raw?.id || data?.serviceId || "");
    const body = {
      userId: String(userId),
      userEmailId: String(userEmail),
      freelancerEmailId: String(freelancerEmail),
      freelancerId: String(freelancerId),
      serviceId,
      scheduledTime: new Date(scheduledTime).toISOString(),
      duration: Number(duration),
      topic: trimmedTopic,
      createdBy: String(userEmail || userId),
    };

    setScheduling(true);
    try {
      const resp = await fetch("http://192.168.1.222:9004/meeting-service/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok || json?.success === false) {
        const msg = json?.message || `Failed to schedule meeting (status ${resp.status})`;
        Swal.fire({ icon: "error", title: "Schedule failed", text: msg });
        return;
      }

      // Success
      setMeetingResult(json?.data || null);
      Swal.fire({ icon: "success", title: "Meeting scheduled", text: json?.message || "Meeting scheduled successfully." });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Network error", text: "Unable to schedule meeting. Please try again." });
    } finally {
      setScheduling(false);
    }
  }

  // Calculate completion% for the shown freelancer
  const completionPercent = getProfileCompletion(
    data?.profile_details || {},
    data?.profile || data || {}
  );

  return (
    <>
      <div className="price-widget pt25 bdrs8">
        <h3 className="widget-title">
          {hourlyRate ? `${hourlyRate}` : "N/A"}
          <small className="fz15 fw500">/per hour</small>
        </h3>
        <div className="category-list mt20">
          {/* Profile Completion - only on own profile */}
          {(() => {
            const viewerUserId = String(getUserIdFromStorage() || "");
            const viewedFreelancerId = String(
              data?.profile?.user_id || data?.profile_details?.user_id || data?.user_id || ""
            );
            const isOwnProfile = viewerUserId && viewedFreelancerId && viewerUserId === viewedFreelancerId;
            if (!isOwnProfile) return null;
            return (
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text d-flex align-items-center">
                    <i className="flaticon-checked text-thm2 pe-2 vam" />
                    Profile completion
                  </span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="progress mt-2" style={{ height: 8, background: "#eee" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${completionPercent}%`, background: completionPercent >= 70 ? "#28a745" : "#ffc107" }}
                    aria-valuenow={completionPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            );
          })()}

          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-place text-thm2 pe-2 vam" />
              Location
            </span>
            <span>{location}</span>
          </a>
          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-30-days text-thm2 pe-2 vam" />
              Member since
            </span>
            <span>{new Date(MemberSince).getFullYear()}</span>
          </a>
          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-calendar text-thm2 pe-2 vam" />
              Last Delivery
            </span>
            <span>5 days</span>
          </a>

          <a className="d-flex align-items-center justify-content-between bdrb1 pb-2">
            <span className="text">
              <i className="flaticon-translator text-thm2 pe-2 vam" />
              Languages
            </span>
            <span>English</span>
          </a>
          <a className="d-flex align-items-center justify-content-between mb-3">
            <span className="text">
              <i className="flaticon-sliders text-thm2 pe-2 vam" />
              English Level
            </span>
            <span>Fluent</span>
          </a>
        </div>

        {/* Customer actions (role 1) */}
        {getRoleIdsFromStorage().includes(1) && (
          <div
            className="container my-4 p-4"
            style={{ border: "0.1rem solid #ccc", borderRadius: "8px" }}
          >
            <div className="d-grid mb-3">
              <button type="button" className="ud-btn btn-thm d-flex align-items-center justify-content-center" onClick={handleOpenMeetingModal}>
                Schedule Meeting
                <i className="fal fa-video-camera" style={{ marginLeft: "8px" }} />
              </button>
            </div>
            <div className="d-grid">
              <button type="button" className="ud-btn btn-thm d-flex align-items-center justify-content-center" onClick={handleOpenModal}>
                Initiate the project
                <i className="fal fa-rocket ms-2" />
              </button>
            </div>
          </div>
        )}

        {/* Freelancer actions (role 2 or 3) - only on own profile */}
        {(() => {
          const roles = getRoleIdsFromStorage();
          const isFreelancer = roles.includes(2) || roles.includes(3);
          if (!isFreelancer) return null;

          // Show only if the logged-in freelancer is viewing their own profile
          const viewerUserId = String(getUserIdFromStorage() || "");
          const viewedFreelancerId = String(
            data?.profile?.user_id || data?.profile_details?.user_id || data?.user_id || ""
          );
          const isOwnProfile = viewerUserId && viewedFreelancerId && viewerUserId === viewedFreelancerId;
          if (!isOwnProfile) return null;

          return (
            <div
              className="container my-4 p-4"
              style={{ border: "0.1rem solid #ccc", borderRadius: "8px" }}
            >
              <div className="d-grid mb-2">
                <Link to="/dashboard/my-profile" className="ud-btn btn-thm d-flex align-items-center justify-content-center">
                  {completionPercent < 100 ? "Complete profile" : "View your profile"}
                  <i className="fas fa-user-pen ms-2" aria-hidden="true" style={{ transform: "rotate(0deg)" }} />
                </Link>
              </div>
              <div className="text-center text-muted" style={{ fontSize: 12 }}>
                {completionPercent}% complete
              </div>
            </div>
          );
        })()}

      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-content bdrs8"
            style={{ background: "#fff", width: "100%", maxWidth: 600, padding: 24, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="m-0">Create a Project</h5>
              <button className="btn btn-sm" onClick={handleCloseModal} aria-label="Close">
                <i className="fal fa-times" />
              </button>
            </div>

            {/* Guidance note */}
            <div
              className="mb-3"
              style={{
                background: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: 6,
                padding: 12,
                color: "#6c757d",
                fontSize: 14,
              }}
            >
              After creating a project here, you can raise the ticket from your dashboard.
            </div>

            {/* Create Project Form */}
            <div className="mb-3">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Design a PCB layout"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Project Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Need a 2-layer PCB design for power distribution"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Service Type</label>
              <select
                className="form-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                disabled={loadingServices}
              >
                {/* Default option */}
                <option value="" disabled>
                  Select Service Type
                </option>

                {/* Loading state */}
                {loadingServices && <option disabled>Loading...</option>}

                {/* No services */}
                {!loadingServices && serviceOptions.length === 0 && (
                  <option disabled>No services</option>
                )}

                {/* Services list */}
                {!loadingServices &&
                  serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="ud-btn btn-thm" onClick={handleCreateProject} type="button">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {isMeetingModalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={handleCloseMeetingModal}
        >
          <div
            className="modal-content bdrs8"
            style={{ background: "#fff", width: "100%", maxWidth: 600, padding: 24, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="m-0">Schedule Meeting</h5>
              <button className="btn btn-sm" onClick={handleCloseMeetingModal} aria-label="Close">
                <i className="fal fa-times" />
              </button>
            </div>

            {/* Meeting form */}
            <div className="mb-3">
              <label className="form-label">Topic</label>
              <input
                type="text"
                className="form-control"
                placeholder="Kesavan & Vivek POC Discussion"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Service</label>
              <select
                className="form-select"
                value={meetingService}
                onChange={(e) => setMeetingService(e.target.value)}
              >
                {/* Build options from fetched profile services or normalized list */}
                {(() => {
                  const opts = Array.isArray(serviceOptions) && serviceOptions.length > 0
                    ? serviceOptions
                    : normalizeServices(data?.profile_details?.services ?? data?.services);
                  if (!opts || opts.length === 0) return <option value="">No services</option>;
                  return [<option key="" value="">Select a service</option>, ...opts.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))];
                })()}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Scheduled Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                min={10}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 0)}
              />
            </div>

            {/* Success summary */}
            {meetingResult && (
              <div className="mb-3" style={{ background: "#f8f9fa", border: "1px solid #e9ecef", borderRadius: 6, padding: 12 }}>
                <div className="mb-2"><strong>Meeting scheduled successfully.</strong></div>
                <div className="text-muted mb-2" style={{ fontSize: 14 }}>
                  We've sent the meeting details to your email inbox. You can also download them for your records.
                </div>
                <div className="mb-1"><strong>Meeting ID:</strong> {meetingResult.meetingId}</div>
                <div className="mb-2">
                  <a href={meetingResult.join_url} target="_blank" rel="noreferrer" className="text-decoration-underline">
                    Join URL
                  </a>
                </div>
                {Array.isArray(meetingResult.registrants) && meetingResult.registrants.length > 0 && (
                  <div>
                    <div className="mb-1"><strong>Registrants</strong></div>
                    <ul className="ps-3 mb-0">
                      {meetingResult.registrants.map((r) => (
                        <li key={r.email}>
                          {r.email} — <a href={r.join_url} target="_blank" rel="noreferrer">join</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="ud-btn btn-thm"
                    onClick={() => {
                      try {
                        const rows = [];
                        rows.push(["Meeting ID", meetingResult?.meetingId || ""]);
                        rows.push(["Join URL", meetingResult?.join_url || ""]);
                        if (topic) rows.push(["Topic", topic]);
                        if (scheduledTime) rows.push(["Scheduled Time", scheduledTime]);
                        rows.push([]);
                        rows.push(["Registrants"]);
                        rows.push(["Email", "Join URL"]);
                        const regs = Array.isArray(meetingResult?.registrants) ? meetingResult.registrants : [];
                        regs.forEach((r) => rows.push([r?.email || "", r?.join_url || ""]));
                        const csv = rows
                          .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
                          .join("\r\n");
                        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `meeting_${meetingResult?.meetingId || "details"}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } catch (e) {
                        Swal.fire({ icon: "error", title: "Download failed", text: "Could not generate the file." });
                      }
                    }}
                  >
                    Download as Excel
                  </button>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              {!meetingResult && (
                <button
                  className="ud-btn btn-thm"
                  type="button"
                  disabled={scheduling}
                  onClick={handleScheduleMeeting}
                >
                  {scheduling ? "Scheduling..." : "Schedule"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}