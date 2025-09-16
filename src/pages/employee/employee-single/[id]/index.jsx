import Breadcumb10 from "@/components/breadcumb/Breadcumb10";
import Breadcumb15 from "@/components/breadcumb/Breadcumb15";

import Header3 from "@/components/header/Header3";
import EmplyeeDetail1 from "@/components/section/EmplyeeDetail1";
import JobInvision1 from "@/components/section/JobInvision1";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Emplyee Single",
};

export default function EmploeePageSingle11() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb10 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb15 />
      <EmplyeeDetail1 />
      <JobInvision1 />
    </>
  );
}
