import { Link } from "react-router-dom";

// Custom card for Service 1 page showcasing backend fields
export default function ServiceCardService1({ data }) {
    const raw = data?.raw || {};
    const img = data?.img;

    // Parse capabilities (supports numbered lines and bullets)
    const capabilitiesStr = raw.capabilities || "";
    const capabilities = capabilitiesStr
        .split(/\r?\n+/)
        .map((s) => s.replace(/^\d+\)?\.?\s*/, "").trim()) // remove leading numbers like 1) or 1.
        .filter((s) => s && !/^capabilities:?$/i.test(s));

    // Parse tools (strip leading label and split by comma/newline)
    const toolsStr = (raw.tools || "").replace(/^tools\s*:?\s*/i, "");
    const tools = toolsStr
        .split(/[\n,]+/)
        .map((t) => t.trim())
        .filter(Boolean);

    const ms = raw.milestoneRules || {};

    return (
        <div className="default-box-shadow1 bdrs16 h-100 p20 p30-md">
            <div className="list-thumb mb15">
                <img className="w-100 bdrs12 object-fit-cover" src={img} alt={data?.title} />
            </div>
            <div className="list-content">
                <p className="list-text body-color fz14 mb-1">{data?.category}</p>
                <h5 className="list-title mb10">
                    <Link to={`/service-single/${data?.id}`}>{data?.title}</Link>
                </h5>
                {data?.description && (
                    <p className="body-color fz14 mb15" style={{ minHeight: 42 }}>
                        {data.description}
                    </p>
                )}

                {/* Capabilities (show up to 4) */}
                {capabilities.length > 0 && (
                    <ul className="list-style-type-bullet body-color fz14 mb15 ps-3">
                        {capabilities.slice(0, 4).map((cap, idx) => (
                            <li key={idx} className="mb5">
                                {cap}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Tools as chips */}
                {tools.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb15">
                        {tools.map((tool, i) => (
                            <span key={i} className="badge bg-light text-dark border fz12">{tool}</span>
                        ))}
                    </div>
                )}

                {/* Milestones */}
                {(ms.advance || ms.midway || ms.final) && (
                    <div className="d-flex flex-wrap align-items-center gap-2 mb15">
                        {ms.advance && (
                            <span className="badge bg-success-subtle text-success border">Advance: {ms.advance}</span>
                        )}
                        {ms.midway && (
                            <span className="badge bg-warning-subtle text-warning border">Midway: {ms.midway}</span>
                        )}
                        {ms.final && (
                            <span className="badge bg-primary-subtle text-primary border">Final: {ms.final}</span>
                        )}
                    </div>
                )}

                {/* Footer: author & pricing info */}
                <div className="d-flex justify-content-between align-items-center mt10">
                    <div className="d-flex align-items-center">
                        <span className="position-relative mr10">
                            <img className="rounded-circle wa" src={data?.author?.img} alt="Author" />
                            <span className="online-badges" />
                        </span>
                        <span className="fz14">{data?.author?.name}</span>
                    </div>
                    <div className="budget">
                        <p className="mb-0 body-color">
                            Advance
                            <span className="fz17 fw500 dark-color ms-1">{raw?.milestoneRules?.advance || "—"}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}