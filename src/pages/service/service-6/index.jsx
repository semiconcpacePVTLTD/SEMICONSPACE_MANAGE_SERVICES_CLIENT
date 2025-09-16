import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb7 from "@/components/breadcumb/Breadcumb7";

import Listing6 from "@/components/section/Listing6";
import TabSection1 from "@/components/section/TabSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 6",
};

export default function ServicePage6() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TabSection1 />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb7 />
      <Listing6 />
    </>
  );
}
