import Breadcumb3 from "@/components/breadcumb/Breadcumb3";

import ShopSingleArea1 from "@/components/section/ShopSingleArea1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Shop Single",
};

export default function ShopPageSingle1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <ShopSingleArea1 />
    </>
  );
}
