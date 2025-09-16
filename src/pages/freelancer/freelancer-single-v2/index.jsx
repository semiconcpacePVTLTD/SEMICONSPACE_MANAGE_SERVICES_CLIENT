import Breadcumb10 from "@/components/breadcumb/Breadcumb10";
import Breadcumb17 from "@/components/breadcumb/Breadcumb17";

import FreelancerDetails2 from "@/components/section/FreelancerDetails2";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Freelancer Single",
};

export default function FreelancerPageSingle2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />

      <FreelancerDetails2 />
    </>
  );
}
