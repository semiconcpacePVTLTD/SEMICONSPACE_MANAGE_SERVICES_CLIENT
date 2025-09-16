import Breadcumb12 from "@/components/breadcumb/Breadcumb12";
import Breadcumb3 from "@/components/breadcumb/Breadcumb3";

import Listing10 from "@/components/section/Listing10";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Job 2",
};

export default function JobPage2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb12 />
      <Listing10 />
    </>
  );
}
