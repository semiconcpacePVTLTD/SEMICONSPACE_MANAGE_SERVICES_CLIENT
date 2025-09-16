import Breadcumb1 from "@/components/breadcumb/Breadcumb1";

import ContactInfo1 from "@/components/section/ContactInfo1";
import GoogleMap1 from "@/components/section/GoogleMap1";
import OurFaq1 from "@/components/section/OurFaq1";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Contact",
};

export default function ContactPage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb1
        title={"Contact us"}
        brief={`We'd love to talk about how we can help you.`}
        isBtnActive={false}
      />
      <ContactInfo1 />
      {/* <GoogleMap1 /> */}
      {/* <OurFaq1 /> */}
    </>
  );
}
