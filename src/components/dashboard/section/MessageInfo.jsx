import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardNavigation from "../header/DashboardNavigation";
import Swal from "sweetalert2";

// Modern ticketing chat UI using Bootstrap 5 utilities
// - Left: ticket list with search
// - Right: conversation with bubbles, header, input
// - Create Ticket modal includes milestone auto-splitting

export default function MessageInfo({ projectId }) {
  // Left pane: tickets
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Right pane: selected ticket + messages
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Composer
  const [draft, setDraft] = useState("");
  const [chatFiles, setChatFiles] = useState([]);
  const chatEndRef = useRef(null);

  // Create Ticket modal
  const [createOpen, setCreateOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  // Create ticket form
  const [form, setForm] = useState({
    category: "",
    description: "",
    files: [],
    total_amount: "",
    proposed_milestones: [
      { title: "milestone_Advance", amount: "", start_date: "", end_date: "", notes: "" },
      { title: "milestone_Midway", amount: "", start_date: "", end_date: "", notes: "" },
      { title: "milestone_Final", amount: "", start_date: "", end_date: "", notes: "" },
    ],
  });

  // Env
  const host = import.meta.env.VITE_BACKEND_HOST;
  const ticketPort = import.meta.env.VITE_BACKEND_TICKET_PORT;
  const baseURL = `http://${host}:${ticketPort}`;

  // Helpers
  function getUserIdFromStorage() {
    const direct =
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("userid");
    if (direct) return direct;
    try {
      const raw = localStorage.getItem("auth");
      const auth = raw ? JSON.parse(raw) : {};
      return (
        auth?.data?.user?.userId ||
        auth?.data?.user?.id ||
        auth?.data?.userId ||
        auth?.data?.id ||
        auth?.user?.userId ||
        auth?.user?.id ||
        auth?.userId ||
        auth?.id ||
        null
      );
    } catch (_) {
      return null;
    }
  }
  function getUserNameFromStorage() {
    const direct =
      localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      localStorage.getItem("fullName") ||
      localStorage.getItem("full_name");
    if (direct) return direct;
    try {
      const raw = localStorage.getItem("auth");
      const auth = raw ? JSON.parse(raw) : {};
      const u = auth?.data?.user || auth?.data || auth?.user || {};
      const first = u?.first_name || u?.firstname || u?.firstName || "";
      const last = u?.last_name || u?.lastname || u?.lastName || "";
      const combined = [first, last].filter(Boolean).join(" ").trim();
      return u?.name || u?.username || u?.fullName || u?.full_name || combined || null;
    } catch (_) {
      return null;
    }
  }
  function getFreelancerIdFromProject(p) {
    return (
      p?.freelancerId ||
      p?.freelancer_id ||
      p?.freelancerUserId ||
      p?.freelancer?.user_id ||
      p?.freelancer?.id ||
      null
    );
  }
  const location = useLocation();
  const assignedToName =
    location?.state?.freelancerName ||
    location?.state?.project?.freelancerName ||
    location?.state?.project?.freelancerNmae ||
    "";

  // UI helpers
  function formatISTDateTime(input) {
    try {
      const d = new Date(input);
      if (Number.isNaN(d.getTime())) return input || "";
      return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return input || "";
    }
  }
  function formatISTTime(input) {
    try {
      const d = new Date(input);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }
  function initialsFrom(text) {
    const str = String(text || "?").trim();
    const parts = str.split(/\s+/).filter(Boolean);
    const letters = (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
    return letters.toUpperCase();
  }
  function statusColor(status) {
    const s = String(status || "").toLowerCase();
    if (s.includes("open")) return "#22c55e"; // green
    if (s.includes("close")) return "#ef4444"; // red
    if (s.includes("pending") || s.includes("progress")) return "#f59e0b"; // amber
    return "#9ca3af"; // gray
  }
  function shortenId(id) {
    const s = String(id || "");
    if (s.length <= 10) return s;
    return `${s.slice(0,)}…${s.slice(-4)}`;
  }

  // Load tickets for project
  useEffect(() => {
    if (!projectId) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("jwt") ||
          "";

        const res = await fetch(`${baseURL}/tickets-service/project/${encodeURIComponent(projectId)}`, {
          headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);
        const list = Array.isArray(data) ? data : data?.data || [];
        if (!ignore) setTickets(Array.isArray(list) ? list : []);
      } catch (e) {
        const msg = e?.message || "Unable to fetch tickets";
        if (!/No tickets found/i.test(msg)) setError(msg);
        if (!ignore) setTickets([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [projectId, baseURL]);

  // Load messages for a ticket
  async function loadTicketDetail(ticket) {
    if (!ticket) return;
    setDetailLoading(true);
    setDetailError("");
    setMessages([]);
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";
      const ticketId = ticket?.ticket_id || ticket?.id || ticket?._id;
      // Fetch full ticket detail so we get messages array as in your example
      const res = await fetch(`${baseURL}/tickets-service/${encodeURIComponent(ticketId)}`, {
        method: "GET",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);
      const detail = data?.data || data;
      // Keep latest selected ticket with status for composer rules
      setSelectedTicket((prev) => ({ ...(prev || {}), ...(detail || {}) }));
      const list = Array.isArray(detail?.messages) ? detail.messages : [];
      const normalized = normalizeMessages(list);
      setMessages(normalized);
    } catch (e) {
      setDetailError(e?.message || "Failed to load messages");
    } finally {
      setDetailLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
  }

  // Normalize messages coming from backend
  function normalizeMessages(list) {
    const meId = String(getUserIdFromStorage() ?? "");
    return (list || []).map((m) => {
      const id = m?.id || m?._id || m?.message_id || String(Math.random());
      const text = m?.text || m?.message || "";
      const time = m?.time || m?.created_at || m?.createdAt || m?.timestamp || new Date().toISOString();
      const senderId = String(m?.sender_id ?? m?.senderId ?? "");
      const senderName = m?.sender || m?.authorName || m?.author || m?.user || "User";
      const isMe = !!meId && senderId === meId; // strictly compare sender_id to local userId
      return {
        id,
        text,
        time: formatISTDateTime(time),
        author: isMe ? "me" : "them",
        authorName: isMe ? "You" : (senderName || "User"),
      };
    });
  }

  // Auto scroll when messages change
  useEffect(() => {
    try { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); } catch {}
  }, [messages.length]);

  // Send message
  async function handleSend() {
    const text = draft.trim();
    const hasText = !!text;
    const hasFiles = Array.isArray(chatFiles) && chatFiles.length > 0;
    if ((!hasText && !hasFiles) || !selectedTicket) return;

    // Block sending if ticket is closed
    const status = String(selectedTicket?.status || selectedTicket?.state || "").toLowerCase();
    if (status.includes("close")) {
      await Swal.fire({ icon: "info", title: "Ticket is closed", text: "You cannot send new messages." });
      return;
    }

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";
      const senderId = getUserIdFromStorage();
      // role id heuristic
      const roleId = (() => {
        try {
          const direct = localStorage.getItem("roleid") ?? localStorage.getItem("role_id");
          if (direct) {
            try {
              const parsed = JSON.parse(direct);
              if (Array.isArray(parsed)) return Number(parsed[0]) || 0;
              return Number(parsed) || Number(direct) || 0;
            } catch { return Number(direct) || 0; }
          }
          const raw = localStorage.getItem("auth");
          if (raw) {
            const auth = JSON.parse(raw);
            const val = auth?.data?.role_id ?? auth?.role_id ?? auth?.data?.user?.role_id ?? auth?.user?.role_id ?? null;
            if (Array.isArray(val)) return Number(val[0]) || 0;
            return Number(val) || 0;
          }
        } catch {}
        return 0;
      })();
      const senderName = getUserNameFromStorage() || localStorage.getItem("name") || "";
      const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;

      // Backend requires file names in body per your example; if real upload is needed, integrate upload endpoint.
      const attachments = hasFiles ? chatFiles.map((f) => f.name) : [];

      const body = {
        sender_id: senderId || "",
        sender: senderName,
        role_id: roleId,
        ...(hasText ? { text } : {}),
        ...(attachments.length ? { attachments } : {}),
      };

      // Always hit the absolute service host you provided for sending
      const sendEndpoint = `http://192.168.1.30:8008/tickets-service/${encodeURIComponent(ticketId)}/messages`;
      const res = await fetch(sendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);

      // Optimistic append
      const newMsg = {
        id: data?.data?.message_id || Date.now().toString(),
        text: hasText ? text : attachments.length ? `Sent ${attachments.length} attachment(s)` : "",
        time: formatISTDateTime(new Date().toISOString()),
        author: "me",
        authorName: "You",
      };
      setMessages((prev) => [...prev, newMsg]);
      setDraft("");
      setChatFiles([]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Send failed", text: e?.message || "Failed to send message" });
    }
  }

  // Filter tickets
  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) => {
      const id = String(t?.ticket_id || t?.id || t?._id || "").toLowerCase();
      const category = String(t?.category || "").toLowerCase();
      const title = String(t?.title || t?.subject || "").toLowerCase();
      return id.includes(q) || category.includes(q) || title.includes(q);
    });
  }, [tickets, search]);

  // Create Ticket: load categories
  async function openCreateModal() {
    setCreateOpen(true);
    setCatLoading(true);
    setCatError("");
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";
      const res = await fetch(`${baseURL}/tickets-service/categories`, {
        method: "GET",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);
      let list = Array.isArray(data?.data) ? data.data : [];
      // Role-based filtering of categories
      let roleIdVal = 0;
      try {
        const authRaw = localStorage.getItem("auth");
        const auth = authRaw ? JSON.parse(authRaw) : null;
        roleIdVal = Number(
          localStorage.getItem("role_id") ||
          auth?.data?.user?.role_id ||
          auth?.data?.role_id ||
          auth?.user?.role_id ||
          0
        ) || 0;
      } catch {}
      if (roleIdVal === 1) {
        list = list.filter((c) => c !== "start_approval");
      } else if (roleIdVal === 2 || roleIdVal === 3) {
        list = list.filter((c) => c !== "requirement_discussion");
      }
      setCategories(list);
    } catch (e) {
      setCatError(e?.message || "Failed to load categories");
    } finally {
      setCatLoading(false);
    }
  }

  // Milestone helpers
  function splitEqually(total) {
    const t = Number(total) || 0;
    const one = Math.floor((t / 3) * 100) / 100; // 2 decimals
    const two = Math.floor((t / 3) * 100) / 100;
    const last = Math.round((t - one - two) * 100) / 100;
    return [one, two, last];
  }
  function rebalanceMilestones(changedIdx, newVal) {
    setForm((prev) => {
      const total = Number(prev.total_amount) || 0;
      const pm = [...prev.proposed_milestones];
      const v = Math.max(0, Number(newVal) || 0);
      pm[changedIdx] = { ...pm[changedIdx], amount: v };
      const rest = total - v;
      const others = [0, 1, 2].filter((i) => i !== changedIdx);
      const each = Math.max(0, Math.round((rest / 2) * 100) / 100);
      pm[others[0]] = { ...pm[others[0]], amount: each };
      pm[others[1]] = { ...pm[others[1]], amount: Math.max(0, Math.round((rest - each) * 100) / 100) };
      return { ...prev, proposed_milestones: pm };
    });
  }
  function updateTotalAmount(val) {
    const t = Math.max(0, Number(val) || 0);
    const [a, b, c] = splitEqually(t);
    setForm((prev) => ({
      ...prev,
      total_amount: t,
      proposed_milestones: [
        { ...prev.proposed_milestones[0], amount: a },
        { ...prev.proposed_milestones[1], amount: b },
        { ...prev.proposed_milestones[2], amount: c },
      ],
    }));
  }

  // Submit new ticket
  async function handleCreateTicket() {
    if (!projectId) { await Swal.fire({ icon: "error", title: "Missing project", text: "projectId is required." }); return; }
    if (!form.category) { await Swal.fire({ icon: "warning", title: "Select category", text: "Please select a category." }); return; }
    if (!form.description.trim()) { await Swal.fire({ icon: "warning", title: "Add description", text: "Please enter a description." }); return; }

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";

      // name + role
      let authParsed = null;
      try { const raw = localStorage.getItem("auth"); authParsed = raw ? JSON.parse(raw) : null; } catch {}
      const raisedBy =
        localStorage.getItem("name") ||
        localStorage.getItem("userName") ||
        authParsed?.data?.user?.name ||
        authParsed?.data?.name ||
        authParsed?.user?.name ||
        "";
      const roleId = Number(
        localStorage.getItem("role_id") ||
          authParsed?.data?.user?.role_id ||
          authParsed?.data?.role_id ||
          authParsed?.user?.role_id ||
          0
      ) || 0;

      const raisedById = getUserIdFromStorage();
      const projectFromNav = location?.state?.project || location?.state || {};
      const assignedToId = getFreelancerIdFromProject(projectFromNav);

      const body = {
        project_id: projectId,
        category: form.category,
        raised_by: raisedBy,
        assigned_to: assignedToName,
        raised_by_id: raisedById || null,
        assigned_to_id: assignedToId || null,
        role_id: roleId,
        description: form.description,
        attachments: (form.files || []).map((f) => f.name),
      };

      if (form.category === "project_clarification") {
        const proposed = (form.proposed_milestones || [])
          .map((m) => ({
            title: String(m.title || "").trim(),
            amount: Number(m.amount || 0),
            start_date: String(m.start_date || "").trim(),
            end_date: String(m.end_date || "").trim(),
            notes: String(m.notes || "").trim(),
          }))
          .filter((m) => m.title && m.amount >= 0);
        body.proposed_milestones = proposed;
      }

      const createEndpoint =
        form.category === "project_clarification"
          ? "http://192.168.1.30:8008/tickets-service/create"
          : `${baseURL}/tickets-service/create`;

      const res = await fetch(createEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);

      await Swal.fire({ icon: "success", title: "Created", text: data?.message || "Ticket created successfully" });
      setCreateOpen(false);
      setForm({
        category: "",
        description: "",
        files: [],
        total_amount: "",
        proposed_milestones: [
          { title: "milestone_Advance", amount: "", start_date: "", end_date: "", notes: "" },
          { title: "milestone_Midway", amount: "", start_date: "", end_date: "", notes: "" },
          { title: "milestone_Final", amount: "", start_date: "", end_date: "", notes: "" },
        ],
      });

      // refresh tickets
      try {
        const token2 =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("jwt") ||
          "";
        const res2 = await fetch(`${baseURL}/tickets-service/project/${encodeURIComponent(projectId)}`, {
          headers: { Accept: "application/json", ...(token2 ? { Authorization: `Bearer ${token2}` } : {}) },
        });
        const data2 = await res2.json().catch(() => ({}));
        if (res2.ok) {
          const list = Array.isArray(data2) ? data2 : data2?.data || [];
          setTickets(Array.isArray(list) ? list : []);
        }
      } catch {}
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Create failed", text: e?.message || "Failed to create ticket" });
    }
  }

  // Delete selected ticket (optional action)
  async function deleteSelectedTicket() {
    if (!selectedTicket) return;
    const resConfirm = await Swal.fire({
      title: "Delete this ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!resConfirm.isConfirmed) return;
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";
      const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;
      const res = await fetch(`${baseURL}/tickets-service/${encodeURIComponent(ticketId)}`, {
        method: "DELETE",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("Failed to delete ticket");
      setSelectedTicket(null);
      setMessages([]);
      // refresh list
      const res2 = await fetch(`${baseURL}/tickets-service/project/${encodeURIComponent(projectId)}`);
      const data2 = await res2.json().catch(() => ({}));
      const list = Array.isArray(data2) ? data2 : data2?.data || [];
      setTickets(Array.isArray(list) ? list : []);
      await Swal.fire({ icon: "success", title: "Deleted", text: "Ticket deleted." });
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Delete failed", text: e?.message || "Delete failed" });
    }
  }

  // Close selected ticket
  async function handleCloseTicket() {
    if (!selectedTicket) return;
    const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;
    const userId = getUserIdFromStorage() || localStorage.getItem("userId") || "";
    if (!ticketId || !userId) {
      await Swal.fire({ icon: "error", title: "Cannot close", text: "Missing ticket or user ID." });
      return;
    }

    const resConfirm = await Swal.fire({
      title: "Close this ticket?",
      text: "You won't be able to send new messages after closing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Close Ticket",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
    });
    if (!resConfirm.isConfirmed) return;

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";
      const url = `http://192.168.1.30:8008/tickets-service/${encodeURIComponent(ticketId)}/close?user_id=${encodeURIComponent(userId)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);

      setSelectedTicket((prev) => (prev ? { ...prev, status: "closed" } : prev));
      await Swal.fire({ icon: "success", title: "Ticket closed", text: data?.message || "The ticket was closed successfully." });

      // refresh ticket list
      try {
        const res2 = await fetch(`${baseURL}/tickets-service/project/${encodeURIComponent(projectId)}`, {
          headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data2 = await res2.json().catch(() => ({}));
        if (res2.ok) {
          const list = Array.isArray(data2) ? data2 : data2?.data || [];
          setTickets(Array.isArray(list) ? list : []);
        }
      } catch {}
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Close failed", text: e?.message || "Failed to close ticket" });
    }
  }

  // Layout
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <DashboardNavigation />
        </div>
        <div className="col-lg-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <div>
              <h2 className="mb-1">Messages</h2>
              <p className="text-muted mb-0">Project-focused ticket conversations</p>
            </div>
            <div className="mt-3 mt-lg-0">
              <button className="ud-btn btn-dark default-box-shadow2" onClick={openCreateModal}>
                Create Ticket <i className="fal fa-ticket ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-pane chat layout */}
      <div className="row g-3" style={{ minHeight: "70vh" }}>
        {/* Left: Ticket list */}
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column p-0" style={{ height: "70vh" }}>
              {/* Search */}
              <div className="p-3 border-bottom">
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="far fa-search" /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tickets"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Tickets */}
              <div className="flex-grow-1 overflow-auto" style={{ overscrollBehavior: "contain" }}>
                {loading && (
                  <div className="p-3 text-center text-muted small">Loading tickets…</div>
                )}
                {!loading && filteredTickets.length === 0 && (
                  <div className="p-4 text-center text-muted" style={{ marginTop: "15%" }}>
                    <div className="mb-2"><i className="fal fa-inbox fa-2x" /></div>
                    <div className="fw-semibold">No tickets found. Create a new ticket to get started.</div>
                    <button className="btn btn-outline-dark btn-sm mt-3" onClick={openCreateModal}>Create Ticket</button>
                  </div>
                )}

                <ul className="list-group list-group-flush">
                  {filteredTickets.map((t) => {
                    const id = t?.ticket_id || t?.id || t?._id;
                    const category = t?.category || "";
                    const status = t?.status || t?.state || "open";
                    const updatedAt = t?.updated_at || t?.updatedAt || t?.last_update || t?.created_at || t?.createdAt;
                    const active = (selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id) === id;
                    return (
                      <li
                        key={String(id)}
                        className={`list-group-item list-group-item-action px-3 ${active ? "bg-light" : ""}`}
                        role="button"
                        onClick={() => {
                          // Ensure we pass exactly /tickets-service/<ticket_id>
                          setSelectedTicket(t);
                          loadTicketDetail({
                            ...t,
                            ticket_id: t?.ticket_id || t?.id || t?._id,
                          });
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Avatar */}
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40, background: "#f1f5f9", color: "#334155", fontWeight: 600 }}>
                            {initialsFrom(category || id)}
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="fw-semibold text-truncate" title={String(id)}>{shortenId(id)}</div>
                              <div className="small text-muted ms-2">{updatedAt ? formatISTTime(updatedAt) : ""}</div>
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <span className="text-truncate" title={category}>{category || "—"}</span>
                              <span className="ms-2" style={{ display: "inline-flex", alignItems: "center" }}>
                                <span className="me-1" style={{ width: 8, height: 8, borderRadius: 999, background: statusColor(status) }} />
                                {String(status || "").toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Conversation */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card border-0 shadow-sm h-100">
            {/* Header */}
            <div className="card-header bg-white">
              {selectedTicket ? (
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-semibold">Ticket {(selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id)}</div>
                    <div className="small text-muted">{selectedTicket?.category || "—"} · <span style={{ color: statusColor(selectedTicket?.status) }}>{String(selectedTicket?.status || "OPEN").toUpperCase()}</span></div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {/* Update Milestone only for project_clarification */}
                    {String(selectedTicket?.category || "").toLowerCase() === "project_clarification" && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          // Reuse create modal UI to update milestones; pre-fill category
                          setForm((prev) => ({
                            ...prev,
                            category: "project_clarification",
                          }));
                          openCreateModal();
                        }}
                      >
                        Update Milestone
                      </button>
                    )}
                    <button className="btn btn-link text-danger text-decoration-none" onClick={handleCloseTicket}>
                      Close Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-muted">Select a ticket to view conversation</div>
              )}
            </div>

            {/* Messages */}
            <div className="card-body p-0 d-flex flex-column" style={{ height: "calc(70vh - 140px)" }}>
              <div className="flex-grow-1 overflow-auto p-3" style={{ background: "#f8fafc" }}>
                {!selectedTicket && (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                    <i className="fal fa-comments fa-3x mb-3" />
                    <div>Select a ticket from the left to start</div>
                  </div>
                )}

                {selectedTicket && detailLoading && (
                  <div className="text-center text-muted small">Loading conversation…</div>
                )}
                {selectedTicket && !detailLoading && messages.length === 0 && (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                    <i className="fal fa-comment-alt fa-3x mb-3" />
                    <div>No messages yet. Start the conversation below.</div>
                  </div>
                )}

              {selectedTicket && !detailLoading && messages.length > 0 && (
  <div className="d-flex flex-column gap-3">
    {messages.map((m) => (
      <div
        key={m.id}
        className={`d-flex ${
          m.author === "me" ? "justify-content-end" : "justify-content-start"
        }`}
      >
        {/* Left Avatar for others */}
        {m.author !== "me" && (
          <div
            className="rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold text-white"
            style={{
              width: 32,
              height: 32,
              background: "#2563eb",
              fontSize: 14,
            }}
          >
            {m.authorName?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message Bubble */}
        <div>
          <div
            className={`px-3 py-2 rounded-3 shadow-sm ${
              m.author === "me" ? "text-white" : ""
            }`}
            style={{
              maxWidth: 560,
              background: m.author === "me" ? "#2563eb" : "#ffffff",
            }}
          >
            <div
              className={`small mb-1 ${
                m.author === "me" ? "text-white-50" : "text-muted"
              }`}
            >
              {m.authorName} · {m.time}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        </div>

        {/* Right Avatar for me */}
        {m.author === "me" && (
          <div
            className="rounded-circle ms-2 d-flex align-items-center justify-content-center fw-bold text-primary"
            style={{
              width: 32,
              height: 32,
              background: "#bfdbfe",
              fontSize: 14,
            }}
          >
            {m.authorName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    ))}
    <div ref={chatEndRef} />
  </div>
)}


                {detailError && (
                  <div className="alert alert-danger mt-3 mb-0">{detailError}</div>
                )}
              </div>

              {/* Composer */}
              <div className="border-top p-3">
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="file"
                    className="form-control"
                    style={{ maxWidth: 260 }}
                    multiple
                    onChange={(e) => setChatFiles(Array.from(e.target.files || []))}
                    disabled={selectedTicket && String(selectedTicket?.status || "").toLowerCase().includes("close")}
                  />
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder={selectedTicket && String(selectedTicket?.status || "").toLowerCase().includes("close") ? "Ticket is closed" : "Type a message"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                    disabled={selectedTicket && String(selectedTicket?.status || "").toLowerCase().includes("close")}
                  />
                  <button
                    className="btn btn-primary rounded-pill d-flex align-items-center px-3"
                    onClick={handleSend}
                    disabled={
                      !selectedTicket ||
                      (String(selectedTicket?.status || "").toLowerCase().includes("close")) ||
                      (!draft.trim() && (!Array.isArray(chatFiles) || chatFiles.length === 0))
                    }
                  >
                    <span className="me-1">Send</span>
                    <i className="far fa-paper-plane" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {createOpen && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.35)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setCreateOpen(false)} />
              </div>
              <div className="modal-body">
                {!projectId && (
                  <div className="alert alert-warning">ProjectId missing. Open this from a project context.</div>
                )}

                {catLoading && <div className="small text-muted mb-2">Loading categories…</div>}
                {catError && <div className="alert alert-danger mb-2">{catError}</div>}

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe your request"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {form.category === "project_clarification" && (
                  <div className="mb-3">
                    <div className="row g-2 align-items-end">
                      <div className="col-12 col-md-4">
                        <label className="form-label">Total Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Total"
                          value={form.total_amount}
                          onChange={(e) => updateTotalAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="table-responsive mt-3">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th style={{ minWidth: 160 }}>Title</th>
                            <th style={{ width: 160 }}>Amount</th>
                            <th style={{ width: 170 }}>Start Date</th>
                            <th style={{ width: 170 }}>End Date</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.proposed_milestones.map((m, idx) => (
                            <tr key={idx}>
                              <td>
                                <input type="text" className="form-control" value={m.title} disabled />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={m.amount}
                                  onChange={(e) => rebalanceMilestones(idx, e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={m.start_date}
                                  onChange={(e) => setForm((prev) => {
                                    const pm = [...prev.proposed_milestones];
                                    pm[idx] = { ...pm[idx], start_date: e.target.value };
                                    return { ...prev, proposed_milestones: pm };
                                  })}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={m.end_date}
                                  onChange={(e) => setForm((prev) => {
                                    const pm = [...prev.proposed_milestones];
                                    pm[idx] = { ...pm[idx], end_date: e.target.value };
                                    return { ...prev, proposed_milestones: pm };
                                  })}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Notes"
                                  value={m.notes || ""}
                                  onChange={(e) => setForm((prev) => {
                                    const pm = [...prev.proposed_milestones];
                                    pm[idx] = { ...pm[idx], notes: e.target.value };
                                    return { ...prev, proposed_milestones: pm };
                                  })}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Attachments</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) => setForm({ ...form, files: Array.from(e.target.files || []) })}
                  />
                  <div className="form-text">Optional. You can attach multiple files.</div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
                <button className="btn btn-dark" onClick={handleCreateTicket}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}