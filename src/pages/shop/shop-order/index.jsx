import OrderComplete1 from "@/components/element/OrderComplete1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Shop Order",
};

export default function ShopPageOrder() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <OrderComplete1 />
    </>
  );
}
