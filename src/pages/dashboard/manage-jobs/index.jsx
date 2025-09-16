import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageJobInfo from "@/components/dashboard/section/ManageJobInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Manage Job",
};

export default function DasbPageManageJobs() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <ManageJobInfo />
      </DashboardLayout>
    </>
  );
}
