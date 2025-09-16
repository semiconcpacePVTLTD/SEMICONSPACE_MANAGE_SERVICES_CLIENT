import Breadcumb10 from "@/components/breadcumb/Breadcumb10";

import FreelancerDetail3 from "@/components/section/FreelancerDetails3";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Freelancer Single",
};

export default function FreelancerPageSingle3() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <div className="bgc-thm3">
        <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />

        <FreelancerDetail3 />
      </div>
    </>
  );
}
