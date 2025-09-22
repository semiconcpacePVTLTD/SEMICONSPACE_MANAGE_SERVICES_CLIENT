import React, { useMemo } from "react";

export default function Skill({ details = {}, editable = false, onChange }) {
  // Normalize skills from profile_details
  const skills = useMemo(() => {
    const raw = details?.skills;
    if (!raw) return [];
    try {
      // Try JSON if backend returns a JSON string
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
      }
    } catch (_) {
      // Fallback: comma-separated values
      if (typeof raw === "string") return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // If already array or object
    return Array.isArray(raw) ? raw : [raw];
  }, [details]);

  if (editable) {
    return (
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25 d-sm-flex justify-content-between">
          <h5 className="list-title">Skills</h5>
        </div>
        <div className="col-lg-7">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Enter skills separated by commas"
            defaultValue={Array.isArray(skills) ? skills.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean).join(', ') : ''}
            onBlur={(e) => onChange?.(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
          <p className="text-muted mt-2 mb-0" style={{fontSize: '.9rem'}}>
            Tip: separate multiple skills with commas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb25">
          <h5 className="list-title">Skills</h5>
        </div>
        <div className="col-lg-7">
          {skills.length === 0 ? (
            <p className="text-muted mb-0">No skills added yet.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {skills.map((item, idx) => {
                const label = typeof item === "string" ? item : item?.name ?? "Skill";
                const level = typeof item === "object" && item?.level ? ` • ${item.level}` : "";
                return (
                  <span key={idx} className="badge text-bg-light border">
                    {label}{level}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}