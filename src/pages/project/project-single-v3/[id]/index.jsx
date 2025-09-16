import Breadcumb10 from "@/components/breadcumb/Breadcumb10";
import Breadcumb11 from "@/components/breadcumb/Breadcumb11";

import ProjectDetail1 from "@/components/section/ProjectDetail1";
import ProjectDetail3 from "@/components/section/ProjectDetails3";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Project Signle",
};

export default function ProjectPageSingle33() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <div className="bgc-thm3">
        <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />
        {/* <Breadcumb11 /> */}
        <ProjectDetail3 />
      </div>
    </>
  );
}
