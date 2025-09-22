import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WorkingProjectInfo from "@/components/dashboard/section/WorkingProjectInfo";
import MobileNavigation2 from "@/components/header/MobileNavigation2";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = { title: "Freeio - Working Projects" };

export default function DashboardWorkingProjectsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <WorkingProjectInfo />
      </DashboardLayout>
    </>
  );
}