import Breadcumb10 from "@/components/breadcumb/Breadcumb10";
import Breadcumb17 from "@/components/breadcumb/Breadcumb17";

import Header3 from "@/components/header/Header3";
import FreelancerDetail1 from "@/components/section/FreelancerDetail1";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Freelancer Single",
};

export default function FreelancerPageSingle11() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb17 />
      <FreelancerDetail1 />
    </>
  );
}
