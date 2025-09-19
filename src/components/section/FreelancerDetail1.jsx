import { product1 } from "@/data/product";
import FreelancerAbout1 from "../element/FreelancerAbout1";
import FreelancerSkill1 from "../element/FreelancerSkill1";
import ServiceDetailComment1 from "../element/ServiceDetailComment1";
import ServiceDetailReviewInfo1 from "../element/ServiceDetailReviewInfo1";
import FreelancerFutureCard1 from "../card/FreelancerFutureCard1";

export default function FreelancerDetail1({ data }) {
  const profile = data?.profile;
  const details = data?.profile_details;

  // Fallback mapping to support the provided dataset shape
  const fallbackJobSuccess = typeof data?.job_success === "number" ? `${data.job_success}%` : undefined;
  const jobSuccess = (details?.verified === true && typeof details?.job_success === "number")
    ? `${details.job_success}%`
    : (typeof details?.job_success === "number" ? `${details.job_success}%` : (fallbackJobSuccess || "N/A"));

  // Safely build hourly rate from details or profile; avoid referencing an undefined variable
  const hourlyRate = (details?.hourly_rate !== null)

  const description = details?.bio ?? profile?.bio ?? "N/A";

  return (
    <>
      <section className="pt10 pb90 pb30-md">
        <div className="container">
          <div className="row wow fadeInUp">
            <div className="col-lg-8">

              <div className="service-about">
                <h4>Description</h4>
                <p className="text mb30">{description}</p>
                <hr className="opacity-100 mb60 mt60" />
                <h4 className="mb30">Education</h4>
                <div className="educational-quality timeline">
                  {(details?.education ?? []).length ? (
                    details.education.map((edu, i) => (
                      <div key={i} className={`timeline-item ${i === 0 ? "before-none" : ""}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="tag">
                            {[edu.start_year, edu.end_year].filter(Boolean).join(" - ") || "N/A"}
                          </span>
                          <h5 className="mt15">{edu.degree ?? "N/A"}</h5>
                          <h6 className="text-thm">{edu.institution ?? "N/A"}</h6>
                          <p>{edu.description ?? "N/A"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="wrapper mb40"><p>N/A</p></div>
                  )}
                </div>

                <hr className="opacity-100 mb60" />

                <h4 className="mb30">Work & Experience</h4>
                <div className="educational-quality timeline">
                  {(details?.experience ?? []).length ? (
                    details.experience.map((exp, i) => (
                      <div key={i} className={`timeline-item ${i === 0 ? "before-none" : ""}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="tag">
                            {[exp.start_year, exp.end_year].filter(Boolean).join(" - ") || "N/A"}
                          </span>
                          <h5 className="mt15">{exp.position ?? "N/A"}</h5>
                          <h6 className="text-thm">{exp.company ?? "N/A"}</h6>
                          <p>{exp.description ?? "N/A"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="wrapper mb40"><p>N/A</p></div>
                  )}
                </div>

              </div>
            </div>
            <div className="col-lg-4">
              <div className="blog-sidebar ms-lg-auto">
                <FreelancerAbout1 data={data} />
                <FreelancerSkill1 data={data} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
