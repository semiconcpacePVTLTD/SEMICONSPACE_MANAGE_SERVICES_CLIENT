import Breadcumb2 from "@/components/breadcumb/Breadcumb2";
import Breadcumb3 from "@/components/breadcumb/Breadcumb3";

import BlogArea2 from "@/components/section/BlogArea2";

import MetaComponent from "@/components/common/MetaComponent";
const metadata = {
  title: "Freeio - Freelance Marketplace ReactJs Template | Blog 2",
};

export default function BlogPage2() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Breadcumb3 path={["Home", "Services", "Design & Creative"]} />
      <Breadcumb2
        title="Freeio Blog"
        brief="Give your visitor a smooth online experience with a solid UX design"
      />
      <BlogArea2 />
    </>
  );
}
