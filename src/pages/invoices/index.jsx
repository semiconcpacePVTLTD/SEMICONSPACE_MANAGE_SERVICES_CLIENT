import Invoice from "@/components/section/Invoice";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Invoices",
};

export default function InvoicePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Invoice />
    </>
  );
}
