import Breadcumb10 from "@/components/breadcumb/Breadcumb10";

import ProjectDetail2 from "@/components/section/ProjectDetails2";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Project Signle",
};

export default function ProjectPageSingle2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />

      <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />
      {/* <Breadcumb11 /> */}
      <ProjectDetail2 />
    </>
  );
}
