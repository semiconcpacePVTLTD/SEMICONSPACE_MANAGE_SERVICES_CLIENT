import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ManageServiceInfo from "@/components/dashboard/section/ManageServiceInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Manage Services",
};

export default function DasbPageManageService() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <ManageServiceInfo />
      </DashboardLayout>
    </>
  );
}
