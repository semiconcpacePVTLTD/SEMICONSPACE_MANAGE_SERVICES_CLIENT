import TermsCondition1 from "@/components/section/TermsCondition1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <TermsCondition1 />
    </>
  );
}
