import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AddServiceInfo from "@/components/dashboard/section/AddServiceInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Add Service",
};

export default function DasbPageAddService() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <AddServiceInfo />
      </DashboardLayout>
    </>
  );
}
