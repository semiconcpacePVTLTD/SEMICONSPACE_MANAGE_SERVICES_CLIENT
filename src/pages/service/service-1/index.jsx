import Breadcumb3 from "@/components/breadcumb/Breadcumb3";
import Breadcumb4 from "@/components/breadcumb/Breadcumb4";

import Listing1 from "@/components/section/Listing1";
import TabSection1 from "@/components/section/TabSection1";
import { useLocation } from "react-router-dom";


import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Service 1",
};

export default function ServicePage1() {
    const location = useLocation();
  const { services } = location.state || {}; // destructure safely

  console.log(services);
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* <TabSection1 /> */}
      <Breadcumb3 path={["Home", "Services"]} />
      <Breadcumb4 />
      <Listing1 services={services} />
    </>
  );
}
