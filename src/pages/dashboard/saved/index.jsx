import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SavedInfo from "@/components/dashboard/section/SavedInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Saved",
};

export default function DasbPageSaved() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <SavedInfo />
      </DashboardLayout>
    </>
  );
}
