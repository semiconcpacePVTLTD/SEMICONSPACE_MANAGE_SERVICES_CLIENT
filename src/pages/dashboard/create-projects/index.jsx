import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateProjectInfo from "@/components/dashboard/section/CreateProjectInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Create Project",
};

export default function DasbPageCreateProject() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <CreateProjectInfo />
      </DashboardLayout>
    </>
  );
}
