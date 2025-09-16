import OurFaqSection1 from "@/components/section/OurFaqSection1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Help",
};

export default function HelpPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <OurFaqSection1 />
    </>
  );
}
