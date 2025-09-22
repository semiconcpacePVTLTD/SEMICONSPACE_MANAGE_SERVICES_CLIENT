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
  const [updateMilestonesMode, setUpdateMilestonesMode] = useState(false);
  const [updatingMilestones, setUpdatingMilestones] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  // start_approval: finalized milestones fetched from backend
  const [startApproval, setStartApproval] = useState({ loading: false, error: "", milestones: [], total: 0 });

  // Modal to view finalized milestones (read-only)
  const [finalizedModalOpen, setFinalizedModalOpen] = useState(false);

  // Milestone two-step modal (create flow)
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [milestoneDraft, setMilestoneDraft] = useState(null);
  // Keep originals to send only changed values on update
  const originalMilestonesRef = useRef([]);
  const originalTotalRef = useRef(null);

  // Create ticket form
  const [form, setForm] = useState({
    category: "",
    description: "",
    files: [],
    total_amount: "",
    agreement_details: "Both parties agree to the milestone terms and delivery schedule.",
    proposed_milestones: [
      { title: "milestone_Advance", amount: "", start_date: "", end_date: "", notes: "" },
      { title: "milestone_Midway", amount: "", start_date: "", end_date: "", notes: "" },
      { title: "milestone_Final", amount: "", start_date: "", end_date: "", notes: "" },
    ],
  });

  // Auto-calc total from milestone rows
  const milestonesTotal = useMemo(() => {
    try {
      return (form?.proposed_milestones || []).reduce(
        (sum, m) => sum + (Number(m?.amount || 0) || 0),
        0
      );
    } catch {
      return 0;
    }
  }, [form?.proposed_milestones]);

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

  // Try multiple places for email to avoid empty value
  function getUserEmailFromStorage() {
    const direct =
      localStorage.getItem("email") ||
      localStorage.getItem("user_email") ||
      localStorage.getItem("userEmail");
    if (direct) return direct;
    try {
      const raw = localStorage.getItem("auth");
      const auth = raw ? JSON.parse(raw) : {};
      const u = auth?.data?.user || auth?.data || auth?.user || {};
      return (
        u?.email ||
        u?.email_id ||
        u?.emailId ||
        u?.mail ||
        u?.contact?.email ||
        null
      );
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
  function getClientIdFromProject(p) {
    return (
      p?.clientId ||
      p?.client_id ||
      p?.clientUserId ||
      p?.user_id ||
      p?.userId ||
      p?.owner_id ||
      p?.owner?.id ||
      p?.customer_id ||
      p?.customer?.id ||
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
  // Build ISO string with IST (+05:30) offset for start/end of day
  function toISTISO(dateStr, opts = { endOfDay: false }) {
    if (!dateStr) return "";
    const time = opts.endOfDay ? "23:59:59" : "00:00:00";
    // Keep explicit +05:30 offset as requested
    return `${dateStr}T${time}+05:30`;
  }
  // Currency formatter for display
  const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
function initialsFrom(category, id) {
  const cleanCategory = String(category || "").trim().replace(/_/g, " ");
  const firstCategoryChar = cleanCategory.charAt(0) || "?";

  // Handle ticket_id, skip "TID-" if present
  let cleanId = String(id || "").trim();
  if (cleanId.startsWith("TID-")) {
    cleanId = cleanId.substring(4); // remove "TID-"
  }
  const firstIdChar = cleanId.charAt(0) || "?";

  return (firstCategoryChar + firstIdChar).toUpperCase();
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
      // Collect attachment URLs/paths if provided by backend
      let attachments = [];
      try {
        if (Array.isArray(m?.attachments)) attachments = m.attachments;
        else if (Array.isArray(m?.attachment_urls)) attachments = m.attachment_urls;
        else if (Array.isArray(m?.files)) attachments = m.files.map((f) => f?.url || f?.path || f).filter(Boolean);
      } catch {}
      attachments = (attachments || []).map(String);
      return {
        id,
        text,
        time: formatISTDateTime(time),
        author: isMe ? "me" : "them",
        authorName: isMe ? "You" : (senderName || "User"),
        attachments,
        // Preserve sender and role for payment detection/UI rules
        senderId,
        roleId: Number(m?.role_id ?? m?.roleId ?? 0) || 0,
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

      // Send via env-configured ticket service
      const sendEndpoint = `${baseURL}/tickets-service/${encodeURIComponent(ticketId)}/messages`;
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
  async function openCreateModal(opts = { mode: "create" }) {
    // Fresh form when opening create modal
    if (opts?.mode !== "update") {
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
      setMilestoneDraft(null);
    }
    setCreateOpen(true);
    setUpdateMilestonesMode(opts?.mode === "update");
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
    // Default split: 20% (Advance), 40% (Midway), 40% (Final)
    const t = Number(total) || 0;
    const advance = Math.round(t * 0.2 * 100) / 100;
    const midway = Math.round(t * 0.4 * 100) / 100;
    const final = Math.round((t - advance - midway) * 100) / 100; // keep sum === total
    return [advance, midway, final];
  }
  function rebalanceMilestones(changedIdx, newVal) {
    setForm((prev) => {
      // If we have exactly 3 rows, keep the simple rebalance; otherwise just set the value
      const pm = [...prev.proposed_milestones];
      const v = Math.max(0, Number(newVal) || 0);
      pm[changedIdx] = { ...pm[changedIdx], amount: v };
      if (pm.length === 3) {
        const total = Number(prev.total_amount) || 0;
        const rest = total - v;
        const others = [0, 1, 2].filter((i) => i !== changedIdx);
        const each = Math.max(0, Math.round((rest / 2) * 100) / 100);
        pm[others[0]] = { ...pm[others[0]], amount: each };
        pm[others[1]] = { ...pm[others[1]], amount: Math.max(0, Math.round((rest - each) * 100) / 100) };
      }
      return { ...prev, proposed_milestones: pm };
    });
  }
  function updateTotalAmount(val) {
    const t = Math.max(0, Number(val) || 0);
    setForm((prev) => {
      let next = { ...prev, total_amount: t };
      // If we have exactly 3 default rows, auto-split equally for convenience
      if ((prev.proposed_milestones || []).length === 3) {
        const [a, b, c] = splitEqually(t);
        next.proposed_milestones = [
          { ...prev.proposed_milestones[0], amount: a },
          { ...prev.proposed_milestones[1], amount: b },
          { ...prev.proposed_milestones[2], amount: c },
        ];
      }
      return next;
    });
  }

  // Milestone Draft (3 static rows) helpers for the two-step create flow
  const FIXED_TITLES = ["milestone_Advance", "milestone_Midway", "milestone_Final"];

  function buildDraftFromForm() {
    const total = Math.max(0, Number(form.total_amount) || 0);
    const byTitle = Object.fromEntries((form.proposed_milestones || []).map((m) => [String(m.title || "").trim(), m]));
    const [a, b, c] = splitEqually(total);
    return [
      {
        title: "milestone_Advance",
        amount: Number(byTitle["milestone_Advance"]?.amount ?? a) || 0,
        start_date: byTitle["milestone_Advance"]?.start_date || "",
        end_date: byTitle["milestone_Advance"]?.end_date || "",
        notes: byTitle["milestone_Advance"]?.notes || "",
      },
      {
        title: "milestone_Midway",
        amount: Number(byTitle["milestone_Midway"]?.amount ?? b) || 0,
        start_date: byTitle["milestone_Midway"]?.start_date || "",
        end_date: byTitle["milestone_Midway"]?.end_date || "",
        notes: byTitle["milestone_Midway"]?.notes || "",
      },
      {
        title: "milestone_Final",
        amount: Number(byTitle["milestone_Final"]?.amount ?? c) || 0,
        start_date: byTitle["milestone_Final"]?.start_date || "",
        end_date: byTitle["milestone_Final"]?.end_date || "",
        notes: byTitle["milestone_Final"]?.notes || "",
      },
    ];
  }

  function openMilestoneCreator() {
    setMilestoneDraft(buildDraftFromForm());
    setMilestoneModalOpen(true);
  }

  function handleDraftAmountChange(idx, nextVal) {
    const total = Math.max(0, Number(form.total_amount) || 0);
    const v = Math.max(0, Number(nextVal) || 0);
    setMilestoneDraft((prev) => {
      const draft = prev ? [...prev] : buildDraftFromForm();
      const others = [0, 1, 2].filter((i) => i !== idx);
      const main = Math.min(v, total);
      const remaining = Math.max(0, total - main);
      const each = Math.round((remaining / 2) * 100) / 100;
      draft[idx] = { ...draft[idx], amount: main };
      draft[others[0]] = { ...draft[others[0]], amount: each };
      draft[others[1]] = { ...draft[others[1]], amount: Math.max(0, Math.round((remaining - each) * 100) / 100) };
      return draft;
    });
  }

  function handleDraftFieldChange(idx, key, value) {
    setMilestoneDraft((prev) => {
      const draft = prev ? [...prev] : buildDraftFromForm();
      draft[idx] = { ...draft[idx], [key]: value };
      return draft;
    });
  }

  function saveMilestonesFromDraft() {
    const draft = Array.isArray(milestoneDraft) ? milestoneDraft : buildDraftFromForm();
    setForm((prev) => ({
      ...prev,
      proposed_milestones: draft.map((m) => ({
        title: m.title,
        amount: Number(m.amount) || 0,
        start_date: m.start_date || "",
        end_date: m.end_date || "",
        notes: m.notes || "",
      })),
    }));
    setMilestoneModalOpen(false);
  }

  // Keep draft in sync with Total while modal is open
  useEffect(() => {
    if (!milestoneModalOpen) return;
    setMilestoneDraft((prev) => {
      const total = Math.max(0, Number(form.total_amount) || 0);
      if (!prev || prev.length !== 3) return buildDraftFromForm();
      const sum = prev.reduce((s, m) => s + (Number(m.amount) || 0), 0);
      if (Math.abs(sum - total) < 0.01) return prev;
      const [a, b, c] = splitEqually(total);
      return [
        { ...prev[0], amount: a, title: "milestone_Advance" },
        { ...prev[1], amount: b, title: "milestone_Midway" },
        { ...prev[2], amount: c, title: "milestone_Final" },
      ];
    });
  }, [form.total_amount, milestoneModalOpen]);

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
      const roleId = Number(
        localStorage.getItem("role_id") ||
          authParsed?.data?.user?.role_id ||
          authParsed?.data?.role_id ||
          authParsed?.user?.role_id ||
          0
      ) || 0;

      const raisedById = getUserIdFromStorage();
      const projectFromNav = location?.state?.project || location?.state || {};
      const freelancerId = getFreelancerIdFromProject(projectFromNav);
      const clientId = getClientIdFromProject(projectFromNav);
      // Assign based on role_id: if role_id === 1 (client) -> send freelancer_id; if role_id === 2 or 3 (freelancer/admin) -> send client id
      const assignedToId = roleId === 1 ? freelancerId : clientId || freelancerId;

      // Build names/ids per role rules
      const currentUserName = getUserNameFromStorage() || localStorage.getItem("name") || "";
      const clientNameFromProject = projectFromNav?.userName || projectFromNav?.userNmae || projectFromNav?.clientName || localStorage.getItem("clientName") || "";
      const freelancerNameFromProject = projectFromNav?.freelancerName || projectFromNav?.freelancerNmae || localStorage.getItem("freelancerName") || assignedToName || "";
      const assignedToName2 = roleId === 1 ? freelancerNameFromProject : (clientNameFromProject || currentUserName);

      const body = {
        project_id: projectId,
        category: form.category,
        role_id: roleId,
        description: form.description,
        attachments: (form.files || []).map((f) => f.name),
        // Names in raised_by / assigned_to, and IDs separately
        raised_by: currentUserName || "",
        assigned_to: assignedToName2 || "",
        raised_by_id: raisedById || "",
        raised_to_id: assignedToId || "",
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

      if (form.category === "start_approval") {
        // Use finalized milestones fetched from backend (read-only)
        const finalized = (startApproval?.milestones || []).map((m) => ({
          title: String(m?.title || "").trim(),
          amount: Number(m?.amount || 0),
          start_date: String(m?.start_date || "").trim(),
          end_date: String(m?.end_date || "").trim(),
          notes: String(m?.notes || "").trim(),
        }));
        body.proposed_milestones = [];
        body.finalized_milestones = finalized;
        body.payment_details = {
          method: "Razorpay", // static from frontend
          currency: "INR", // static from frontend
          total_amount: Number(startApproval?.total) || finalized.reduce((s, x) => s + (Number(x.amount) || 0), 0),
        };
        body.agreement_details = form.agreement_details || "Both parties agree to the milestone terms and delivery schedule.";
      }

      const createEndpoint = `${baseURL}/tickets-service/create`;

      const res = await fetch(createEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);

      await Swal.fire({ icon: "success", title: "Created", text: data?.message || "Ticket created successfully" });
      setCreateOpen(false);
      setUpdateMilestonesMode(false);

      // After creating start_approval: send milestones PDF + Pay Now message to chat
      try {
        if (form.category === "start_approval") {
          const token3 =
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("jwt") ||
            "";

          // ticket id
          const newTicketId = data?.data?.ticket_id || data?.ticket_id || data?.data?.id || data?.id;

          // Fetch finalized milestones PDF/url from API and attach as link message
          if (newTicketId) {
            try {
              const resM = await fetch(`${baseURL}/tickets-service/get-milestones/${encodeURIComponent(projectId)}`);
              const dataM = await resM.json().catch(() => ({}));
              const payloadM = dataM?.data || {};
              const pdfUrl = payloadM?.pdf_url || "";

              const senderName2 = getUserNameFromStorage() || localStorage.getItem("name") || "";
              const sendEndpoint = `${baseURL}/tickets-service/${encodeURIComponent(newTicketId)}/messages`;

              // Send a system payment request message with attachment:
              // - If pdf_url present, attach it; else attach the get-milestones API link (JSON)
              // - Include TOTAL_AMOUNT_REQUESTED in text to trigger Pay Now UI
              const totalAmountM =
                Number(payloadM?.total_amount) ||
                (Array.isArray(payloadM?.finalized_milestones)
                  ? payloadM.finalized_milestones.reduce((s, x) => s + (Number(x?.amount) || 0), 0)
                  : 0);
              const getMilestonesUrl = `${baseURL}/tickets-service/get-milestones/${encodeURIComponent(projectId)}`;

              const msgBody = {
                sender_id: "system",
                sender: "System",
                role_id: 3, // mark as system to show Pay Now prompt in UI
                text: `Payment requested. TOTAL_AMOUNT_REQUESTED=${totalAmountM}. Finalized milestones are ready. Please review and click Pay Now to proceed.`,
                attachments: [String(pdfUrl || getMilestonesUrl)],
              };

              await fetch(sendEndpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  ...(token3 ? { Authorization: `Bearer ${token3}` } : {}),
                },
                body: JSON.stringify(msgBody),
              });

              try { await loadTicketDetail({ ticket_id: newTicketId }); } catch {}
            } catch {}
          }
        }
      } catch {}

      setForm({
        category: "",
        description: "",
        files: [],
        total_amount: "",
        agreement_details: "Both parties agree to the milestone terms and delivery schedule.",
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

  // Submit milestone update (popup -> Done)
  async function handleSubmitMilestoneUpdate(opts = {}) {
    if (!selectedTicket) {
      await Swal.fire({ icon: "error", title: "No ticket selected", text: "Select a ticket to update milestones." });
      return;
    }
    const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;
    const userId = getUserIdFromStorage() || localStorage.getItem("userId") || "";
    if (!ticketId || !userId) {
      await Swal.fire({ icon: "error", title: "Missing data", text: "Cannot update without ticket or user." });
      return;
    }

    // Build milestones from the latest draft if modal is open; else from form state
    const srcMilestones = (milestoneModalOpen && Array.isArray(milestoneDraft) && milestoneDraft.length)
      ? milestoneDraft
      : (form?.proposed_milestones || []);

    const current = srcMilestones.map((m) => ({
      title: String(m.title || "").trim() || "Milestone",
      amount: Number(m.amount || 0),
      start_date: String(m.start_date || "").trim(),
      end_date: String(m.end_date || "").trim(),
      notes: String(m.notes || "").trim(),
    }));

    // If caller provided explicit override, use it as full replacement
    const fullMilestones = Array.isArray(opts.milestonesOverride)
      ? opts.milestonesOverride
      : current.map((m) => ({
          title: m.title,
          amount: m.amount,
          start_date: toISTISO(m.start_date, { endOfDay: false }),
          end_date: toISTISO(m.end_date, { endOfDay: true }),
          notes: m.notes,
        }));

    // Diff against originals to send only changed rows
    const original = Array.isArray(originalMilestonesRef.current) ? originalMilestonesRef.current : [];
    const patchMilestones = fullMilestones.filter((m, idx) => {
      const o = original[idx] || {};
      const oNorm = {
        title: String(o.title || o.name || "").trim(),
        amount: Number(o.amount ?? o.price ?? o.value ?? 0),
        start_date: String(o.start_date || o.startDate || "").trim(),
        end_date: String(o.end_date || o.endDate || "").trim(),
        notes: String(o.notes || o.description || "").trim(),
      };
      const cNorm = {
        title: String(m.title || "").trim(),
        amount: Number(m.amount || 0),
        // Compare raw dates without T suffix
        start_date: String(current[idx]?.start_date || "").trim(),
        end_date: String(current[idx]?.end_date || "").trim(),
        notes: String(m.notes || "").trim(),
      };
      return (
        oNorm.title !== cNorm.title ||
        oNorm.amount !== cNorm.amount ||
        oNorm.start_date !== cNorm.start_date ||
        oNorm.end_date !== cNorm.end_date ||
        oNorm.notes !== cNorm.notes
      );
    });

    const computedTotal = current.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const nextTotal = Number(opts.totalOverride ?? computedTotal) || 0;
    const originalTotal = Number(originalTotalRef.current ?? 0) || 0;
    const total_amount = String(nextTotal);

    setUpdatingMilestones(true);
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("jwt") ||
        "";

      const url = `${baseURL}/tickets-service/${encodeURIComponent(ticketId)}/milestones/update`;
      // Backend requires full body: user_id, milestones (full array), total_amount
      const payload = {
        user_id: userId,
        milestones: fullMilestones, // always send full milestones array
        total_amount: String(nextTotal), // always include total
      };

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);

      await Swal.fire({ icon: "success", title: "Milestones updated", text: data?.message || "Milestones saved successfully." });
      // Reload the page to reflect latest changes
      window.location.reload();
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Update failed", text: e?.message || "Failed to update milestones" });
    } finally {
      setUpdatingMilestones(false);
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
      const url = `${baseURL}/tickets-service/${encodeURIComponent(ticketId)}/close?user_id=${encodeURIComponent(userId)}`;
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
  {initialsFrom(category, id)}
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center justify-content-between">
                            
<div className="fw-semibold text-truncate" title={category}>
  {category
    ? category
        .replace(/_/g, " ")                // replace underscores with spaces
        .toLowerCase()                     // make all lowercase
        .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize first letter of each word
    : "—"}
</div>

                              <div className="small text-muted ms-2">{updatedAt ? formatISTTime(updatedAt) : ""}</div>
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <span className="text-truncate"title={String(id)}>{shortenId(id)} </span>
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
                          // Open the milestone editor directly with existing data and update mode
                          const sm = Array.isArray(selectedTicket?.proposed_milestones)
                            ? selectedTicket.proposed_milestones
                            : Array.isArray(selectedTicket?.milestones)
                            ? selectedTicket.milestones
                            : [];
                          const normalized = sm.map((m) => ({
                            title: String(m.title || m.name || "").trim() || "Milestone",
                            amount: Number(m.amount ?? m.price ?? m.value ?? 0),
                            start_date: String(m.start_date || m.startDate || "").slice(0, 10),
                            end_date: String(m.end_date || m.endDate || "").slice(0, 10),
                            notes: String(m.notes || m.description || "").trim(),
                          }));
                          const total =
                            Number(
                              selectedTicket?.total_amount ??
                                selectedTicket?.totalAmount ??
                                normalized.reduce((s, x) => s + (Number(x.amount) || 0), 0)
                            ) || 0;

                          setUpdateMilestonesMode(true);
                          // store originals to compare later
                          originalMilestonesRef.current = normalized;
                          originalTotalRef.current = total;
                          setForm((prev) => ({
                            ...prev,
                            category: "project_clarification",
                            total_amount: total,
                            proposed_milestones: normalized.length ? normalized : prev.proposed_milestones,
                          }));
                          setMilestoneDraft(normalized.length ? normalized : buildDraftFromForm());
                          setMilestoneModalOpen(true);
                        }}
                        disabled={String(selectedTicket?.status || "").toLowerCase().includes("close")}
                        title={String(selectedTicket?.status || "").toLowerCase().includes("close") ? "Ticket is closed" : undefined}
                      >
                       View / Update Milestone
                      </button>
                    )}
                    <button
                      className="btn btn-link text-danger text-decoration-none"
                      onClick={handleCloseTicket}
                      disabled={String(selectedTicket?.status || "").toLowerCase().includes("close")}
                      title={String(selectedTicket?.status || "").toLowerCase().includes("close") ? "Already closed" : undefined}
                    >
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
            {/* Attachments (if backend returns attachment URLs) */}
            {Array.isArray(m.attachments) && m.attachments.length > 0 && (
              <div className="mb-2 d-flex flex-column gap-1">
                {m.attachments.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className={`small ${m.author === "me" ? "text-white" : "text-primary"}`}>
                    <i className="far fa-paperclip me-1" /> Attachment {i + 1}
                  </a>
                ))}
              </div>
            )}
            <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
            {/* Inline payment request + Pay Now button when system creates ticket for start_approval */}
            {(() => {
              // Conditions based on your requirement:
              // - message.role_id === 3 (system/enterprise)
              // - text contains payment cue or legacy cue
              // - sender_id !== current user
              const meId = String(getUserIdFromStorage() || "");
              const isFromOther = String(m?.senderId || "") !== meId;
              const textStr = String(m.text || "");
              const matchAmt = textStr.match(/TOTAL_AMOUNT_REQUESTED\s*=\s*([0-9]+(?:\.[0-9]+)?)/i);
              const requestedAmount = matchAmt ? Number(matchAmt[1]) : null;
              const isCue = /Payment requested/i.test(textStr) || /Ticket created successfully\. Preparing details…/i.test(textStr);
              const hasAttachment = Array.isArray(m.attachments) && m.attachments.length > 0;
              const isSystemMsg = Number(m?.roleId || 0) === 3;
              const shouldSuggestPay = isSystemMsg && isCue && isFromOther && (hasAttachment || requestedAmount != null);
              if (!shouldSuggestPay) return null;

              // Only show to client role (role_id === 1)
              let viewerRole = 0;
              try {
                const direct = localStorage.getItem("roleid") ?? localStorage.getItem("role_id");
                if (direct) {
                  try { const p = JSON.parse(direct); viewerRole = Array.isArray(p) ? Number(p[0]) || 0 : Number(p) || Number(direct) || 0; } catch { viewerRole = Number(direct) || 0; }
                } else {
                  const raw = localStorage.getItem("auth");
                  if (raw) {
                    const auth = JSON.parse(raw);
                    const val = auth?.data?.role_id ?? auth?.role_id ?? auth?.data?.user?.role_id ?? auth?.user?.role_id ?? null;
                    viewerRole = Array.isArray(val) ? Number(val[0]) || 0 : Number(val) || 0;
                  }
                }
              } catch {}
              if (viewerRole !== 1) return null;

              return (
                <div className="mt-2">
                  <div className={`small mb-2 ${m.author === "me" ? "text-white-50" : "text-muted"}`}>
                    Payment requested for this project{requestedAmount != null ? `: ${inr.format(Number(requestedAmount) || 0)}` : ""}. You can proceed to pay now.
                  </div>
                  <button type="button" className={`btn btn-sm ${m.author === "me" ? "btn-light" : "btn-outline-primary"}`}
                    onClick={async () => {
                      try {
                        // Add a temporary "Processing payment…" chat bubble for immediate feedback
                        const tempId = `tmp-${Date.now()}`;
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: tempId,
                            text: "Processing payment…",
                            time: formatISTDateTime(new Date().toISOString()),
                            author: "me",
                            authorName: "You",
                          },
                        ]);

                        // Log tap to backend
                        const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;
                        const token4 =
                          localStorage.getItem("token") ||
                          localStorage.getItem("accessToken") ||
                          localStorage.getItem("authToken") ||
                          localStorage.getItem("jwt") ||
                          "";
                        const fd = new FormData();
                        fd.append("sender_id", String(getUserIdFromStorage() || ""));
                        fd.append("sender", String(getUserNameFromStorage() || ""));
                        fd.append("role_id", String(1));
                        fd.append("text", "User tapped Pay Now.");
                        const sendEndpoint = `${baseURL}/tickets-service/${encodeURIComponent(ticketId)}/messages`;
                        await fetch(sendEndpoint, { method: "POST", headers: { ...(token4 ? { Authorization: `Bearer ${token4}` } : {}) }, body: fd });

                        // Payment flow
                        const hostAdm = import.meta.env.VITE_BACKEND_HOST_ADMIN;
                        const payPort = import.meta.env.VITE_BACKEND_PAYMENT_PORT;
                        if (!hostAdm || !payPort) throw new Error("Payment service env not configured");
                        const paymentBase = `http://${hostAdm}:${payPort}`;

                        // Get finalized milestones/total for this project from tickets-service
                        const resM = await fetch(`${baseURL}/tickets-service/get-milestones/${encodeURIComponent(projectId)}`);
                        const dataM = await resM.json().catch(() => ({}));
                        const payload = dataM?.data || {};
                        const finalized = Array.isArray(payload.finalized_milestones) ? payload.finalized_milestones : [];
                        const computedTotal = Number(payload.total_amount) || finalized.reduce((s, x) => s + (Number(x.amount) || 0), 0);
                        const totalAmount = requestedAmount != null ? Number(requestedAmount) : computedTotal;

                        const userId = localStorage.getItem("userId") || "";
                        const userName = localStorage.getItem("name") || "";
                        const userEmail = getUserEmailFromStorage() || "";

                        const projectFromNav = location?.state?.project || location?.state || {};
                        let freelancerId = (
                          projectFromNav?.freelancerId || projectFromNav?.freelancer_id || projectFromNav?.freelancerUserId || ""
                        );
                        let freelancerEmail = projectFromNav?.freelancerEmail || localStorage.getItem("freelancerEmail") || "";
                        let freelancerName = projectFromNav?.freelancerName || localStorage.getItem("freelancerName") || "";
                        if (!freelancerId) {
                          try {
                            const t = selectedTicket || {};
                            const msgs = Array.isArray(t.messages) ? t.messages : [];
                            for (const mm of msgs) {
                              const sid = mm?.sender_id || mm?.senderId;
                              if (sid && sid !== userId) { freelancerId = sid; break; }
                            }
                          } catch {}
                        }

                        // Create order
                        const createRes = await fetch(`${paymentBase}/payment-service/createPayment`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Accept: "application/json" },
                          body: JSON.stringify({
                            userId,
                            userName,
                            userEmail,
                            currency: "INR",
                            total_amount: totalAmount,
                            finalized_milestones: finalized,
                            freelancerId,
                            freelancerEmail,
                            freelancerName,
                            projectId,
                          }),
                        });
                        const createData = await createRes.json().catch(() => ({}));
                        if (!createRes.ok) throw new Error(createData?.message || `Create failed: ${createRes.status}`);

                        const orderId = createData?.data?.razorpayOrder?.id;
                        if (!orderId) throw new Error("Order ID not received");

                        // Razorpay options
                        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
                        if (!razorpayKey) {
                          throw new Error("Razorpay key missing. Set VITE_RAZORPAY_KEY_ID in .env");
                        }
                        const options = {
                          key: razorpayKey,
                          amount: Math.round(totalAmount * 100),
                          currency: 'INR',
                          name: 'Your Company',
                          description: 'Payment for project',
                          order_id: orderId,
                          handler: async function (response) {
                            try {
                              // Verify payment
                              const verifyRes = await fetch(`${paymentBase}/payment-service/verifyPayment`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json", Accept: "application/json" },
                                body: JSON.stringify({
                                  razorpay_order_id: response.razorpay_order_id,
                                  razorpay_payment_id: response.razorpay_payment_id,
                                  razorpay_signature: response.razorpay_signature,
                                }),
                              });
                              const verifyData = await verifyRes.json().catch(() => ({}));
                              if (!verifyRes.ok) throw new Error(verifyData?.message || `Verify failed: ${verifyRes.status}`);

                              // Send message with success (user-friendly text)
                              const senderName2 = getUserNameFromStorage() || "";
                              const verified = verifyData?.data || {};
                              const friendlyTextParts = [
                                "Payment verified successfully.",
                                verified.total_amount != null ? `Amount: ${inr.format(Number(verified.total_amount) || 0)}.` : "",
                                verified.verifiedAt ? `Verified at: ${formatISTDateTime(verified.verifiedAt)}.` : "",
                                verified.status ? `Status: ${String(verified.status).toUpperCase()}.` : "",
                                verified.projectId ? `Project: ${shortenId(verified.projectId)}.` : "",
                              ];
                              const body = {
                                sender_id: getUserIdFromStorage() || "",
                                sender: senderName2,
                                role_id: 1,
                                text: friendlyTextParts.filter(Boolean).join(" "),
                              };
                              await fetch(sendEndpoint, {
                                method: "POST",
                                headers: { "Content-Type": "application/json", Accept: "application/json", ...(token4 ? { Authorization: `Bearer ${token4}` } : {}) },
                                body: JSON.stringify(body),
                              });

                              // Update temp message
                              setMessages((prev) => prev.map((msg) => msg.id === tempId ? { ...msg, text: "Payment successful.", time: formatISTDateTime(new Date().toISOString()) } : msg));
                              await Swal.fire({ icon: "success", title: "Payment verified", text: verifyData?.message || "Success" });
                            } catch (e) {
                              setMessages((prev) => prev.map((msg) => msg.id === tempId ? { ...msg, text: `Payment failed: ${e?.message || "Unknown error"}` } : msg));
                              await Swal.fire({ icon: "error", title: "Payment", text: e?.message || "Failed to process payment" });
                              // Reload to fully recover UI after payment verification errors
                              window.location.reload();
                            } finally {
                              // Refresh conversation
                              try {
                                await loadTicketDetail({ ticket_id: ticketId });
                              } catch {}
                            }
                          },
                          prefill: {
                            name: userName,
                            email: userEmail,
                          },
                          theme: {
                            color: '#2563eb',
                          },
                        };

                        // Open Razorpay modal
                        const rzp = new window.Razorpay(options);
                        // Handle explicit payment failure events to avoid blank screen
                        try {
                          rzp.on("payment.failed", async (response) => {
                            // reflect failure in chat UI
                            setMessages((prev) =>
                              prev.map((msg) =>
                                msg.id === tempId
                                  ? { ...msg, text: `Payment failed: ${response?.error?.description || "Unknown error"}` }
                                  : msg
                              )
                            );
                            await Swal.fire({ icon: "error", title: "Payment failed", text: response?.error?.description || "Payment could not be completed" });
                            // Reload to recover UI state if any error leaves blank screen
                            window.location.reload();
                          });
                        } catch {}
                        rzp.open();
                      } catch (e) {
                        // Replace the temp message with failure status
                        setMessages((prev) => prev.map((msg) => msg.id === tempId ? { ...msg, text: `Payment failed: ${e?.message || "Unknown error"}` } : msg));
                        await Swal.fire({ icon: "error", title: "Payment", text: e?.message || "Failed to process payment" });
                        // Reload to recover from any unexpected payment flow error that may blank the page
                        window.location.reload();
                      } finally {
                        // Refresh conversation to reflect any backend messages
                        try {
                          const ticketId = selectedTicket?.ticket_id || selectedTicket?.id || selectedTicket?._id;
                          await loadTicketDetail({ ticket_id: ticketId });
                        } catch {}
                      }
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              );
            })()}
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
                <h5 className="modal-title">{updateMilestonesMode ? "Update Milestones" : "Create Ticket"}</h5>
                <button type="button" className="btn-close" onClick={() => setCreateOpen(false)} />
              </div>
              <div className="modal-body">
                {!projectId && (
                  <div className="alert alert-warning">ProjectId missing. Open this from a project context.</div>
                )}

                {catLoading && <div className="small text-muted mb-2">Loading categories…</div>}
                {catError && <div className="alert alert-danger mb-2">{catError}</div>}

                {!updateMilestonesMode && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={async (e) => {
                          const val = e.target.value;
                          setForm({ ...form, category: val });
                          if (val === "start_approval" && projectId) {
                            try {
                              setStartApproval({ loading: true, error: "", milestones: [], total: 0 });
                              const res = await fetch(`${baseURL}/tickets-service/get-milestones/${encodeURIComponent(projectId)}`);
                              const data = await res.json().catch(() => ({}));
                              if (!res.ok) throw new Error(data?.message || `Failed: ${res.status}`);
                              const payload = data?.data || {};
                              const finalized = Array.isArray(payload.finalized_milestones) ? payload.finalized_milestones : [];
                              const total = Number(payload.total_amount) || finalized.reduce((s, m) => s + (Number(m?.amount) || 0), 0);
                              setStartApproval({ loading: false, error: "", milestones: finalized, total });
                              // Show typing and auto message until send
                              await Swal.fire({ icon: "success", title: "Ticket category set", text: "Fetching milestones. You will see an automated message soon." });
                            } catch (err) {
                              setStartApproval({ loading: false, error: err?.message || "Failed to fetch milestones", milestones: [], total: 0 });
                              await Swal.fire({ icon: "error", title: "Milestones", text: err?.message || "Failed to fetch finalized milestones" });
                            }
                          }
                        }}
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
                  </>
                )}

                {/* start_approval: show finalized milestones read-only */}
                {form.category === "start_approval" && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Finalized Milestones</h6>
                      <div className="d-flex align-items-center gap-2">
                        <div className="small text-muted me-2">Total: {inr.format(Number(startApproval.total) || 0)}</div>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setFinalizedModalOpen(true)}
                          disabled={startApproval.loading || !!startApproval.error || (startApproval.milestones || []).length === 0}
                        >
                          View details
                        </button>
                      </div>
                    </div>
                    {startApproval.loading && <div className="small text-muted">Loading milestones…</div>}
                    {startApproval.error && <div className="alert alert-warning py-2 px-3">{startApproval.error}</div>}
                    {/* {!startApproval.loading && !startApproval.error && (
                      <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                          <thead className="table-light">
                            <tr>
                              <th style={{width: '30%'}}>Title</th>
                              <th style={{width: '15%'}}>Amount</th>
                              <th style={{width: '20%'}}>Start</th>
                              <th style={{width: '20%'}}>End</th>
                              <th style={{width: '15%'}}>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(startApproval.milestones || []).length === 0 ? (
                              <tr><td colSpan={5} className="text-center text-muted">No milestones available</td></tr>
                            ) : (
                              startApproval.milestones.map((m, idx) => (
                                <tr key={idx}>
                                  <td>
                                    <input type="text" className="form-control" value={m?.title || ''} readOnly />
                                  </td>
                                  <td>
                                    <div className="input-group"><span className="input-group-text bg-white">₹</span>
                                      <input type="number" className="form-control" value={Number(m?.amount)||0} readOnly />
                                    </div>
                                  </td>
                                  <td>
                                    <input type="text" className="form-control" value={formatISTDateTime(m?.start_date)} readOnly />
                                  </td>
                                  <td>
                                    <input type="text" className="form-control" value={formatISTDateTime(m?.end_date)} readOnly />
                                  </td>
                                  <td>
                                    <input type="text" className="form-control" value={m?.notes || ''} readOnly />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )} */}

                    {/* Agreement details input (only for start_approval) */}
                    <div className="mt-3">
                      <label className="form-label">Agreement Details</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Agreement terms"
                        value={form.agreement_details}
                        onChange={(e) => setForm({ ...form, agreement_details: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {form.category === "project_clarification" && (
                  <div className="mb-3">
                    <div className="row g-2 align-items-end">
                      <div className="col-12 col-md-6">
                        <label className="form-label">Total Amount</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Total"
                            value={form.total_amount}
                            onChange={(e) => updateTotalAmount(e.target.value)}
                          />
                        </div>
                        <div className="form-text">Calculated from milestones: <strong>{inr.format(milestonesTotal || 0)}</strong></div>
                      </div>
                      <div className="col-12 col-md-6 text-md-end mt-3 mt-md-0">
                       <button
  type="button"
  className="btn btn-outline-primary d-inline-flex align-items-center"
  onClick={openMilestoneCreator}
  disabled={!Number(form.total_amount)}
>
  <i className="far fa-layer-plus me-2" /> Create Milestones
</button>

                      </div>
                    </div>
                    {/* Progress: show how much of total is currently allocated in form */}
                    <div className="mt-2 small text-muted">
                      {inr.format(milestonesTotal || 0)} of {inr.format(Number(form.total_amount) || 0)} allocated
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
                    disabled={updateMilestonesMode}
                  />
                  <div className="form-text">Optional. You can attach multiple files.</div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setCreateOpen(false);
                    setUpdateMilestonesMode(false);
                  }}
                >
                  Cancel
                </button>
                {updateMilestonesMode ? (
                  <button className="btn btn-primary" onClick={handleSubmitMilestoneUpdate} disabled={updatingMilestones}>
                    {updatingMilestones ? "Updating…" : "Done"}
                  </button>
                ) : (
                  <button
                    className="btn btn-dark"
                    onClick={handleCreateTicket}
                    disabled={form.category === "start_approval" && startApproval.loading}
                  >
                    {form.category === "start_approval" && startApproval.loading ? "Fetching…" : "Create"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finalized Milestones View Modal (read-only) */}
      {finalizedModalOpen && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.45)" }}>
          <div className="modal-dialog modal-xxl modal-dialog-centered" style={{ maxWidth: "95vw", width: "95vw" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Milestone details</h5>
                <button type="button" className="btn-close" onClick={() => setFinalizedModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">Finalized Milestones</div>
                  <div className="small text-muted">Total: {inr.format(Number(startApproval.total) || 0)}</div>
                </div>
                {/* Reuse the creation modal's grid design, but read-only */}
                <div className="d-none d-md-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.3fr 1.3fr 1.4fr",
                  gap: 12,
                  padding: "12px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  background: "#f9fafb"
                }}>
                  <div className="fw-semibold small">Title</div>
                  <div className="fw-semibold small">Amount</div>
                  <div className="fw-semibold small">Start Date</div>
                  <div className="fw-semibold small">End Date</div>
                  <div className="fw-semibold small">Description</div>
                </div>
                <div className="mt-2 d-flex flex-column gap-2">
                  {(startApproval.milestones || []).length === 0 ? (
                    <div className="text-center text-muted">No milestones available</div>
                  ) : (
                    startApproval.milestones.map((m, idx) => (
                      <div key={idx} className="p-2" style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}>
                        <div className="d-grid" style={{ gridTemplateColumns: "2fr 1fr 1.3fr 1.3fr 1.4fr", gap: 12 }}>
                          <input type="text" className="form-control" value={m?.title || ''} readOnly />
                          <div className="input-group"><span className="input-group-text bg-white">₹</span>
                            <input type="number" className="form-control" value={Number(m?.amount)||0} readOnly />
                          </div>
                          <input type="text" className="form-control" value={formatISTDateTime(m?.start_date)} readOnly />
                          <input type="text" className="form-control" value={formatISTDateTime(m?.end_date)} readOnly />
                          <input type="text" className="form-control" value={m?.notes || ''} readOnly />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setFinalizedModalOpen(false)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Creation Modal (Step 2) */}
      {milestoneModalOpen && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.45)" }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Milestones</h5>
                <button type="button" className="btn-close" onClick={() => setMilestoneModalOpen(false)} />
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div className="fw-semibold">Total Budget: {inr.format(Number(form.total_amount) || 0)}</div>
                  <div className="d-flex align-items-center gap-2">
                    <label className="small mb-0">Edit Total</label>
                    <div className="input-group" style={{ maxWidth: 220 }}>
                      <span className="input-group-text bg-white">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={form.total_amount}
                        onChange={(e) => setForm((prev) => ({ ...prev, total_amount: Math.max(0, Number(e.target.value) || 0) }))}
                      />
                    </div>
                  </div>
                  <div className="text-muted small ms-auto">
                    {inr.format((milestoneDraft || []).reduce((s, m) => s + (Number(m?.amount) || 0), 0))}
                    {" "}of {inr.format(Number(form.total_amount) || 0)} allocated
                  </div>
                </div>

                <div className="d-none d-md-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.3fr 1.3fr 1.4fr",
                  gap: 12,
                  padding: "12px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  background: "#f9fafb"
                }}>
                  <div className="fw-semibold small">Title</div>
                  <div className="fw-semibold small">Amount</div>
                  <div className="fw-semibold small">Start Date</div>
                  <div className="fw-semibold small">End Date</div>
                  <div className="fw-semibold small">Description</div>
                </div>

                <div className="mt-2 d-flex flex-column gap-2">
                  {(milestoneDraft || buildDraftFromForm()).map((m, idx) => (
                    <div key={idx} className="p-2" style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}>
                      <div className="d-grid" style={{ gridTemplateColumns: "2fr 1fr 1.3fr 1.3fr 1.4fr", gap: 12 }}>
                        {/* Title: static labels */}
                        <input
                          type="text"
                          className="form-control rounded"
                          value={m.title}
                          readOnly
                        />

                        {/* Amount */}
                        <div className="input-group">
                          <span className="input-group-text bg-white">₹</span>
                          <input
                            type="number"
                            className="form-control rounded"
                            placeholder="0.00"
                            value={m.amount}
                            onChange={(e) => handleDraftAmountChange(idx, e.target.value)}
                          />
                        </div>

                        {/* Start Date */}
                        <div className="input-group">
                          <span className="input-group-text bg-white"><i className="far fa-calendar" /></span>
                          <input
                            type="date"
                            className="form-control rounded"
                            value={m.start_date}
                            // Midway must start on/after Advance end; Final on/after Midway end
                            min={idx === 1
                              ? ((milestoneDraft && milestoneDraft[0] && milestoneDraft[0].end_date) || "")
                              : idx === 2
                                ? ((milestoneDraft && milestoneDraft[1] && milestoneDraft[1].end_date) || "")
                                : undefined}
                            onChange={(e) => handleDraftFieldChange(idx, "start_date", e.target.value)}
                          />
                        </div>

                        {/* End Date */}
                        <div className="input-group">
                          <span className="input-group-text bg-white"><i className="far fa-calendar" /></span>
                          <input
                            type="date"
                            className="form-control rounded"
                            value={m.end_date}
                            // End date cannot be before the start date
                            min={m.start_date || ""}
                            onChange={(e) => handleDraftFieldChange(idx, "end_date", e.target.value)}
                          />
                        </div>

                        {/* Notes */}
                        <input
                          type="text"
                          className="form-control rounded"
                          placeholder="Notes (required)"
                          value={m.notes || ""}
                          onChange={(e) => handleDraftFieldChange(idx, "notes", e.target.value)}
                        />
                      </div>

                      {/* Mobile inline summary */}
                      <div className="d-md-none mt-2 small text-muted">
                        {m.title} · {m.start_date || "Start"} → {m.end_date || "End"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setMilestoneModalOpen(false)}>Cancel</button>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    // Save into form first
                    saveMilestonesFromDraft();
                    // Then immediately call backend if we're in update mode
                    setTimeout(() => {
                      if (updateMilestonesMode) {
                        const totalOverride = Number(form.total_amount) || 0;
                        handleSubmitMilestoneUpdate({ totalOverride });
                      }
                    }, 0);
                  }}
                  disabled={!Number(form.total_amount) || updatingMilestones}
                >
                  {updateMilestonesMode ? (updatingMilestones ? "Updating…" : "Update Milestones") : "Save Milestones"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}