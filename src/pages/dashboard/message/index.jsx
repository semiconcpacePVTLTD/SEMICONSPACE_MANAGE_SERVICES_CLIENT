import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MessageInfo from "@/components/dashboard/section/MessageInfo";
import { useLocation, useSearchParams } from "react-router-dom";
import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Message",
};

export default function DasbPageMessage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const projectId = searchParams.get("projectId") || location.state?.projectId || "";

  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <MessageInfo projectId={projectId} />
      </DashboardLayout>
    </>
  );
}
