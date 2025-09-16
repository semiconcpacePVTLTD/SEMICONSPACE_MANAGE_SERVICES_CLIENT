import AboutArea1 from "@/components/section/AboutArea1";
import Breadcumb1 from "@/components/breadcumb/Breadcumb1";
import CounterInfo1 from "@/components/section/CounterInfo1";
import CtaBanner1 from "@/components/section/CtaBanner1";
import OurFaq1 from "@/components/section/OurFaq1";
import OurFeature1 from "@/components/section/OurFeature1";
import OurTeam1 from "@/components/section/OurTeam1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Become seller",
};

export default function BecameSellerPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb1
        title={"Work Your Way"}
        brief={` Give your visitor a smooth online
                                        experience with a solid UX design.`}
        isBtnActive={true}
      />
      <AboutArea1 />
      <OurFeature1 />
      <CtaBanner1 />
      <CounterInfo1 />
      <OurTeam1 />
      <OurFaq1 />
    </>
  );
}
