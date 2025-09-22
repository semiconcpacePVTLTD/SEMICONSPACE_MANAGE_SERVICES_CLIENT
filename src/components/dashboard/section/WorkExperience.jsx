import React, { useMemo } from "react";

export default function WorkExperience({ details = {}, editable = false, onChange }) {
  const experience = useMemo(() => {
    const raw = details?.experience;
    return Array.isArray(raw) ? raw : [];
  }, [details]);

  if (editable) {
    return (
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb30 d-sm-flex justify-content-between">
          <h5 className="list-title">Work & Experience</h5>
        </div>
        <div className="position-relative">
          {experience.length === 0 ? (
            <p className="text-muted mb-2">No experience entries yet.</p>
          ) : null}
          <div className="d-flex flex-column gap-3">
            {experience.map((ex, idx) => (
              <div key={idx} className="row g-2">
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ex?.position || ''} placeholder="Position" onBlur={(e)=>{
                    const next=[...experience]; next[idx]={...next[idx], position:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ex?.company || ''} placeholder="Company" onBlur={(e)=>{
                    const next=[...experience]; next[idx]={...next[idx], company:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ex?.start_year || ''} placeholder="Start Year" onBlur={(e)=>{
                    const next=[...experience]; next[idx]={...next[idx], start_year:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ex?.end_year || ''} placeholder="End Year (or Present)" onBlur={(e)=>{
                    const next=[...experience]; next[idx]={...next[idx], end_year:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows={2} defaultValue={ex?.description || ''} placeholder="Description" onBlur={(e)=>{
                    const next=[...experience]; next[idx]={...next[idx], description:e.target.value}; onChange?.(next);
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb30 d-sm-flex justify-content-between">
          <h5 className="list-title">Work & Experience</h5>
        </div>
        <div className="position-relative">
          {experience.length === 0 ? (
            <p className="text-muted mb-0">No experience entries yet.</p>
          ) : (
            <div className="educational-quality">
              {experience.map((ex, idx) => (
                <div key={idx} className={`wrapper ${idx !== experience.length - 1 ? "mb30" : "mb0"} position-relative`}>
                  <span className="tag">
                    {ex?.start_year ?? ""}{ex?.start_year || ex?.end_year ? " - " : ""}{ex?.end_year ?? "Present"}
                  </span>
                  <h5 className="mt15">{ex?.position || "Position"}</h5>
                  <h6 className="text-thm">{ex?.company || "Company"}</h6>
                  {ex?.description && <p className="mb-0">{ex.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}