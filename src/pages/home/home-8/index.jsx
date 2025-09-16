import Hero8 from "@/components/hero/Hero8";
import About4 from "@/components/section/About4";
import BrowserCategory1 from "@/components/section/BrowserCategory1";
import CounterInfo1 from "@/components/section/CounterInfo1";
import CtaBanner7 from "@/components/section/CtaBanner7";
import CtaBanner8 from "@/components/section/CtaBanner8";
import NeedSomething1 from "@/components/section/NeedSomething1";
import OurBlog1 from "@/components/section/OurBlog1";
import OurCta4 from "@/components/section/OurCta4";
import OurPartner1 from "@/components/section/OurPartner1";
import TrendingService2 from "@/components/section/TrendingService2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Home 8",
};

export default function HomePage8() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Hero8 />
      <BrowserCategory1 />
      <About4 />
      <TrendingService2 />
      <CtaBanner7 />
      <NeedSomething1 />
      <CtaBanner8 />
      <CounterInfo1 />
      <OurBlog1 />
      <OurPartner1 />
      <OurCta4 />
    </>
  );
}
