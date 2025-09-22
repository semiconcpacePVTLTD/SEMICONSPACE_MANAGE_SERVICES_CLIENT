import React, { useMemo } from "react";

export default function Education({ details = {}, editable = false, onChange }) {
  const education = useMemo(() => {
    const raw = details?.education;
    return Array.isArray(raw) ? raw : [];
  }, [details]);

  if (editable) {
    return (
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb30 d-sm-flex justify-content-between">
          <h5 className="list-title">Education</h5>
        </div>
        <div className="position-relative">
          {education.length === 0 ? (
            <p className="text-muted mb-2">No education entries yet.</p>
          ) : null}
          <div className="d-flex flex-column gap-3">
            {education.map((ed, idx) => (
              <div key={idx} className="row g-2">
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ed?.degree || ''} placeholder="Degree" onBlur={(e)=>{
                    const next=[...education]; next[idx]={...next[idx], degree:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ed?.institution || ''} placeholder="Institution" onBlur={(e)=>{
                    const next=[...education]; next[idx]={...next[idx], institution:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ed?.start_year || ''} placeholder="Start Year" onBlur={(e)=>{
                    const next=[...education]; next[idx]={...next[idx], start_year:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-sm-6">
                  <input className="form-control" defaultValue={ed?.end_year || ''} placeholder="End Year" onBlur={(e)=>{
                    const next=[...education]; next[idx]={...next[idx], end_year:e.target.value}; onChange?.(next);
                  }} />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows={2} defaultValue={ed?.description || ''} placeholder="Description" onBlur={(e)=>{
                    const next=[...education]; next[idx]={...next[idx], description:e.target.value}; onChange?.(next);
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
          <h5 className="list-title">Education</h5>
        </div>
        <div className="position-relative">
          {education.length === 0 ? (
            <p className="text-muted mb-0">No education entries yet.</p>
          ) : (
            <div className="educational-quality">
              {education.map((ed, idx) => (
                <div key={idx} className={`wrapper ${idx !== education.length - 1 ? "mb30" : "mb0"} position-relative`}>
                  <span className="tag">
                    {ed?.start_year ?? ""}{ed?.start_year || ed?.end_year ? " - " : ""}{ed?.end_year ?? ""}
                  </span>
                  <h5 className="mt15">{ed?.degree || "Degree"}</h5>
                  <h6 className="text-thm">{ed?.institution || "Institution"}</h6>
                  {ed?.description && <p className="mb-0">{ed.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}