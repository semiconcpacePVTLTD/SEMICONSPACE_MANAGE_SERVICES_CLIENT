import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb5 from "@/components/breadcumb/Breadcumb5";

import Listing3 from "@/components/section/Listing3";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 3",
};

export default function ServicePage3() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb5 />
      <Listing3 />
    </>
  );
}
