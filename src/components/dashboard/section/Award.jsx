import React, { useMemo } from "react";

export default function Award({ details = {} }) {
  // Map certifications to "awards" section for freelancers
  const certs = useMemo(() => {
    const raw = details?.certifications;
    return Array.isArray(raw) ? raw : [];
  }, [details]);

  return (
    <>
      <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
        <div className="bdrb1 pb15 mb30 d-sm-flex justify-content-between">
          <h5 className="list-title">Awards & Certifications</h5>
        </div>
        <div className="position-relative">
          {certs.length === 0 ? (
            <p className="text-muted mb-0">No certifications added yet.</p>
          ) : (
            <div className="educational-quality ps-0">
              {certs.map((c, idx) => (
                <div key={idx} className={`wrapper ${idx !== certs.length - 1 ? "mb30" : "mb0"} position-relative`}>
                  <h5 className="mt15">{c?.name || "Certification"}</h5>
                  {c?.url ? (
                    <h6 className="text-thm">
                      <a href={c.url} target="_blank" rel="noreferrer">View credential</a>
                    </h6>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}