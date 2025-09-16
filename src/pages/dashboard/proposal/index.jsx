import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProposalInfo from "@/components/dashboard/section/ProposalInfo";

import MobileNavigation2 from "@/components/header/MobileNavigation2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Proposal",
};

export default function DasbPageProposal() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MobileNavigation2 />
      <DashboardLayout>
        <ProposalInfo />
      </DashboardLayout>
    </>
  );
}
