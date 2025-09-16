import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb6 from "@/components/breadcumb/Breadcumb6";

import Listing4 from "@/components/section/Listing4";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 4",
};

export default function ServicePage4() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb6 />
      <Listing4 />
    </>
  );
}
