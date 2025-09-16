import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatementInfo from "@/components/dashboard/section/StatementInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Statement",
};

export default function DasbPageStatements() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <StatementInfo />
      </DashboardLayout>
    </>
  );
}
