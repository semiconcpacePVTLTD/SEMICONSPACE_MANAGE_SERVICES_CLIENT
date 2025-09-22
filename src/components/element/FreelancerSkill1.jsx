export default function FreelancerSkill1({ data }) {
  const skills = Array.isArray(data?.profile_details?.skills)
    ? data.profile_details.skills
    : Array.isArray(data?.skills)
      ? data.skills
      : [];

  return (
    <>
      <div className="sidebar-widget mb30 pb20 bdrs8">
        <h4 className="widget-title">My Skills</h4>
        <div className="tag-list mt30">
          {skills.length ? (
            skills.map((s, i) => <a key={i}>{s}</a>)
          ) : (
            <a>N/A</a>
          )}
        </div>
      </div>
    </>
  );
}
